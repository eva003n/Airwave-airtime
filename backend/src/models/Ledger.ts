// records exact value movement

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";

export enum TransactionType {
  DEBIT = "Debit",
  CREDIT = "Credit",
}
class Ledger extends Model {
  declare id?: string;
  declare transaction_id: string;
  declare wallet_id: string;
  declare transaction_type: string; //debit or credit
  declare amount: number;
  declare balance_before: number;
  declare balance_after: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date;
}

Ledger.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
    },

    transaction_type: {
      type: DataTypes.ENUM(...Object.values(TransactionType)),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balance_before: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balance_after: {
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
  },
  {
    sequelize,
    tableName: "ledgers",
    timestamps: true,
    paranoid: true,
  }
);

export default Ledger
