import { Worker, Job, type JobProgress } from "bullmq";
import { topUpCsvSchema } from "../middlewares/validators/validators.js";
import logger from "../logger/logger.winston.js";
import { connection } from "../config/database/redis/redis.js";
import { operatorQueue } from "../queues/operator.queue.js";
import type { ZodError } from "zod";

const sanitizeTopUpData = async (job: Job) => {
  try {
    const { error } = topUpCsvSchema.safeParse(job.data);
    const totalJobs = job.data.rows.length
    for(let i = 1; i <= totalJobs; i++) {

        job.updateProgress(i / totalJobs * 100)
    } 
    throw error;
  } catch (error: any) {
    return error?.issues;
  }
};

export const validateWorker = new Worker(
  "validateQueue",
  async (job: Job) => {
    const rows = job.data.rows;
    const total = Array.isArray(rows)? rows.length: 0;
    const errors: any[] = [];

    // Validate each row individually
    for (let i = 0; i < total; i++) {
      const row = rows[i];

      const result = topUpCsvSchema.safeParse(row);
      if (!result.success) {
        errors.push({
          row: i + 1,
          issues: result.error.issues,
        });
      }

      // Update progress every 10 rows
      if (i % 10 === 0 || i === total - 1) {
        await job.updateProgress(Math.round(((i + 1) / total) * 100));
      }
    }

    return {
      totalRows: total,
      validRows: total - errors.length,
      invalidRows: errors.length,
      errors,
    };
  },
  {
    connection,
  }
);

// 🔊 Listen to progress
validateWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} progress: ${progress}%`);
});

// 🔊 When job completes
validateWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed. Result:`, result);
});
//avoid node js unhandled exception error
validateWorker.on("error", (error) => {
  console.log(error);
});
