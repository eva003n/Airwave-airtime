import type { Request, Response, NextFunction } from "express";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Id } from "../middlewares/validators/validators.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";

const getTransactionHistory = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const accountNumber = req.query.account as string;

        const transactions = await getPaginatedTransactions(page, limit, parseInt(accountNumber), false)

        return res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched sucessfully"))

     
      }
)
const getTransactions = asyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const accountNumber = req.query.account as string;

        const transactions = await getPaginatedTransactions(page, limit, parseInt(accountNumber), true)

        return res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched sucessfully"))

     
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

const deleteTransaction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as Id;

    const isTransaction = await Transaction.findByPk(id);

    if (!isTransaction)
      return next(
        ApiError.notFound(
          404,
          req.originalUrl,
          "Transaction doesnt exist or is already deleted"
        )
      );

    await Transaction.destroy({ where: { id }, force: true  }); // hard delete 

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Transaction deleted successfully"));
  }
);

const getTransactionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const {id} = req.params as Id

    const payload = {
      transactionId: id
    };

    const response = await africasTalkingClient.get<any>("/query/transaction/find", payload);

    return res.status(200).json(new ApiResponse(200, response.data, "Top up transaction fetched successfully"))


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

  const { rows, count } = await Transaction.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Wallet,
        // where,
        as: "account",
        attributes: [
          "account_number",
          "wallet_type",
        ],
      },
    ],
    paranoid: hide
  });

  return {
    transactions: rows,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    totalItems: count,
  };
};


export {
    getTransactionHistory,
    getTransactions,
    getTransactionDetails,
    deleteTransaction,
    getTransactionStatus
}