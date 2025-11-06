import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type {
  ATTopUpResponse,
  ATTopUpStatus,
  ATValidateTopUp,
  BulkTopUpData,
  Id,
  OperatorDatail,
  OperatorDetailApi,
  ReloadlyTopUp,
  TopUp,
} from "../middlewares/validators/validators.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import csvParser from "csv-parser";
import { uploadsRoot } from "../middlewares/multer.middleware.js";
import path from "path";
import User from "../models/User.js";
import Topup, { TopStatus } from "../models/Topup.js";
import { topUpQueue } from "../queues/topup.queue.js";
import logger from "../logger/logger.winston.js";
import Recipient, { MobileOperator } from "../models/Recipient.js";
import parseCsv from "../utils/parsecsv.js";
import { Index } from "sequelize-typescript";
import { connection, sub } from "../config/database/redis/redis.js";
import { jobProducer } from "../queues/producer.js";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import { randomInt, randomUUID } from "crypto";
import { getCurrency } from "../utils/index.js";
import {
  AFRICAS_TALKING_SANDBOX_USERNAME,
  AFRICAS_TALKING_USERNAME,
  NODE_ENV,
} from "../config/env.js";
import { sequelize } from "../config/database/postgres/postgres.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import Ledger from "../models/Ledger.js";

/*Uploading cvs */
//https://blog.logrocket.com/complete-guide-csv-files-node-js/

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const branch = req.query.branch as string;
    const department = req.query.department as string;
    const name = req.query.name as string;

    const topUps = await getPaginatedTopUps(
      page,
      limit,
      branch,
      department,
      name
    );

    return res
      .status(200)
      .json(new ApiResponse(200, topUps, "Top ups fetched successfully "));
  }
);

//to enable bulk to ups we need firts to read a file that uploaded in csv format
/*
csv parser to prse csv files -> https://www.npmjs.com/package/csv-parser

----initiate background jobs------ 
Validate each top ups operators 
send top ups to multiple recipients
article-> https://medium.com/@sujakhu.umesh/how-i-handled-background-jobs-in-node-js-with-bullmq-and-redis-95a0f17027ff
article -> https://dev.to/mohsenkamrani/nodejs-background-job-processing-with-bull-basics-4633




*/
const sendBulkTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactionId = await reloadlyClient.request(
      "POST",
      "/topups-async",
      {}
    );

    const topUpStatus = await reloadlyClient.request(
      "GET",
      `/topups/${transactionId}/status`
    );
  }
);

const createBulkTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    //read csv and add top up job to queue

    if (!req.file)
      return next(
        ApiError.badRequest(400, req.originalUrl, "No file was uploaded")
      );

    let data: BulkTopUpData[] = [];
    if (req.file && req.file.path) {
      data = await parseCsv(req.file?.path);
      await enqueueTopUps(data, id);
      console.log(data);
      logger.info(`Successfully added ${data.length} to the top ups queue`);
    }

    return res
      .status(202)
      .json(
        new ApiResponse(
          202,
          null,
          `Successfully uploaded ${data.length} topups for processing`
        )
      );
  }
);
// const sendTopUp = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { airtime_amount, operator_code, phone_number }: TopUp = req.body;

//     const recipient = await Recipient.findOne({ where: { phone_number } });

//     if (!recipient)
//       return next(
//         ApiError.notFound(
//           404,
//           req.originalUrl,
//           "Airtime recipient does not exist"
//         )
//       );

//     const topResponse = await reloadlyClient.request<ReloadlyTopUp>(
//       "POST",
//       "/topups",
//       //payload send to reloadly airtime api
//       {
//         amount: airtime_amount,
//         operatorId: operator_code,
//         recipientPhone: {
//           countryCode: "KE",
//           number: phone_number,
//         },
//       }
//     );

//     // console.log(topResponse.data)
//     const operator =
//       topResponse.data.operatorId === 266
//         ? MobileOperator.Safaricom
//         : MobileOperator.Airtel;
//     const status =
//       topResponse.data.status === "SUCCESSFUL"
//         ? TopStatus.Successful
//         : TopStatus.Failed;

//     const topUp = await Topup.create({
//       transaction_id: topResponse.data.transactionId,
//       status,
//       airtime_amount: topResponse.data.deliveredAmount,
//       recipient_id: recipient.id || "",
//       user_id: req.user.id,
//     });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, topUp, "Successfully topped up "));
//   }
// );
const sendTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { airtime_amount, phone_number }: TopUp = req.body;

    const recipient = await Recipient.findOne({ where: { phone_number } });

    if (!recipient)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Airtime recipient does not exist"
        )
      );

    const topResponse = (
      await africasTalkingClient.post<{}, ATTopUpResponse>(
        "/version1/airtime/send",
        //payload send to reloadly airtime api
        {
          username:
            NODE_ENV === "production"
              ? AFRICAS_TALKING_USERNAME
              : AFRICAS_TALKING_SANDBOX_USERNAME,
          recipients: [
            {
              phoneNumber: phone_number,
              amount: `KES ${airtime_amount}`,
            },
          ],
          maxNumRetry: 2,
        }
      )
    ).data;

    const status =
      topResponse.responses[0]?.status === "Sent"
        ? TopStatus.Successful
        : TopStatus.Failed;

    const amount = getCurrency(topResponse.responses[0]?.amount as string);
    const id = await randomInt(600000);
    const topUp = await Topup.create({
      transaction_id: id,
      status,
      airtime_amount: amount,
      recipient_id: recipient.id || "",
      user_id: req.user.id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, topUp, "Successfully topped up "));
  }
);

const autoDetectOperator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number, countryIsoCode }: OperatorDatail = req.body;

    const operatorDetails = await reloadlyClient.request(
      "GET",
      `/operators/auto-detect/phone/${phone_number}/countries/${countryIsoCode}`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          operatorDetails.data,
          "Successfully auto detected operator"
        )
      );
  }
);

const getOperators = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { countryIsoCode = "KE" } = req.params;

    const operators = await reloadlyClient.request(
      "GET",
      `/operators/countries/${countryIsoCode}`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, operators.data, "Operators fetched successfully")
      );
  }
);

const getMnpDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, countryIsoCode } = req.query;

    const mnpData = await reloadlyClient.request(
      "GET",
      `/operators/mnp-lookup/phone/${phoneNumber}/countries/${countryIsoCode}`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, mnpData.data, "Mnp fetched successfully"));
  }
);

const autoDetect = async (
  phoneNumber: string,
  countryIsoCode: string = "KE"
) => {
  const operatorDetails = await reloadlyClient.request<OperatorDetailApi>(
    "GET",
    `/operators/auto-detect/phone/${phoneNumber}/countries/${countryIsoCode}`
  );
  return operatorDetails;
};

const deleteTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const isTopUp = await Topup.findByPk(id);

    if (!isTopUp)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Airtime top up doesnt exist or is already deleted"
        )
      );

    await Topup.destroy({ where: { id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Airtime topup deleted successfully"));
  }
);

const startBulkTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const worker = (await import("../workers/topup.worker.js")).topUpWorker;

    //if worker is nit running run it
    if (worker?.isRunning()) return;

    await worker?.run();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Bulk top ups started successfully"));
  }
);

const getBulkTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    //track open sse connections
    // manageClientConnections(id, res);

    //  // Ensure connection stays alive forever
    req.socket.setKeepAlive(true);
    req.socket.setTimeout(0);

    //configure response stream
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    res.flushHeaders();

    //keep the connection alive
    const interval = setInterval(() => {
      res.write(`:ping\n\n`);
    }, 15000);

    const send = async (message: string) => {
      const sseId = await connection.incr("sse_id");
      res.write(
        `event: topup\n` +
          `data: ${message}\n` +
          `id: ${sseId}\n` +
          `retry: 5000\n\n`
      );
    };

    //subscribe to a redis pub sub channet
    sub.subscribe("topup_updates");
    //;isten for messages and send them to client
    sub.on("message", (_channel, message) => send(message));

    //clean up when client disconnects
    req.on("close", () => {
      sub.removeListener("message", send);
      clearInterval(interval);
      res.end();
      //remove the client
      logger.info(`Server sent events connection closed by ${id}`);
    });
  }
);

const validateTopup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      transactionId,
      phoneNumber,
      sourceIpAddress,
      currencyCode,
      amount,
    }: ATValidateTopUp = req.body;

    // check for airtime recipient in the system
    const recipient = await Recipient.findOne({
      where: { phone_number: phoneNumber },
    });

    // cancel top up if recipient does exist
    if (!recipient) return res.json({ status: "Failed" });

    return res.json({
      status: "Validated",
    });
  }
);

const getTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, status, value, discount, requestId }: ATTopUpStatus =
      req.body;

    // format money amount
    const amount = getCurrency(value);

    // create an atomic transaction
    await sequelize.transaction(async (transaction) => {
      // check for airtime recipient in the system
      const recipient = await Recipient.findOne({
        where: { phone_number: phoneNumber },
        transaction,
      });
      // abort transaction
      if (!recipient) transaction.rollback();

      // get wallet associated with transation
      const wallet = await Wallet.findOne({
        where: { user_id: recipient?.user_id },
        transaction,
      });

      // abort transaction
      if (!wallet) transaction.rollback();

      // create double entry transaction (credit | debit)
      const debitTransaction = await Transaction.create(
        {
          reference: requestId,
          transaction_type: "Debit", // Money moces from system to recipient account
          amount,
          wallet_id: wallet?.id,
        },
        { transaction }
      );

      const creditTransaction = await Transaction.create(
        {
          reference: requestId,
          transaction_type: "Credit", // Money top ups recipient airtime
          amount,
          wallet_id: wallet?.id,
        },
        { transaction }
      );

      // Calculate balances and record in system ledger
      // get last transaction balances
      const lastLedger = await Ledger.findOne({
        where: { wallet_id: wallet?.id },
        order: [["createdAt", "DESC"]],
        transaction,
      });

      const balanceBeforeDebit = Number(
        lastLedger ? lastLedger.balance_after : 0
      );

      const currentAmount = Number(debitTransaction.amount); // money moving out
      // money remaining
      const balanceAfterDebit = balanceBeforeDebit - currentAmount; // debit

      // System ledger can only record the debit for a airtime top up credit is recorded on external service
      await Ledger.create(
        {
          wallet_id: wallet?.id,
          transaction_id: debitTransaction?.id,
          balance_before: balanceBeforeDebit,
          balance_after: balanceAfterDebit,
        },
        { transaction }
      );

      // After transactions are complete record the top up for history tracking
      const topUp = await Topup.create(
        {
          transaction_id: debitTransaction?.id,
          status,
          airtime_amount: amount,
          recipient_id: recipient?.id,
          user_id: recipient?.user_id,
        },
        { transaction }
      );
    });


    return res
      .status(201)
      .json(new ApiResponse(201, null, "Top up received successfully"));
  }
);





const enqueueTopUps = async (data: BulkTopUpData[], id: string) => {
  return await jobProducer.addJobs<BulkTopUpData>(
    topUpQueue,
    "topup-job",
    data,
    id
  );
};

const getPaginatedTopUps = async (
  page = 1,
  limit = 10,
  branch?: string,
  department?: string,
  name?: string
) => {
  //inplements page by page logic
  const offset = (page - 1) * limit;

  //build an object of dynamic filters
  const filters = { branch, department, name };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim())
  );

  const { rows, count } = await Topup.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Recipient,
        where,
        as: "recipient",
        attributes: [
          "id",
          "name",
          "branch",
          "phone_number",
          "department",
          "operator",
        ],
      },
    ],
  });

  return {
    topups: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  };
};

export {
  sendTopUp,
  createBulkTopUps,
  sendBulkTopUps,
  getTopUps,
  validateTopup,
  getTopUpStatus,
  autoDetectOperator,
  getOperators,
  getMnpDetails,
  autoDetect,
  deleteTopUp,
  getBulkTopUpStatus,
  startBulkTopUp,
};
