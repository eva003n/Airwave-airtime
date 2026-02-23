import { id } from "zod/locales";
import { africasTalkingClient } from "../config/africas-talking/africas-talking.js";
import { AFRICAS_TALKING_USERNAME } from "../config/env.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import querystring from "querystring";

type Option = {
    page: number,
    limit: number,
    account?: number,
    hide?: boolean
}

export const getPaginatedTransactions = async (
  option: Option
) => {
  //inplements page by page logic
  const offset = (option.page - 1) * option.limit;

  //build an object of dynamic filters
  const filters = { account_number: option.account || 0 };

  //convert resulting array to object for filtering
  const where = Object.fromEntries(
    //build an array of key value pairs removing empty values
    Object.entries(filters).filter(([_, v]) => v?.toString().trim()),
  );

  const { rows, count } = await Transaction.findAndCountAll({
    limit: option.limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Wallet,
        // where,
        as: "account",
        attributes: ["account_number", "wallet_type"],
      },
    ],
    paranoid: option.hide,
  });

  return {
    transactions: rows,
    currentPage: option.page,
    totalPages: Math.ceil(count / option.limit),
    totalItems: count,
  };
};

export const removeTransaction = async (id: string) => {
  const isTransaction = await Transaction.findByPk(id);

  await Transaction.destroy({ where: { id }, force: true }); // hard delete

  return isTransaction;
};

export const transactionStatusAT = async (transactionId: string) => {
  const payload = {
    username: AFRICAS_TALKING_USERNAME,
    transactionId,
  };

  // const _payload = JSON.stringify(payload)
  const response = await africasTalkingClient.get<any>(
    "/query/transaction/find",
    querystring.stringify(payload),
  );

  return response;
};
