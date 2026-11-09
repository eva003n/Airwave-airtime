import { sequelize } from "../api/config/database/postgres/postgres.js";
import Recipient from "./Recipient.js";
import Topup from "./Topup.js";
import User from "./User.js";
import Ledger from "./Ledger.js";
import Transaction from "./Transaction.js";
import Wallet from "./Wallet.js";

  User.hasMany(Recipient, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "recipients",

    // Recipients cannot exist without a user so delete all associated recipients when user is deleted
    onDelete: "CASCADE",
    // when i update user id which is rare, update user_id column in recipient table as well
    onUpdate: "CASCADE",
  });

  // Recipient belongs to a user (the owner of recipient)
  Recipient.belongsTo(User, {
    foreignKey: "user_id",
    // Recipients cannot exist without a user so delete all associated recipients when user is deleted
    onDelete: "CASCADE",
    // when i update user id which is rare, update user_id column in recipient table as well
    onUpdate: "CASCADE",
  });

  User.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "topups",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Topup belongs to a user (the one who created it)
  Topup.belongsTo(User, {
    foreignKey: "user_id",
    as: "distributor", // changed from 'user'
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasOne(Wallet, {
    sourceKey: "id",
    foreignKey: "user_id",
    as: "wallet",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Wallet.belongsTo(User, {
    foreignKey: "user_id",
    as: "owner",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Recipient has many topups
  Recipient.hasMany(Topup, {
    sourceKey: "id",
    foreignKey: "recipient_id",
    as: "recipientTopups",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Topup belongs to a recipient
  Topup.belongsTo(Recipient, {
    foreignKey: "recipient_id",
    as: "recipient",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // wallet and transaction
  Wallet.hasMany(Transaction, {
    sourceKey: "id",
    foreignKey: "wallet_id",
    as: "transactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Transaction.belongsTo(Wallet, {
    foreignKey: "wallet_id",
    as: "account",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  //ledger and wallet
  Wallet.hasMany(Ledger, {
    sourceKey: "id",
    foreignKey: "wallet_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Ledger.belongsTo(Wallet, {
    foreignKey: "wallet_id",
    as: "accountInfo",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Transaction and ledger
  Transaction.hasOne(Ledger, {
    sourceKey: "id",
    foreignKey: "transaction_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Ledger.belongsTo(Transaction, {
    foreignKey: "transaction_id",
    as: "transInfo",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });



export const db = {
  sequelize,
  User,
  Recipient,
  Topup,
  Transaction,
  Ledger,
  Wallet
};

export default db;
