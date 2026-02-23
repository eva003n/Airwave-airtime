import  { literal, fn, col, Op } from "sequelize";
import Recipient from "../models/Recipient.js";
import Topup from "../models/Topup.js";
import Wallet from "../models/Wallet.js";
import type { ATWallet, Id } from "../middlewares/validators/validators.js";
import Transaction from "../models/Transaction.js";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import User from "../models/User.js";
import { getCurrency } from "../utils/index.js";

type MonthlyRecipientGrowth = {
  month: Date; // month start
  count: number; // new recipients in that month
} & Recipient;

type MonthlyTransactionGrowth = {
  month: Date; // month start
  count: number;
} & Transaction;

type MonthlyTopUpTrend = {
  month: Date; // month start
  totalAirtime: number;
  totalTopups: number;
} & Topup;

const getRecipientGrowth = async (): Promise<MonthlyRecipientGrowth[]> => {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  const growth = (await Recipient.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      createdAt: {
        [Op.gte]: fiveMonthsAgo,
      },
    },
    group: ["month" as unknown as string],
    order: [["month" as unknown as string, "ASC"]],
    raw: true,
  })) as MonthlyRecipientGrowth[];

  return growth.map(
    (recipient) =>
      ({
        month: new Date(recipient.month),
        count: Number(recipient.count),
      }) as MonthlyRecipientGrowth,
  ); // [{ month: '2025-06-01T00:00:00.000Z', count: 12 }, ...]
};

export const getTopUpTrends = async (
  id: string = "",
): Promise<MonthlyTopUpTrend[]> => {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  //build an object of dynamic filters

  const filters = { id };

  //convert resulting array to object for filtering
  let where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  where = Object.assign(where, {
    createdAt: { [Op.gte]: fiveMonthsAgo },
  });

  const trends = (await Topup.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
      [fn("SUM", col("airtime_amount")), "totalAirtime"],
      [fn("COUNT", col("id")), "totalTopups"],
    ],
    where: {
      createdAt: { [Op.gte]: fiveMonthsAgo },
    },
    group: [literal("month") as unknown as string],
    order: [[literal("month") as unknown as string, "ASC"]],
    raw: true,
  })) as MonthlyTopUpTrend[];

  // Convert string numbers to actual numbers (Postgres returns strings for SUM)
  return trends.map(
    (t) =>
      ({
        month: new Date(t.month),
        totalAirtime: Number(t.totalAirtime),
        totalTopups: Number(t.totalTopups),
      }) as MonthlyTopUpTrend,
  );
};

export const generateUserAnalytics = async (id: string) => {
  //total recipients that are active in the  system
  const totalRecipients = (
    await Recipient.findAndCountAll({ where: { active: true } })
  ).count;

  //total top ups made
  const totalTopUps = (await Topup.findAndCountAll()).count;

  //wallet balance
  const wallet = await Wallet.findOne({ where: { user_id: id } });
  const walletBalance = Number(wallet?.balance) || 0;

  const recipientGrowth = await getRecipientGrowth();
  const topUpTrends = await getTopUpTrends(id);

  const analytics = {
    totalRecipients,
    totalTopUps,
    walletBalance,
    recipientGrowth,
    topUpTrends,
  };
  return analytics;
};


const getTransactionGrowth = async (): Promise<MonthlyTransactionGrowth[]> => {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

  const growth = (await Transaction.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: {
      createdAt: {
        [Op.gte]: fiveMonthsAgo,
      },
    },
    group: ["month" as unknown as string],
    order: [["month" as unknown as string, "ASC"]],
    raw: true,
  })) as MonthlyTransactionGrowth[];

  return growth.map(
    (transaction) =>
      ({
        month: new Date(transaction.month),
        count: Number(transaction.count),
      }) as MonthlyTransactionGrowth,
  ); // [{ month: '2025-06-01T00:00:00.000Z', count: 12 }, ...]
};

export const generateAdminAnalytics = async () => {
  // total users
  const totalUsers = (await User.findAndCountAll()).count;

  //totalm transactions
  const totalTransactions = (await Transaction.findAndCountAll()).count;

  // africas talking wallet balance
  const walletBalance = (
    await africasTalkingClient.get<ATWallet>("/version1/user")
  ).data.UserData.balance;
  const balance = getCurrency(walletBalance);

  // airtime purchase
  const totalDiscount = (await Topup.sum("discount")) || 0;

  const stats = {
    totalUsers,
    totalTransactions,
    walletBalance: balance,
    totalDiscount,
  };

  const transactionGrowth = await getTransactionGrowth();
  const airtimePurchases = await getTopUpTrends();

  const analytics = {
    stats,
    transactionGrowth,
    airtimePurchases,
  };

  return analytics;
};
