import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import csvParser from "csv-parser";
import { uploadsRoot } from "../middlewares/multer.middleware.js";
import path from "path";
import User from "../models/User.js";
import Topup from "../models/Topups.js";
import { topUpQueue } from "../queues/topup.queue.js";
import logger from "../logger/logger.winston.js";
/*Uploading cvs */
//https://blog.logrocket.com/complete-guide-csv-files-node-js/
const getTopUps = asyncHandler(async (req, res, next) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Top up fetched successfully "));
});
//to enable bulk to ups we need firts to read a file that uploaded in csv format
/*
csv parser to prse csv files -> https://www.npmjs.com/package/csv-parser

----initiate background jobs------
Validate each top ups operators
send top ups to multiple recipients
article-> https://medium.com/@sujakhu.umesh/how-i-handled-background-jobs-in-node-js-with-bullmq-and-redis-95a0f17027ff
article -> https://dev.to/mohsenkamrani/nodejs-background-job-processing-with-bull-basics-4633




*/
const sendBulkTopUps = asyncHandler(async (req, res, next) => {
    const transactionId = await reloadlyClient.request("POST", "/topups-async", {});
    const topUpStatus = await reloadlyClient.request("GET", `/topups/${transactionId}/status`);
});
const createBulkTopUps = asyncHandler(async (req, res, next) => {
    //read csv and add top up job to queue
    await readTopUpsFile(req);
    res.status(201).json(new ApiResponse(201, null, "Successfully uploaded file"));
});
const sendTopUp = asyncHandler(async (req, res, next) => {
    const { amount, recipientPhone, operatorId } = req.body;
    const topResponse = await reloadlyClient.request("POST", "/topups", {
        operatorId,
        amount,
        recipientPhone,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, topResponse.data, "Successfully topped up "));
});
const getTopUpStatus = asyncHandler(async (req, res, next) => {
    const { transactionId } = req.params;
    const topUp = await reloadlyClient.request("GET", `/${transactionId}/status`);
    return res
        .status(200)
        .json(new ApiResponse(200, topUp.data, "Top up fetched successfully"));
});
const autoDetectOperator = asyncHandler(async (req, res, next) => {
    const { phoneNumber, countryIsoCode } = req.body;
    const operatorDetails = await reloadlyClient.request("GET", `/operators/auto-detect/phone/${phoneNumber}/countries/${countryIsoCode}`);
    return res
        .status(200)
        .json(new ApiResponse(200, operatorDetails.data, "Successfully auto detected operator"));
});
const getOperators = asyncHandler(async (req, res, next) => {
    const { countryIsoCode = "KE" } = req.params;
    const operators = await reloadlyClient.request("GET", `/operators/countries/${countryIsoCode}`);
    return res
        .status(200)
        .json(new ApiResponse(200, operators.data, "Operators fetched successfully"));
});
const getMnpDetails = asyncHandler(async (req, res, next) => {
    const { phoneNumber, countryIsoCode } = req.query;
    const mnpData = await reloadlyClient.request("GET", `/operators/mnp-lookup/phone/${phoneNumber}/countries/${countryIsoCode}`);
    return res
        .status(200)
        .json(new ApiResponse(200, mnpData.data, "Mnp fetched successfully"));
});
const readTopUpsFile = async (req) => {
    if (req.file && req.file.path) {
        const filePath = path.resolve(req.file.path);
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", async (data) => await topUpQueue.addBulk([data]))
            .on("end", async () => {
            logger.info("Top up jobs successfully added to job queue");
        });
    }
};
const autoDetect = async (phoneNumber, countryIsoCode) => {
    const operatorDetails = await reloadlyClient.request("GET", `/operators/auto-detect/phone/${phoneNumber}/countries/${countryIsoCode}`);
    return operatorDetails;
};
export { sendTopUp, createBulkTopUps, sendBulkTopUps, getTopUps, getTopUpStatus, autoDetectOperator, getOperators, getMnpDetails, autoDetect };
