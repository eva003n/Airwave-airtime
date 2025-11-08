import logger from "../../../logger/logger.winston.js";
import {
  DB_USER,
  NODE_ENV,
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_URL,
  REDIS_USER,
} from "../../env.js";
import { Redis, type RedisOptions } from "ioredis";

//connection to redis running in local machine or docker
const parsed = new URL(REDIS_URL as string)

const connection = new Redis({
  host: (NODE_ENV === "production" ? parsed.hostname : REDIS_HOST ) as string,
  port: NODE_ENV === "production" ? Number(parsed.port) : Number(REDIS_PORT),
  username: NODE_ENV === "production"? parsed.username : REDIS_USER,
  password: NODE_ENV === "production"? parsed.password || undefined : REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  tls: parsed.protocol === "rediss:"? {} : undefined,
  connectTimeout: 15000 //15s
});

connection.on("error", (err) => logger.info(`Redis connection error ${err.message}`))
// Separate clients for Pub/Sub to avoid interference
export const pub = new Redis(connection.options);
export const sub = new Redis(connection.options);

pub.on("connect", () => logger.info("✅ Redis Publisher connected"));
sub.on("connect", () => logger.info("✅ Redis Subscriber connected"));

pub.on("error", (err) => logger.error("❌ Redis Pub error:", err));
sub.on("error", (err) => logger.error("❌ Redis Sub error:", err));

export { connection };
