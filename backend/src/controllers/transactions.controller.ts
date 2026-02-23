import type { Request, Response, NextFunction } from "express";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import { AFRICAS_TALKING_USERNAME } from "../config/env.js";
import querystring from "querystring";
import {
  getPaginatedTransactions,
  removeTransaction,
  transactionStatusAT,
} from "../services/transaction.service.js";

const getTransactionHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const accountNumber = req.query.account as string;

    const options = {
      page,
      limit,
      accountNumber: parseInt(accountNumber),
      hide: false,
    };
    const transactions = await getPaginatedTransactions(options);

    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched sucessfully"),
      );
  },
);
const getTransactions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const accountNumber = req.query.account as string;

    const options = {
      page,
      limit,
      accountNumber: parseInt(accountNumber),
      hide: false,
    };

    const transactions = await getPaginatedTransactions(options);

    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched sucessfully"),
      );
  },
);

const getTransactionDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;
  },
);

const deleteTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const isTransaction = await removeTransaction(id);

    if (!isTransaction)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Transaction doesnt exist or is already deleted",
        ),
      );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Transaction deleted successfully"));
  },
);

const getTransactionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const response = await transactionStatusAT(id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response.data,
          "Transaction status fetched successfully",
        ),
      );
  },
);

export {
  getTransactionHistory,
  getTransactions,
  getTransactionDetails,
  deleteTransaction,
  getTransactionStatus,
};
