import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type { Id, OperatorDatail, TopUp } from "../middlewares/validators/validators.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

/*Uploading cvs */
//https://blog.logrocket.com/complete-guide-csv-files-node-js/

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    return res.status(200).json(new ApiResponse(200, null, "Top up fetched successfully "))


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
    const transactionId = await reloadlyClient.request("POST", "/topups-async", {

    })

    const topUpStatus = await reloadlyClient.request(
      "GET",
      `/topups/${transactionId}/status`
    );
  }

)
const sendTopUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {amount, recipientPhone, operatorId}: TopUp = req.body 
    const topResponse =  await reloadlyClient.request<TopUp>("POST", "/topups", {
       operatorId,
       amount,
       recipientPhone,
     });

     return res.status(200).json(
      new ApiResponse(200, topResponse.data, "Successfully topped up ")
     )
  }

 
)

const getTopUpStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { transactionId } = req.params as Id


const topUp = await reloadlyClient.request("GET", `/${transactionId}/status`)



    return res
      .status(200)
      .json(
        new ApiResponse(200, topUp.data, "Top up fetched successfully")
      );
  }
);


const autoDetectOperator = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {phoneNumber,countryIsoCode}: OperatorDatail = req.body;

    const operatorDetails = await reloadlyClient.request("GET", `/operators/auto-detect/phone/${phoneNumber}/countries/${countryIsoCode}`)

   return res.status(200).json(
    new ApiResponse(200, operatorDetails.data, "Successfully auto detected operator")

   )
  }

)

const getOperators = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {countryIsoCode = "KE" } = req.params 

      const operators = await reloadlyClient.request("GET", `/operators/countries/${countryIsoCode}`)

      return res.status(200).json(
        new ApiResponse(200, operators.data, "Operators fetched successfully")

      )
    }
)

const getMnpDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {phoneNumber, countryIsoCode}  = req.query

      const mnpData = await reloadlyClient.request("GET", `/operators/mnp-lookup/phone/${phoneNumber}/countries/${countryIsoCode}`)

      return res.status(200).json(
        new ApiResponse(200, mnpData.data, "Mnp fetched successfully")
      )
    }
)

export { sendTopUp, sendBulkTopUps, getTopUps, getTopUpStatus, autoDetectOperator, getOperators, getMnpDetails };

