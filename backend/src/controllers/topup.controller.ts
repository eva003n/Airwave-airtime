import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type {
  ATTopUpResponse,
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
import { AFRICAS_TALKING_USERNAME } from "../config/env.js";
import { randomInt, randomUUID } from "crypto";
import { getCurrency } from "../utils/index.js";

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
      await africasTalkingClient.send<{}, ATTopUpResponse>(
        "/version1/airtime/send",
        //payload send to reloadly airtime api
        {
          username: AFRICAS_TALKING_USERNAME,
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

    const amount = getCurrency(
      topResponse.responses[0]?.amount as string
    );
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
        attributes: ["id", "name", "branch", "phone_number", "department", "operator"],
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
  getTopUpStatus,
  autoDetectOperator,
  getOperators,
  getMnpDetails,
  autoDetect,
  deleteTopUp,
  getBulkTopUpStatus,
  startBulkTopUp,
};
