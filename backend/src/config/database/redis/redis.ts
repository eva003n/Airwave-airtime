import { DB_USER, REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } from "../../env.js";
import {Redis} from "ioredis"
//connection to redis running in local machine or docker
const connection = {
  host: REDIS_HOST || "redis",
  port: Number(REDIS_PORT) || 6379,
};

const redis = new Redis({
  ...connection,
});


export { connection, redis };
