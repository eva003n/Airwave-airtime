import logger from "../logger/logger.winston.js";
import type {
  ATTopUpResponse,
  ATTopUpStatus,
  ATValidateTopUp,
  BulkTopUpData,
  FilterOptions,
  TopUp,
} from "../middlewares/validators/validators.js";
import Recipient from "../models/Recipient.js";
import Topup, { TopStatus } from "../models/Topup.js";
import { jobProducer } from "../queues/producer.js";
import { topUpQueue } from "../queues/topup.queue.js";
import parseCsv from "../utils/parsecsv.js";
import axios from "axios";
import { randomUUID, randomBytes } from "crypto";
import Transaction from "../models/Transaction.js";
import { sequelize } from "../config/database/postgres/postgres.js";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import {
  NODE_ENV,
  AFRICAS_TALKING_USERNAME,
  AFRICAS_TALKING_SANDBOX_USERNAME,
  BASE_URL,
} from "../config/env.js";
import Wallet from "../models/Wallet.js";
import ApiError from "../utils/ApiError.js";
import { getCurrency } from "../utils/index.js";
import type User from "../models/User.js";
import querystring from "querystring"
import Ledger from "../models/Ledger.js";


const getAllTopUps = async () => {};
const sendBulkTopUps = async () => {};
const addBulkTopUps = async (file: Express.Multer.File, id: string) => {
  let data: BulkTopUpData[] = [];
  if (file && file.path) {
    data = await parseCsv(file?.path);
    await enqueueTopUps(data, id);

    logger.info(`Successfully added ${data.length} to the top ups queue`);
  }
  return data;
};
const makeTopUp = async (topUp: TopUp, user: User) => {
  const walletBalance =
    (await Wallet.findOne({ where: { user_id: user.id } }))?.balance || 0;
  // before top up make sure that the users wallet balance is less than or equal to top up amount
  if (walletBalance == 0 || walletBalance < topUp.airtime_amount)
    return { insufficient: true };

  const recipient = await Recipient.findOne({
    where: { phone_number: topUp.phone_number },
  });

  if (!recipient) return { recipient, topUpData: null };

  const _transactionId = randomUUID();

  const payload = {
    username:
      NODE_ENV === "production"
        ? AFRICAS_TALKING_USERNAME
        : AFRICAS_TALKING_SANDBOX_USERNAME,
    recipients: JSON.stringify([
      {
        phoneNumber: topUp.phone_number,
        amount: `KES ${topUp.airtime_amount}`,
      },
    ]),
    maxNumRetry: 5,
    // keep context in callback urls
    requestMetadata: JSON.stringify({
      transactionId: _transactionId,
    }),
  };
  const topResponse = (
    await africasTalkingClient.post<{}, ATTopUpResponse>(
      "/version1/airtime/send",
      //payload send to reloadly airtime api
      querystring.stringify(payload),
    )
  ).data;

  const status =
    topResponse.responses[0]?.status === "Sent"
      ? TopStatus.Pending
      : TopStatus.Failed;

  const amount = getCurrency(topResponse.responses[0]?.amount as string);
  const discount = getCurrency(topResponse.responses[0]?.discount as string);

  const _topUp = await sequelize.transaction(async (transaction) => {
    // abort transaction
    if (!recipient) transaction.rollback();

    // get wallet associated with transation
    const wallet = await Wallet.findOne({
      where: { user_id: recipient?.user_id },
      transaction,
    });

    // abort transaction
    if (!wallet) transaction.rollback();

    const debitTransaction = await Transaction.create(
      {
        id: _transactionId,
        reference: topResponse.responses[0]?.requestId,
        transaction_type: "Debit", // Money deducted from recipient account
        amount,
        wallet_id: wallet?.id,
      },
      { transaction },
    );

    if (!debitTransaction) transaction.rollback();

    // After transactions are complete record the top up for history tracking
    const topUp = await Topup.create(
      {
        transaction_id: debitTransaction?.id,
        status,
        airtime_amount: amount,
        discount: discount,
        recipient_id: recipient?.id,
        user_id: recipient?.user_id,
      },
      { transaction },
    );
    return topUp;
  });

  // simulate calling validation callback url in development

  if (NODE_ENV === "development") {
    const transId = randomBytes(5).toString("hex").toUpperCase();

    const _payload: ATValidateTopUp = {
      transactionId: transId, // sample africas talking internal trans ID
      phoneNumber: topUp.phone_number,
      sourceIpAddress: "127.0.0.1",
      currencyCode: "KES",
      amount: `KES ${topUp.airtime_amount}.000`,
      requestMetadata: {
        transactionId: _transactionId,
      },
    };

    setTimeout(async () => {
      const response = await axios.post(
        `${BASE_URL}/api/v1/top-ups/top-up/validate`,
        _payload,
      );
      console.log(response.data);
    }, 10000);

  }
    return { recipient, _topUp };

};

export const removeTopUp = async (id: string) => {
  const isTopUp = await Topup.findByPk(id);
  if (!isTopUp) return { isTopUp };

  await Topup.destroy({ where: { id } });

  return {isTopUp};
};
export const checkTopUpStatus = async () => {};
export const checkBulkTopUpStatus = async (topUpStatus: ATTopUpStatus) => {
  // create an atomic transaction
  await sequelize.transaction(async (transaction) => {
    // check for airtime recipient in the system
    const recipient = await Recipient.findOne({
      where: { phone_number: topUpStatus.phoneNumber },
      transaction,
    });
    // abort transaction
    if (!recipient) transaction.rollback();

    // get wallet associated with transation
    const wallet = await Wallet.findOne({
      where: { user_id: recipient?.user_id },
      transaction,
    });

    // abort transaction
    if (!wallet) return transaction.rollback();

    // create double entry transaction (credit | debit)
    const debitTransaction = await Transaction.findOne({
      where: {
        id: topUpStatus.requestMetadata.transactionId,
      },
      transaction,
    });

    if (!debitTransaction) return transaction.rollback();

    debitTransaction.set({
      status: topUpStatus.status,
    });

    await debitTransaction.save({ transaction });

    // Calculate balances and record in system ledger
    // get last transaction balances
    const lastLedger = await Ledger.findOne({
      where: { wallet_id: wallet?.id },
      order: [["createdAt", "DESC"]],
      transaction,
    });

    const balanceBeforeDebit = Number(
      lastLedger ? lastLedger.balance_after : 0,
    );

    const currentAmount = Number(debitTransaction?.amount); // money moving out
    // money remaining
    const balanceAfterDebit = balanceBeforeDebit - currentAmount; // debit

    // System ledger can only record the debit for a airtime top up credit is recorded on external service
    await Ledger.create(
      {
        wallet_id: wallet?.id,
        transaction_id: debitTransaction?.id,
        balance_before: balanceBeforeDebit,
        balance_after: balanceAfterDebit,
      },
      { transaction },
    );

    // After transactions are complete record the top up for history tracking
    const topUp = await Topup.findOne({
      where: {
        transaction_id: debitTransaction?.id,
      },
      transaction,
    });

    if (!topUp) return transaction.rollback();

    // update top up status
    topUp.set({
      status: topUpStatus.status,
    });
    await topUp.save({ transaction });

    // update wallet balance
    wallet?.set({ balance: balanceAfterDebit });
    await wallet?.save({ transaction });
  });
};;

export const beginBulkTopUp = async () => {
 const worker = (await import("../workers/topup.worker.js")).topUpWorker;

    //if worker is nit running run it
    if (worker?.isRunning()) return;

    await worker?.run();
};

export const verifyTopUp = async (topUp: ATValidateTopUp) => {
     const _amount = getCurrency(topUp.amount);

     // check for airtime recipient in the system
     const recipient = await Recipient.findOne({
       where: { phone_number: topUp.phoneNumber },
     });

     // cancel top up if recipient does exist
     if (!recipient) return {recipient}

     const debitTransaction = await sequelize.transaction(
       async (transaction) => {
         const wallet = await Wallet.findOne({
           where: { user_id: recipient?.user_id },
           transaction,
         });

         const [debitTransaction, created] = await Transaction.findOrCreate({
           where: { id: topUp.requestMetadata.transactionId },
           defaults: {
             reference: topUp.transactionId,
             transaction_type: "Debit", // Money deducted from recipient account
             amount: _amount,
             wallet_id: wallet?.id,
           },
           transaction,
         });

         // if (!created) return transaction.rollback();

         return debitTransaction;
       },
     );

     // simulate calling callback status url in development agter 10 sec
     if (NODE_ENV === "development") {
       const payload = {
         requestId: debitTransaction?.reference,
         status: "Success",
         phoneNumber: "254708333466",
         value: "KES 5.000",
         discount: "KES 0.200",
         requestMetadata: {
           transactionId: topUp.requestMetadata.transactionId,
         },
       };
       setTimeout(async () => {
         await axios.post(`${BASE_URL}/api/v1/top-ups/top-up/status`, payload);
       }, 10000);
     }

     debitTransaction?.set({
       reference: topUp.transactionId,
     });

     await debitTransaction?.save();

     return {recipient}
};

const enqueueTopUps = async (data: BulkTopUpData[], id: string) => {
  return await jobProducer.addJobs<BulkTopUpData>(
    topUpQueue,
    "topup-job",
    data,
    id,
  );
};

const getPaginatedTopUps = async (
  options: FilterOptions & {
    hide?: boolean;
  },
) => {
  //inplements page by page logic
  const offset = (options.page - 1) * options.limit;

  //build an object of dynamic filters
  const filters = {
    branch: options.branch,
    department: options.department,
    name: options.name,
  };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await Topup.findAndCountAll({
    limit: options.limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Recipient,
        where,
        as: "recipient",
        attributes: [
          "id",
          "name",
          "branch",
          "phone_number",
          "department",
          "operator",
        ],
      },
    ],
  });

  return {
    topups: rows.map((topUp) => topUp.toJSON(options.hide)),
    currentPage: options.page,
    totalPages: Math.ceil(count / options.limit),
    totalItems: count,
  };
};

export { addBulkTopUps, makeTopUp, getPaginatedTopUps };
