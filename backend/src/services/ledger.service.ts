import Transaction from "../models/Transaction.js";
import Ledger from "../models/Ledger.js";
import Wallet from "../models/Wallet.js";


type Option = {
  page: number;
  limit: number;
  account?: number;
  hide?: boolean;
};

const getPaginatedTransactions = async (
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

  const { rows, count } = await Ledger.findAndCountAll({
    limit: option.limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Wallet,
        // where,
        as: "accountInfo",
        attributes: ["account_number", "wallet_type"],
      },
      {
        model: Transaction,
        // where,
        as: "transInfo",
        attributes: ["transaction_type"],
      },
    ],
    paranoid: option.hide,
  });

  return {
    ledgers: rows,
    currentPage: option.page,
    totalPages: Math.ceil(count / option.limit),
    totalItems: count,
  };
};
