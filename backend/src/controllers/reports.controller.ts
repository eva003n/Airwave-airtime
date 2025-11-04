import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Recipient from "../models/Recipient.js";
import Topup from "../models/Topup.js";
import { reloadlyClient } from "../config/reloadly/reloadlyclient.js";
import type { Id, WalletBalance } from "../middlewares/validators/validators.js";
import ApiResponse from "../utils/ApiResponse.js";
import { literal, Op, fn, col } from "sequelize";
import Wallet from "../models/Wallet.js";

const getAnalytics = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //total recipients that are active in the  system
    const {id} = req.params as Id

    const totalRecipients = (
      await Recipient.findAndCountAll({ where: { active: true } })
    ).count;

    //total top ups made
    const totalTopUps = (await Topup.findAndCountAll()).count;

    //wallet balance
    const wallet = await Wallet.findOne({where: {user_id: id}});
    const walletBalance = Number(wallet?.balance) || 0;

    const recipientGrowth = await getRecipientGrowth();
    const topUpTrends = await getTopUpTrends();

    const analytics = {
      totalRecipients,
      totalTopUps,
      walletBalance,
      recipientGrowth,
      topUpTrends,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, analytics, "Analytics fetched successfully"));
  }
);

type MonthlyRecipientGrowth = {
  month: Date; // month start
  count: number; // new recipients in that month
} & Recipient;

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
      } as MonthlyRecipientGrowth)
  ); // [{ month: '2025-06-01T00:00:00.000Z', count: 12 }, ...]
};

export const getTopUpTrends = async (): Promise<MonthlyTopUpTrend[]> => {
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

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
      } as MonthlyTopUpTrend)
  );
};

export { getAnalytics };
