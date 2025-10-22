import { Job, tryCatch, Worker } from "bullmq";
import { connection, pub } from "../config/database/redis/redis.js";
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
import { topUpQueue } from "../queues/topup.queue.js";
import logger from "../logger/logger.winston.js";
import { UpdatedAt } from "sequelize-typescript";
import asyncHandler from "../utils/asyncHandler.js";

//this ensure sequelize models are initialized before running process

await connectDatabase();
await runMigrations();

const validateTopUpData = async (data: BulkTopUpData) => {
  const result = topUpCsvSchema.safeParse(data);
  if (result.error) {
    throw result.error.issues;
  }

 
  return result.data;
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

let topUpWorker: Worker
const startWorker = async () => {
topUpWorker = new Worker(
  "topUpQueue",
  async (job: Job<BulkTopUpData>) => {
    try {
      //validate the csv data
      await validateTopUpData(job.data);
      //detect operator the operator
      const operatorDetails = await autoDetect(job.data.phone);

      //make the top up to reloadly
      await sendTopUp(
        job.data.phone,
        job.data.amount,
        operatorDetails.data.operatorId,
        job
      );

      // Publish to Redis for SSE streaming
     
      
    } catch (error) {
      // job.updateData({ ...job.data, status: "Failed" });
     
      logger.error(error.message);
    }
  },
  {
    connection,
    autorun: false
  }
);

const topUpEvants = generateQueueEvents("topUpQueue");

topUpEvants.on("waiting", async({jobId}) => {
  const job = await topUpQueue.getJob(jobId) 
  if(!job) return
   return await pub.publish(
     "topup_updates",
     JSON.stringify({
       ...job,
       status: "Pending",
       updatedAt: new Date().toISOString(),
     })
   );
});

// Status for jobs being processed
topUpWorker.on("active", async (job: Job) => {
  if (!job) return;

  try {
    
      return await pub.publish(
        "topup_updates",
        JSON.stringify({
          ...job.data,
          status: "Processing",
          updatedAt: new Date().toISOString(),
        })
      );
    
  } catch (error) {
    logger.error(error.message);
  }
});
//status for jobs that have failed
topUpWorker.on("failed", async (job, err) => {
  if (!job) return;
  try {
     
   return   await pub.publish(
        "topup_updates",
        JSON.stringify({
          ...job.data,
          status: "Failed",
          updatedAt: new Date().toISOString(),
          error: err.message,
        })
      );
    
      
  } catch (error) {
    logger.error(error.message);
  }
});

// Status for completed jobs
topUpWorker.on("completed", async (job, result, prev) => {
  if(!job) return
  try {
 
    await pub.publish(
      "topup_updates",
      JSON.stringify({
        ...job.data,
        status: "Success",
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    logger.error(error.message)
  }
});


topUpWorker.on("error", (error) => logger.error(`Top up worker failed ${error.message}`))
}





startWorker()
.then(() => logger.info("Successfully started background processor for bulk top ups"))
.catch((err) => {
  logger.error("Top upWorker startup failed:", err);
  process.exit(1);
});



export {
  topUpWorker
}



