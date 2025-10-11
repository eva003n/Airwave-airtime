import { REDIS_HOST, REDIS_PORT } from "../env.js";
const connection = {
    host: REDIS_HOST || "redis",
    port: Number(REDIS_PORT) || 6379,
};
export { connection };
