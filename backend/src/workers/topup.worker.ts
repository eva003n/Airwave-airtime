import { Job, tryCatch, Worker } from "bullmq";
import { connection, redis } from "../config/database/redis/redis.js";
import {
  topUpCsvSchema,
  type BulkTopUpData,
  type OperatorDetailApi,
  type ReloadlyTopUp,
} from "../middlewares/validators/validators.js";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import Recipient from "../models/Recipients.js";
import Topup, { MobileOperator, TopStatus } from "../models/Topups.js";
import { app } from "../app.js";
import type User from "../models/User.js";
import { generateQueueEvents } from "./index.js";
import { connectDatabase } from "../config/database/postgres/postgres.js";
import { runMigrations } from "../migrate.js";

//this ensure sequelize models are initialized before running process

  await connectDatabase();
  await runMigrations()


const validateTopUpData = async (job: Job<BulkTopUpData>) => {
  const result = topUpCsvSchema.safeParse(job.data);
  if (result.error) {
    throw result.error.issues;
  }
  await redis.hset(`job:${job.id}`, {
    name: job.data.name,
    phoneNumber: job.data.phone,
    amount: job.data.amount,
    operator: job.data.operator,
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};
const autoDetect = async (phoneNumber: string) => {
  const countryIsoCode = "KE";
  const operatorDetails = await reloadlyClient.request<OperatorDetailApi>(
    "GET",
    `/operators/auto-detect/phone/${phoneNumber}/countries/${countryIsoCode}`
  );
  return operatorDetails;
};

const sendBulkTopUps = async (job: Job) => {
  const transactionId = await reloadlyClient.request(
    "POST",
    "/topups-async",
    {}
  );

  const topUpStatus = await reloadlyClient.request(
    "GET",
    `/topups/${transactionId}/status`
  );
};

const sendTopUp = async (
  phoneNumber: string,
  airtimeAmount: number,
  operatorCode: number,
  job: Job
) => {
  const recipient = await Recipient.findOne({
    where: { phone_number: phoneNumber },
  });

  if (!recipient) throw new Error("Recipient does not exist or is deleted");

  const topResponse = await reloadlyClient.request<ReloadlyTopUp>(
    "POST",
    "/topups",
    //payload send to reloadly airtime api
    {
      amount: airtimeAmount,
      operatorId: operatorCode,
      recipientPhone: {
        countryCode: "KE",
        number: phoneNumber,
      },
    }
  );

  // console.log(topResponse.data)
  const operator =
    topResponse.data.operatorId === 266
      ? MobileOperator.Safaricom
      : MobileOperator.Airtel;
  const status =
    topResponse.data.status === "SUCCESSFUL"
      ? TopStatus.Successful
      : TopStatus.Failed;

  const topUp = await Topup.create({
    transaction_id: topResponse.data.transactionId,
    phone_number: topResponse.data.recipientPhone,
    operator,
    status,
    airtime_amount: topResponse.data.deliveredAmount,
    recipient_id: recipient.id as string,
    user_id: job.data.userId, //this property is added to job after parsing
  });
};

const topUpWorker = new Worker(
  "topUpQueue",
  async (job: Job<BulkTopUpData>) => {
    try {
      //validate the csv data
      validateTopUpData(job);
      //detect operator the operator
      const operatorDetails = await autoDetect(job.data.phone);

      //make the top up
      await sendTopUp(
        job.data.phone,
        job.data.amount,
        operatorDetails.data.operatorId,
        job
      );
    } catch (error) {
      console.log(error.message);
    }
  },
  {
    connection,
    maxStartedAttempts: 5,
  }
);

const topUpWorkerEvents = generateQueueEvents("topUpQueue");

// Status for jobs being processed
topUpWorker.on("active", async (job) => {
  await redis.hset(`job:${job.id}`, {
    id: job.id,
    status: "Processing",
    updatedAt: new Date(),
  });
  console.log(`Job id_${job.id} started being processed`);
});
//status for jobs that have failed
topUpWorker.on("failed", async (job, error) => {
  await redis.hset(`job:${job?.id}`, {
    status: "Failed",
    // reason: error.message,
    updatedAt: new Date(),
  });
  console.log(`Job id_${job?.id} failed because ${error.message}`);
});

// Status for completed jobs
topUpWorker.on("completed", async (job, result, prev) => {
  await redis.hset(`job:${job?.id}`, {
    status: "Success",
    updatedAt: new Date(),
  });
  console.log(`Job id_${job?.id} has been completed`);
});

export { topUpWorkerEvents };
