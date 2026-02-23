import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import type {
  MpesaC2BResponse,
  MpesaTransStatus,
  TransactStatus,
} from "../middlewares/validators/validators.js";

import ApiError from "../utils/ApiError.js";
import { mpesaTransactionStatus, receiveMpesaPaymentConfirmation, validateMpesaPayment } from "../services/payment.service.js";


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
      BusinessShortCode,
    }: MpesaC2BResponse = req.body;

    const payment = {
      TransactionType,
      TransID,
      TransAmount,
      BillRefNumber,
      ThirdPartyTransID,
      BusinessShortCode,
    };
    await receiveMpesaPaymentConfirmation(payment)
  

    return res.json({
      ResultCode: 0,
      ResultDesc: "Success",
    });
  }
);

const validatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate the account number exist
    const {
      BillRefNumber,
      BusinessShortCode,
      TransAmount,
      TransID,
      TransactionType,
    }: MpesaC2BResponse = req.body;

    const wallet = await validateMpesaPayment(req.body )
    // Cancel payment if account does not exist
  if (!wallet)
    return res.status(404).json({
      ResultCode: ResponseCodes.invalidAccount,
      ResultDesc: "Rejected",
    });

    // Accept payment if account exists

    return res.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
);


const receivePaymentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { Result: result }: MpesaTransStatus = req.body;
    const parameters = result.ResultParameters.ResultParameter;

    // transaction failed
    if (result.ResultCode !== 0)
      return res.json({
        ResultCode: 0,
        ResultDesc: "Success",
      });

      await receiveMpesaPaymentConfirmation(req.body)   

    return res.json({
      ResultCode: 0,
      ResultDesc: "Success",
    });
  }
);



// Check transaction status
const getMpesaTransactionStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      shortCode,
      reference,
      securityCredential,
      accountNumber,
      type,
      amount,
    }: TransactStatus = req.body;

    const {wallet, created, transaction, response} = await mpesaTransactionStatus(req.body);
   

    if (!wallet)
      return res
        .status(404)
        .json(
          ApiError.notFound(404, req.originalUrl, "Account number doesnt exist")
        );

    //create transaction can be debit or credit


   if(!created) return next(ApiError.conflictRequest(409, req.originalUrl, "Tranaction with that reference number already exist"))

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          Object.assign({ transaction: transaction }, response.data),
          "Transaction status fetched successfully"
        )
      );
  }
);
const retryMpesaPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //notify your system in case the request times out before processing.
    // when a payment request is readded to payment queue
    console.log(req.body);
  }
);
export {
  receivePaymentConfirmation,
  validatePayment,
  receivePaymentStatus,
  getMpesaTransactionStatus,
  retryMpesaPayment,
};
