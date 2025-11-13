import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  AFRICAS_TALKING_PAYBILL,
  AFRICAS_TALKING_SANDBOX_PAYBILL,
  BASE_URL,
  MPESA_BASE_URL,
  MPESA_INITIATOR,
  MPESA_SANDBOX_INITIATOR,
  MPESA_SANDBOX_SECURITY_CREDENTIAL,
  MPESA_SANDBOX_SHORT_CODE,
  MPESA_SECURITY_CREDENTIAL,
  MPESA_SHORT_CODE,
  NODE_ENV,
  SERVER_URL,
} from "../config/env.js";
import { mpesaClient } from "../config/mpesa/mpesa.js";
import logger from "../logger/logger.winston.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import type {
  MpesaC2BResponse,
  MpesaTransStatus,
  TransactStatus,
} from "../middlewares/validators/validators.js";
import { sequelize } from "../config/database/postgres/postgres.js";
import Ledger from "../models/Ledger.js";
import ApiError from "../utils/ApiError.js";

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
    console.log(BillRefNumber);

    // perform an atomic transaction thus if one operation fails all do
    await sequelize.transaction(async (transaction) => {
      //get wallet by account number
      const wallet = await Wallet.findOne({
        where: { account_number: parseInt(BillRefNumber) },
        transaction,
      });

      // Cancel transaction if wallet does not exist
      if (!wallet) return transaction.rollback();
      const walletId = wallet.id;

      // record double entry transaction
      // credit transaction
      const creditTransaction = await Transaction.create(
        {
          reference: TransID as string,
          transaction_type: "Credit",
          status: "Success",
          amount: parseFloat(TransAmount as string),
          wallet_id: wallet?.id as string,
        },
        { transaction }
      );
      //debit transaction is done on the mpesa side

      // first get the last balance from ledger for particulat wallet
      const lastLedger = await Ledger.findOne({
        where: { wallet_id: walletId },
        order: [["createdAt", "DESC"]],
        transaction,
      });

      const balanceBefore = Number(lastLedger ? lastLedger.balance_after : 0);
      const amount = Number(creditTransaction.amount);

      const balanceAfter = balanceBefore + amount;

      //Record transaction
      await Ledger.create(
        {
          wallet_id: wallet?.id as string,
          transaction_id: creditTransaction?.id as string,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
        },
        { transaction }
      );

      // update wallet balance
      wallet.set({ balance: balanceAfter });
      await wallet.save({ transaction });
    });

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

    // Check if the account number exists
    const wallet = await Wallet.findOne({
      where: { account_number: BillRefNumber },
    });

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

const registerC2BUrl = asyncHandler(
  async (Req: Request, res: Response, next: NextFunction) => {
    //   try {
    const payload = {
      ShortCode: "600999",
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

const receivePaymentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { Result }: MpesaTransStatus = req.body;

    // transaction failed
    if (Result.ResultCode !== 0)
      return res.json({
        ResultCode: 0,
        ResultDesc: "Success",
      });

    const parameters = Result.ResultParameters.ResultParameter;

    type TransactStatus = {
      TransactionStatus: "Completed" | "Failed",
      // [k: string]: string
    };
    const data = Object.fromEntries(parameters.map((p) => [p.Key, p.Value]));
    console.dir(parameters);
    console.dir(data);

    const isTransaction = await Transaction.findOne({
      where: { reference: Result.TransactionID },
    });
   
    await sequelize.transaction(async (transaction) => {
      //get wallet
      const wallet = await Wallet.findByPk(isTransaction?.wallet_id, {
        transaction,
      });

      // Cancel transaction if wallet does not exist
      if (!wallet || !isTransaction) return transaction.rollback();

      // first get the last balance from ledger for particular wallet --> (balance_after)
      const lastLedger = await Ledger.findOne({
        where: { wallet_id: wallet.id },
        order: [["createdAt", "DESC"]],
        transaction,
      });

      // auto calculate balances based on transaction type
      const balanceBefore = Number(lastLedger ? lastLedger.balance_after : 0);
      const amount = Number(isTransaction?.amount);
      let balanceAfter = 0;

      if (isTransaction?.transaction_type === "Credit") {
        // credit
        balanceAfter = balanceBefore + amount;
      } else {
        // Debit
        balanceAfter = balanceBefore && balanceBefore - amount;
      }

      // Record transaction in ledger
      await Ledger.create(
        {
          wallet_id: wallet.id as string,
          transaction_id: isTransaction?.id as string,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
        },
        { transaction }
      );

      //update wallet balance
      wallet.set({ balance: balanceAfter });
      await wallet.save({ transaction });
    });

    isTransaction?.set({
      status: (data as TransactStatus).TransactionStatus === "Completed"? "Success" : "Failed"
    });

    // update transaction status
    await isTransaction?.save();

    return res.json({
      ResultCode: 0,
      ResultDesc: "Success",
    });
  }
);

// make paymnet to africas talking using paybill thus B2B
const makePaymentAfricasTalking = async (
  amount: number,
  accountNumber: number
) => {
  const payload = {
    Initiator:
      NODE_ENV === "production" ? MPESA_SANDBOX_INITIATOR : MPESA_INITIATOR,
    SecurityCredential:
      NODE_ENV === "production"
        ? MPESA_SANDBOX_SECURITY_CREDENTIAL
        : MPESA_SECURITY_CREDENTIAL,
    "Command ID": "BusinessPayBill",
    SenderIdentifierType: "4",
    RecieverIdentifierType: "4",
    Amount: amount,
    PartyA:
      NODE_ENV === "production" ? MPESA_SANDBOX_SHORT_CODE : MPESA_SHORT_CODE,
    PartyB:
      NODE_ENV === "production"
        ? AFRICAS_TALKING_PAYBILL
        : AFRICAS_TALKING_SANDBOX_PAYBILL,
    AccountReference: accountNumber,
    Requester: "254700000000",
    Remarks: "Payment",
    ResultURL: `${BASE_URL}/api/v1/payments/paybill/transaction-status/result`,
    QueueTimeOutURL: `${BASE_URL}/api/v1/payments/paybill/transaction/timeout`,
    Occassion: "Making payment",
  };

  const response = await mpesaClient.request(
    "POST",
    "/mpesa/b2b/v1/paymentrequest"
  );
};

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

    const wallet = await Wallet.findOne({
      where: { account_number: accountNumber },
    });

    if (!wallet)
      return res
        .status(404)
        .json(
          ApiError.notFound(404, req.originalUrl, "Account number doesnt exist")
        );

    //create transaction can be debit or credit
   const [transaction, created] = await Transaction.findOrCreate({
     where: { reference: reference },
     defaults: {
       reference: reference,
       transaction_type: type,
       amount,
       wallet_id: wallet.id as string,
     },
   });

   if(!created) return next(ApiError.conflictRequest(409, req.originalUrl, "Tranaction with that reference number already exist"))

    const payload = {
      Initiator:
        NODE_ENV === "production" ? MPESA_INITIATOR : MPESA_SANDBOX_INITIATOR,
      // SecurityCredential:
      //   NODE_ENV === "production"
      //     ? MPESA_SECURITY_CREDENTIAL
      //     : MPESA_SANDBOX_SECURITY_CREDENTIAL,
      SecurityCredential: securityCredential,
      CommandID: "TransactionStatusQuery",
      TransactionID: reference,
      PartyA: `${shortCode}`,
      IdentifierType: "4",
      ResultURL: `${BASE_URL}/api/v1/payments/paybill/transaction-status/result`,
      QueueTimeOutURL: `${BASE_URL}/api/v1/payments/paybill/transaction/timeout`,
      Remarks: "Checking transaction status",
      Occasion: "Reconciliation",
    };
    const response = await mpesaClient.request(
      "POST",
      "/mpesa/transactionstatus/v1/query",
      payload
    );

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
