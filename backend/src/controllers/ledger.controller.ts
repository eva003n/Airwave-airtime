import Ledger from "../models/Ledger.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import type { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPaginatedTransactions } from "../services/transaction.service.js";


const getLedgers = asyncHandler(
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
    const ledgers = await getPaginatedTransactions(options);

    return res
      .status(200)
      .json(new ApiResponse(200, ledgers, "Ledgers fetched sucessfully"));
  },
);

export { getLedgers };
