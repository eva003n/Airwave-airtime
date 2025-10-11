import type { Request, Response, NextFunction } from "express";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";

const getTransactionHistory = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {

        const transactionHistory = await reloadlyClient.request("GET", "/topups/reports/transactions")

        return res.status(200).json(
            new ApiResponse(200, transactionHistory.data, "Transaction history fetched successfully")
        )
      }
)

const getTransactionDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params as Id 

    const transactionDetails = await reloadlyClient.request("GET", `/topups/reports/transactions/${id}`)     

    return res.status(200).json(
        new ApiResponse(200, transactionDetails.data, "Transaction detail fetched successfully")
    )
  }
)
export {
    getTransactionHistory,
    getTransactionDetails
}