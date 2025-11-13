import { type Job, Worker } from "bullmq";
import { connection } from "../config/database/redis/redis.js";
import { getMpesaTransactionStatus } from "../controllers/payments.controller.js";

const paymentWorker = new Worker("paymentQueue", async (job: Job) => {

}, {
  connection,
});

const paymentStatusWorker = new Worker(
  "paymentQueue",
  async (job: Job<{ shortCode: string; transactionId: string }>) => {
  },
  { connection }
);
