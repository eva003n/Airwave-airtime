import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type {
  BulkTopUpData,
  Id,
  OperatorDatail,
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
import Topup, { TopStatus } from "../models/Topups.js";
import { topUpQueue } from "../queues/topup.queue.js";
import logger from "../logger/logger.winston.js";
import Recipient, { MobileOperator } from "../models/Recipients.js";
import parseCsv from "../utils/parsecsv.js";
import { Index } from "sequelize-typescript";
import { redis, sub } from "../config/database/redis/redis.js";
import { topUpWorkerEvents } from "../workers/topup.worker.js";
import { da } from "zod/v4/locales";
import { jobProducer } from "../queues/producer.js";

/*Uploading cvs */
//https://blog.logrocket.com/complete-guide-csv-files-node-js/

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const topUps = await getPaginatedTopUps(page, limit);

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
const sendTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { airtime_amount, operator_code, phone_number }: TopUp = req.body;

    const recipient = await Recipient.findOne({ where: { phone_number } });

    if (!recipient)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Airtime recipient does not exist"
        )
      );

    const topResponse = await reloadlyClient.request<ReloadlyTopUp>(
      "POST",
      "/topups",
      //payload send to reloadly airtime api
      {
        amount: airtime_amount,
        operatorId: operator_code,
        recipientPhone: {
          countryCode: "KE",
          number: phone_number,
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
      recipient_id: recipient.id || "",
      user_id: req.user.id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, topUp, "Successfully topped up "));
  }
);

const getTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const topUp = await reloadlyClient.request("GET", `/${id}/status`);

    return res
      .status(200)
      .json(new ApiResponse(200, topUp.data, "Top up fetched successfully"));
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

const autoDetect = async (phoneNumber: string, countryIsoCode: string) => {
  const operatorDetails = await reloadlyClient.request(
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

const getBulkTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    //keep the connection alive
    const interval = setInterval(() => {
      res.write(`:ping\n\n`);
    }, 15000);

    //track open sse connections
    manageClientConnections(id, res);

    //configure response stream
    res.status(200).set({
      "Content-Type": "text/event-stream",
      "Cache-control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders();

    const send = (channel: string, message: string) =>
      res.write(
        `event: topups\n` +
          `data: ${message}\n` +
          `id: ${req.user.id}\n` +
          `retry: 5000\n\n`
      );

    //subscribe to a redis pub sub channet
    sub.subscribe("topup_updates");
    //;isten for messages and send them to client
    sub.on("message", send);

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

//key value strore to keep track of client connections
const connectedClients = new Map();

const manageClientConnections = (clientId: string, res: Response) => {
  // Make sure uniqye clients are added and prevent overwritting

  if (!connectedClients.has(clientId)) {
    connectedClients.set(clientId, new Set());
  }

  //if existing connected client and the user has opened another tab or using another device
  connectedClients.get(clientId).add(res);

  //client disconnect remove the response stream
  res.on("close", () => {
    connectedClients.get(clientId).delete(res);
    if (connectedClients.get(clientId).size === 0) {
      //free up memory, by deletion a client who has no open connections
      connectedClients.delete(clientId);
    }
  });
};

const enqueueTopUps = async (data: BulkTopUpData[], id: string) => {
  return await jobProducer.addJobs<BulkTopUpData>(
    topUpQueue,
    "topup-job",
    data,
    id
  );
};

const getPaginatedTopUps = async (page = 1, limit = 10) => {
  //inplements page by page logic
  const offset = (page - 1) * limit;

  const { rows, count } = await Topup.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: {
      model: Recipient,
      as: "recipient",
      attributes: ["id", "name", "branch", "phone_number"],
    },
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
  getTopUpStatus,
  autoDetectOperator,
  getOperators,
  getMnpDetails,
  autoDetect,
  deleteTopUp,
  getBulkTopUpStatus,
};
