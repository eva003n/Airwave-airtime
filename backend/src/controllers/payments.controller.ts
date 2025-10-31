import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { BASE_URL, MPESA_BASE_URL, MPESA_SHORT_CODE } from "../config/env.js";
import { mpesaClient } from "../config/mpesa/mpesa.js";
import logger from "../logger/logger.winston.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

const receivePaymentConfirmation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const { TransactionType, TransID, TransAmount, BillRefNumber } = req.body;

    const transaction = await Transaction.create({
        reference: TransID,
        transaction_type: TransactionType,
        amount: TransAmount,
        
    })
  }
);

const validatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate the account number exist
    const { BillRefNumber } = req.body
    console.log(BillRefNumber)

    const accountExist = await User.findOne({where: {account_number: BillRefNumber}})

    if(!accountExist) return res.status(404).json({
      ResultCode: 1,
      ResultDesc: "Rejected: Invalid account number",
    });

    return res.status(202).json({
      ResultCode: 0,
      ResultDesc: "Accepted validation request",
    });

  }
);

const registerC2BUrl = asyncHandler(
  async (Req: Request, res: Response, next: NextFunction) => {
    //   try {
    const payload = {
      ShortCode: MPESA_SHORT_CODE,
      ResponseType: "Cancelled",
      ConfirmationURL: `${BASE_URL}/payments/confirm-payment`,
      ValidationURL: `${BASE_URL}/payments/validate-payment`,
    };
    const response = await mpesaClient.request(
      "POST",
      "/mpesa/c2b/v1/registerurl",
      payload
    );

    return res.status(201).json(new ApiResponse(201, response.data));
    //   } catch (error) {

    //     logger.error(`Failed to registerUrls to mpesa C2B api with error ${error.message}`)
    //   }
  }
);

const receivePayment = asyncHandler(
  async (Req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ShortCode: "600995",
      CommandID: "CustomerPayBillOnline",
      Amount: "100",
      Msisdn: "254708374149",
      BillRefNumber: "90823451",
    };

    const response = await mpesaClient.request(
      "POST",
      "/mpesa/c2b/v1/simulate",
      payload
    );

    res.status(201).json(
        new ApiResponse(201, response.data, "Successfully made payment waiting for confirmation")
    )
  }
);
export { receivePaymentConfirmation, validatePayment, registerC2BUrl, receivePayment };
