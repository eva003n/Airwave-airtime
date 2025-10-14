// import { Worker, Job } from "bullmq";
// import { bulkTopUpDataSchema } from "../middlewares/validators/validators.js";
// import logger from "../logger/logger.winston.js";
// import { connection } from "../config/database/redis/redis.js";
// import { operatorQueue } from "../queues/operator.queue.js";

// const sanitizeTopUpData = async (job: Job) => {
//     const {error} = bulkTopUpDataSchema.safeParse(job.data)
//  return error?.issues



// }
// const validateWorker = new Worker("validateQueue", sanitizeTopUpData, {connection, autorun : false});


// validateWorker.on("completed", (job: Job, returnValue: any) => {
//     operatorQueue.add("verifyOperator", job.data)

// })

// validateWorker.on("progress", (job: Job, progress: number | object) => {
//     console.log(`job ${job.id} progress ${progress}` )


// })

// //avoid node js unhandled exception error
// validateWorker.on("error", (error) => {
//     console.log(error)
// })