import { formatInTimeZone } from "date-fns-tz";

export const getTelegramKeyForRedis = (arg: string) => {
  const token = arg.slice("verify_".length);
  const key = `tg:verify:${token}`;
  return key;
};

export function pruneUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export const TZ = "Asia/Jakarta";

export function todayKey(date = new Date()): string {
  return formatInTimeZone(date, TZ, "yyyyMMdd");
}

export function buildReportId(seq: number, dateKey: string): string {
  return `REP/${String(seq).padStart(6, "0")}-${dateKey}`;
}

export function buildActivityId(seq: number, dateKey: string): string {
  return `ACT/${String(seq).padStart(6, "0")}-${dateKey}`;
}
