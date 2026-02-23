import {sequelize} from "../config/database/postgres/postgres.js";
import Ledger from "../models/Ledger.js";
import Wallet from "../models/Wallet.js";
import type{ MpesaC2BResponse, MpesaTransStatus, TransactStatus } from "../middlewares/validators/validators.js";
import Transaction, { TransactionStatus } from "../models/Transaction.js";
import { NODE_ENV, MPESA_INITIATOR, MPESA_SANDBOX_INITIATOR, BASE_URL } from "../config/env.js";
import { mpesaClient } from "../config/mpesa/mpesa.js";




export const receiveMpesaPaymentConfirmation = async(payment: MpesaC2BResponse) => {

      // perform an atomic transaction thus if one operation fails all do
    await sequelize.transaction(async (transaction) => {
      //get wallet by account number
      const wallet = await Wallet.findOne({
        where: { account_number: parseInt(payment.BillRefNumber) },
        transaction,
      });

      // Cancel transaction if wallet does not exist
      if (!wallet) return transaction.rollback();
      const walletId = wallet.id;

      // record double entry transaction
      // credit transaction
      const creditTransaction = await Transaction.create(
        {
          reference: payment.TransID as string,
          transaction_type: "Credit",
          status: "Success",
          amount: parseFloat(payment.TransAmount as string),
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
}

export const validateMpesaPayment = async (paymentInfo: MpesaC2BResponse) => {
  // Check if the account number exists
  const wallet = await Wallet.findOne({
    where: { account_number: paymentInfo.BillRefNumber },
  });

 return wallet;
};

export const receiveMpesaPaymentStatus = async({Result: result}: MpesaTransStatus) => {

     const parameters = result.ResultParameters.ResultParameter;
    
        type TransactStatus = {
          TransactionStatus: "Completed" | "Failed",
          // [k: string]: string
        };
        const data = Object.fromEntries(parameters.map((p) => [p.Key, p.Value]));
      

        const isTransaction = await Transaction.findOne({
          where: { reference: result.TransactionID },
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
}

export const  mpesaTransactionStatus = async(transactionStatus: TransactStatus) => {

     const wallet = await Wallet.findOne({
      where: { account_number: transactionStatus.accountNumber },
    });

    if(!wallet) {
        return {wallet, created:null, transaction:null};
    }
       const [transaction, created] = await Transaction.findOrCreate({
     where: { reference: transactionStatus.reference },
     defaults: {
       reference: transactionStatus.reference,
       transaction_type: transactionStatus.type,
       status: transactionStatus.amount,
       wallet_id: wallet.id as string,
     },
   });

       const payload = {
      Initiator:
        NODE_ENV === "production" ? MPESA_INITIATOR : MPESA_SANDBOX_INITIATOR,
      // SecurityCredential:
      //   NODE_ENV === "production"
      //     ? MPESA_SECURITY_CREDENTIAL
      //     : MPESA_SANDBOX_SECURITY_CREDENTIAL,
      SecurityCredential: transactionStatus.securityCredential,
      CommandID: "TransactionStatusQuery",
      TransactionID: transactionStatus.reference,
      PartyA: `${transactionStatus.shortCode}`,
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
    return {wallet, created, transaction, response}
}