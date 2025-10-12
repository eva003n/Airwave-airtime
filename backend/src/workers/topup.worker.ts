import { tryCatch, Worker } from "bullmq";
import { connection } from "../config/database/redis/redis.js";
import { autoDetect } from "../controllers/topup.controller.js";

const topUpWorker = new Worker("topUpQueue", async (job) => {
  try {
    //validate the operator
    await autoDetect(job.data.phoneNumber, job.data.countryIsoCode);
    //make the top up
  } catch (error) {}
});
