/*
Creating a database ledger model to track all transactions within the system.

Resources
https://www.moderntreasury.com/learn/ledger-database

https://www.architecture-weekly.com/p/building-your-own-ledger-database


https://medium.com/@mahammadkhalilov/how-to-build-a-custom-ledger-system-a-comprehensive-guide-838c73ca512d
*/

//this must be a paranoid table to allow for soft deletes and audit trails
// records all financial events in the system

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";

export enum TransactionStatus {
  Pending = "Pending",
  Successful = "Success",
  Failed = "Failed",
}
export enum TransactionType {
  CREDIT = "Credit",
  DEBIT = "Debit"
}

class Transaction extends Model {
  declare id?: string;
  declare reference: string; // external business reference eg Mpesa
  declare transaction_type: string;
  declare amount: number;
  declare wallet_id: string;
  declare status?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    transaction_type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    wallet_id: {
      //account
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "wallets",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TransactionStatus)),
      allowNull: false,
      defaultValue: TransactionStatus.Pending,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            unique: true,
            fields: ["reference"]
        }
    ]
  }
);

export default Transaction