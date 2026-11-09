import { Queue } from "bullmq";
import { connection } from "../config/database/redis/redis.js";


const smsQueue = new Queue("smsQueue", {connection})

export {
    smsQueue
}