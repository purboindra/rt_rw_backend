import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import prisma from "../db";
import { logger } from "../logger";

const app = initializeApp({
  credential: applicationDefault(),
});

const messaging = getMessaging(app);

const BATCH = 50;
const SLEEP_MS = 1000;
const ERROR_BASE_MS = 2000;
const IDLE_MS = 2000;

async function claimIds(limit = 50): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    UPDATE outbox
    SET "lockedAt" = NOW()
    WHERE id IN (
      SELECT id FROM outbox
      WHERE "processedAt" IS NULL
        AND ("nextAttemptAt" IS NULL OR "nextAttemptAt" <= NOW())
        AND "lockedAt" IS NULL
      ORDER BY "createdAt"
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id
  `;
  return rows.map((r) => r.id);
}

async function handle(item: any) {
  logger.debug(item, "Item handle");
  if (item.type === "report.created") {
    const { rtId, reportId, title } = item.payload as any;
    try {
      await messaging.send({
        topic: `rt.${rtId}.admin`,
        notification: { title: "Laporan baru", body: title },
        data: { reportId, rtId },
      });
    } catch (error) {
      logger.error({ error }, "Error send notif handle");
    }
  } else {
    logger.warn({ type: item.type }, "unknown outbox type; skipping");
  }
}

async function processOnce() {
  const ids = await claimIds(50);
  if (ids.length === 0) {
    logger.debug("outbox idle");
    return { processed: 0 };
  }

  const items = await prisma.outbox.findMany({
    where: { id: { in: ids } },
  });

  for (const item of items) {
    try {
      await handle(item);
      await prisma.outbox.update({
        where: { id: item.id },
        data: { processedAt: new Date(), error: null, lockedAt: null },
      });
    } catch (e: any) {
      const attempts = item.attempts + 1;
      const backoffMs = ERROR_BASE_MS * Math.min(8, 2 ** (attempts - 1));
      logger.error({ id: item.id, attempts, err: e?.message }, "process failed; retry later");
      await prisma.outbox.update({
        where: { id: item.id },
        data: {
          attempts,
          error: String(e).slice(0, 500),
          lockedAt: null,
          nextAttemptAt: new Date(Date.now() + backoffMs),
        },
      });
    }
  }
  return { processed: items.length };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loop() {
  logger.info("Outbox worker started");
  await prisma.$connect();

  while (true) {
    try {
      const { processed } = await processOnce();
      await sleep(processed === 0 ? IDLE_MS : 0);
    } catch (e: any) {
      logger.error({ err: e?.message }, "processOnce error; backing off");
      await sleep(ERROR_BASE_MS);
    }
  }
}

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig as NodeJS.Signals, async () => {
    logger.info({ sig }, "worker shutting down");
    try {
      await prisma.$disconnect();
    } catch {}
    process.exit(0);
  });
});

loop().catch((err) => {
  logger.fatal({ err }, "worker crashed at top-level");
  process.exit(1);
});
