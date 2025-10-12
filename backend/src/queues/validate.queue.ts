import { Queue } from "bullmq";
import { connection } from "../config/database/redis/redis.js";


const validateQueue = new Queue("validateQueue", {connection})

export {
    validateQueue
}