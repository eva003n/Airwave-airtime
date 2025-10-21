import logger from "../../../logger/logger.winston.js";
import { DB_USER, REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } from "../../env.js";
import {Redis} from "ioredis"
//connection to redis running in local machine or docker
const connection = {
  host: REDIS_HOST || "redis",
  port: Number(REDIS_PORT) || 6379,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 2000, 15000);
    console.log(`⏳ Retrying Redis connection in ${delay / 1000}s`);
    return delay;
  },
};

const redis = new Redis(connection,
);

// Separate clients for Pub/Sub to avoid interference
export const pub = new Redis(connection)
export const sub = new Redis(connection)

pub.on("connect", () => logger.info("✅ Redis Publisher connected"));
sub.on("connect", () => logger.info("✅ Redis Subscriber connected"));

pub.on("error", (err) => logger.error("❌ Redis Pub error:", err));
sub.on("error", (err) => logger.error("❌ Redis Sub error:", err));

export { connection, redis };
