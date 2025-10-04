import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type { Id, TopUp } from "../middlewares/validators/validators.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

const getTopUps = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

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

export { sendTopUp, sendBulkTopUps, getTopUps, getTopUpStatus };
