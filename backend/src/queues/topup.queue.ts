import { Queue, Worker } from "bullmq";
import { connection } from "../config/database/redis/redis.js";

const topUpQueue = new Queue("topUpQueue", { connection });
//process 5 tops ups at a time
// topUpQueue.setGlobalConcurrency(5)
// //process 1 yop up per second
// topUpQueue.setGlobalRateLimit(1, 1000)

export { topUpQueue };
