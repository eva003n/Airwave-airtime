import logger from "../../../logger/logger.winston.js";
import {
  REDIS_URL,
} from "../../env.js";
import { Redis, type RedisOptions } from "ioredis";

const url = REDIS_URL as string || "http://localhost:6379" ;

//connection to redis running in local machine or docker
const parsed = new URL(url)

const connection = new Redis({
  host: parsed.hostname,
  port: Number(parsed.port),
  username: parsed.username,
  password: parsed.password || undefined,
  maxRetriesPerRequest: null,
  tls: parsed.protocol.startsWith("rediss://")? {} : undefined,
  connectTimeout: 15000 //15s
});

connection.on("error", (err) => {
  logger.info(`❌ Redis connection error ${err.message}`)
  }
)

// Separate clients for Pub/Sub to avoid interference
export const pub = new Redis(connection.options);
export const sub = new Redis(connection.options);

pub.on("connect", () => logger.info("✅ Redis Publisher connected"));
sub.on("connect", () => logger.info("✅ Redis Subscriber connected"));

pub.on("error", (err) => logger.error("❌ Redis Pub error:", err));
sub.on("error", (err) => logger.error("❌ Redis Sub error:", err));

export { connection };
