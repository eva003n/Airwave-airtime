import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { BASE_URL, MPESA_BASE_URL, MPESA_SHORT_CODE } from "../config/env.js";
import { mpesaClient } from "../config/mpesa/mpesa.js";
import logger from "../logger/logger.winston.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import type { MpesaC2BResponse } from "../middlewares/validators/validators.js";
import { sequelize } from "../config/database/postgres/postgres.js";
import Ledger from "../models/Ledger.js";


const ResponseCodes = {
  invalidAccount: "C2B00012",
  invalidAmount: "C2B00013",
  invalidShortCode: "C2B00015",
  otherError: "C2B00016",
};

const receivePaymentConfirmation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      TransactionType,
      TransID,
      TransAmount,
      BillRefNumber,
      ThirdPartyTransID,
    }: MpesaC2BResponse = req.body;

    // console.log(req.body)

    if(!ThirdPartyTransID) return res.json({
      ResultCode: ResponseCodes.otherError,
      ResultDesc: "Rejected",
    });

    // perform an atomic transaction thus if one operation fails all do
    await sequelize.transaction(async (transaction) => {
      //get wallet id from account number
      const wallet = await Wallet.findOne({
        where: { account_number: BillRefNumber },
        transaction,
      });

      if(!wallet) return transaction.rollback();

      const newTransaction = await Transaction.findByPk(ThirdPartyTransID, {
        transaction,
      });
// aborts the transaction if the transaction with the given id does not exist
      if (!newTransaction) return transaction.rollback();

      // update the transaction status
      newTransaction.set({status: "Sucess"})
      await newTransaction.save({transaction})

      const balanceAfter =
        (wallet?.balance as number) + parseFloat(TransAmount as string);
      await Ledger.create(
        {
          wallet_id: wallet?.id as string,
          transaction_id: newTransaction?.id as string,
          amount: parseFloat(TransAmount as string),
          transaction_type: "Credit",
          balance_before: wallet?.balance as number,
          balance_after: balanceAfter,
        },
        { transaction });

        //update wallet balance
        wallet.set({ balance: balanceAfter });
        await wallet.save({transaction})

    });

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
);


const validatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate the account number exist
    console.log(req.body);
    const {
      BillRefNumber,
      BusinessShortCode,
      TransAmount,
      TransID,
      TransactionType,
    }: MpesaC2BResponse = req.body;

    const wallet = await Wallet.findOne({
      where: { account_number: BillRefNumber },
    });

    console.log(wallet)
    if (!wallet)
      return res.json({
        ResultCode: ResponseCodes.invalidAccount,
        ResultDesc: "Rejected",
      });

    const newTransaction = await sequelize.transaction(async (transaction) => {

      const transactionData = await Transaction.create(
        {
          reference: TransID as string,
          transaction_type: TransactionType as string,
          amount: parseFloat(TransAmount as string),
          wallet_id: wallet.id as string,
        },
        { transaction }
      );

      return transactionData
    });
console.log(newTransaction);

    if(!newTransaction) return res.json({
      ResultCode: ResponseCodes.otherError,
      ResultDesc: "Rejected",
    });
console.log("id is " + newTransaction.id)
    return res.json({
      ResultCode: 0,
      ThirdPartyTransID: newTransaction.id,
      ResultDesc: "Accepted",
    });
  }
);

const registerC2BUrl = asyncHandler(
  async (Req: Request, res: Response, next: NextFunction) => {
    //   try {
    const payload = {
      ShortCode: "600998",
      ResponseType: "Cancelled",
      ConfirmationURL: `https://dung-polycarpic-katherina.ngrok-free.dev/api/v1/payments/paybill/confirm-payment`,
      ValidationURL: `https://dung-polycarpic-katherina.ngrok-free.dev/api/v1/payments/paybill/validate-payment`,
    };
    const response = await mpesaClient.request(
      "POST",
      "/mpesa/c2b/v1/registerurl",
      payload
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, response.data, "Successfully registered C2B urls")
      );
  }
);

const receivePayment = asyncHandler(
  async (Req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ShortCode: "600998",
      CommandID: "CustomerPayBillOnline",
      Amount: "100",
      Msisdn: "254708374149",
      BillRefNumber: "29789252",
    };

    const response = await mpesaClient.request(
      "POST",
      "/mpesa/c2b/v1/simulate",
      payload
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          response.data,
          "Successfully made payment waiting for confirmation"
        )
      );
  }
);
export {
  receivePaymentConfirmation,
  validatePayment,
  registerC2BUrl,
  receivePayment,
};
