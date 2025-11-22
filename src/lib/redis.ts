import { createClient } from "redis";
import { logger } from "../logger";

const redis = createClient({ url: process.env.REDIS_PUBLIC_URL });

redis.on("error", (err) => logger.error({ err }, "Redis Client Error"));

export default redis;
