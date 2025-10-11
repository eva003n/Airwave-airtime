import { Queue, Worker } from "bullmq";
import { connection } from "../config/redis/index.js";

const topUpQueue = new Queue("topUpQueue", { connection });

export {
    topUpQueue
}
