import { Queue } from "bullmq";
import { connection } from "../config/database/redis/redis.js";


const operatorQueue = new Queue("operatorQueue", {connection})

export {
    operatorQueue
}