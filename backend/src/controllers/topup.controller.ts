import type {
  ATTopUpResponse,
  ATTopUpStatus,
  ATValidateTopUp,
  BulkTopUpData,
  FilterOptions,
  Id,
  OperatorDatail,
  OperatorDetailApi,
  ReloadlyTopUp,
  TopUp,
} from "../middlewares/validators/validators.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  type Request,
  type Response,
  type NextFunction,
  response,
} from "express";
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
import { randomBytes, randomInt, randomUUID } from "crypto";
import { getCurrency } from "../utils/index.js";
import {
  AFRICAS_TALKING_SANDBOX_USERNAME,
  AFRICAS_TALKING_USERNAME,
  BASE_URL,
  NODE_ENV,
} from "../config/env.js";
import { sequelize } from "../config/database/postgres/postgres.js";
import Transaction, { TransactionStatus } from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import Ledger from "../models/Ledger.js";
import { where } from "sequelize";
import axios from "axios";
import { addBulkTopUps, beginBulkTopUp, checkBulkTopUpStatus, getPaginatedTopUps, makeTopUp, removeTopUp, verifyTopUp } from "../services/topup.service.js";
import { makeIssue } from "zod/v3";

/*Uploading cvs */
//https://blog.logrocket.com/complete-guide-csv-files-node-js/

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   

    const filterOptions: FilterOptions = {
     page: parseInt(req.query.page as string) || 1,
     limit: parseInt(req.query.limit as string) || 10,
     branch: req.query.branch as string,
     department: req.query.department as string,
     name: req.query.name as string
    }

    const topUps = await getPaginatedTopUps(filterOptions);

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


const createBulkTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
    //read csv and add top up job to queue

    if (!req.file)
      return next(
        ApiError.badRequest(400, req.originalUrl, "No file was uploaded")
      );

    const data =  await addBulkTopUps(req.file, id)

    return res
      .status(202)
      .json(
        new ApiResponse(
          202,
          null,
          `Successfully added ${data.length} topups for processing`
        )
      );
  }
);

const sendTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { airtime_amount, phone_number, operator }: TopUp = req.body;
    const userId = req.user.id;

const topUp = {
  airtime_amount,
  phone_number,
  operator

}
    const {recipient, topUpData} = await makeTopUp(topUp, req.user)

    if(!recipient) {
      return next(
            ApiError.notFound(
              404,
              req.originalUrl,
              "Airtime recipient does not exist"
            ))
    }

    return res
          .status(200)
          .json(new ApiResponse(200, topUpData, "Successfully topped up "));
   
});



const deleteTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const {isTopUp} = await removeTopUp(id);

    if (!isTopUp)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Airtime top up doesnt exist or is already deleted"
        )
      );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Airtime topup deleted successfully"));
  }
);

const startBulkTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
   await beginBulkTopUp();

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
      requestMetadata,
    }: ATValidateTopUp = req.body;

    const topUpData: ATValidateTopUp = {
      transactionId,
      phoneNumber,
      sourceIpAddress,
      currencyCode,
      amount,
      requestMetadata,
    }
    const {recipient} = await verifyTopUp(topUpData)

     if (!recipient) return res.status(404).json({ status: "Failed" });
 

    return res.json({
      status: "Validated",
    });
  }
);

const getTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      phoneNumber,
      status,
      value,
      discount,
      requestId,
      requestMetadata,
    }: ATTopUpStatus = req.body;

    // format money amount
    const amount = getCurrency(value);
    const _discount = getCurrency(discount);

    const topUpStatus: ATTopUpStatus = {
 phoneNumber,
      status,
      value,
      discount,
      requestId,
      requestMetadata,
    }
    await checkBulkTopUpStatus(topUpStatus)
  
    return res
      .status(201)
      .json(new ApiResponse(201, null, "Top up received successfully"));
  }
);


export {
  sendTopUp,
  createBulkTopUps,
  getTopUps,
  validateTopup,
  getTopUpStatus,
  deleteTopUp,
  getBulkTopUpStatus,
  startBulkTopUp,
};
