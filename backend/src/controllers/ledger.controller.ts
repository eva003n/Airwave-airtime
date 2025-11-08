import Ledger from "../models/Ledger.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import type { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



const getLedgers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const accountNumber = req.query.account as string;

    const ledgers = await getPaginatedTransactions(
      page,
      limit,
      parseInt(accountNumber),
      false
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, ledgers, "Ledgers fetched sucessfully")
      );
  }
);


const getPaginatedTransactions = async (
  page = 1,
  limit = 10,
  account?: number,
  hide?: boolean
) => {
  //inplements page by page logic
  const offset = (page - 1) * limit;

  //build an object of dynamic filters
  const filters = { account_number: account || 0 };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim())
  );

  const { rows, count } = await Ledger.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Wallet,
        // where,
        as: "accountInfo",
        attributes: [
          "account_number",
          "wallet_type",
        ],
      },
      {
        model: Transaction,
        // where,
        as: "transInfo",
        attributes: [
          "transaction_type",
        ],
      },
    ],
    paranoid: hide
  });

  return {
    ledgers: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  };
};

export {
    getLedgers
}