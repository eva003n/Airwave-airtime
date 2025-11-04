import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";
import { randomInt } from "crypto";



export enum WalletTypes {
  BASIC = "Basic",
  PLUS = "Plus",
  PREMIUM = "Premium",
  MAX = "Max"
}
// server
class Wallet extends Model {
  declare id?: string;
  declare user_id: string;
  declare balance?: number;
  declare currency_code?: string;
  declare currency_name?: string;
  declare account_number?: number;
  declare wallet_type?: string;
  declare active?: boolean;
  declare lower_threshold?: number;
  declare upper_threshold?: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  public static async generateAccountNo(instance: Wallet) {
    const accNo = randomInt(80000000); // 8 numbers
    instance.account_number = accNo; // e.g. 12345678
  }
}


Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },

    account_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "KES",
    },
    currency_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Kenyan Shilling",
    },
    wallet_type: {
      type: DataTypes.ENUM(...Object.values(WalletTypes)),
      allowNull: false,
      defaultValue: WalletTypes.BASIC
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lower_threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    upper_threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wallets",
    sequelize,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "account_number"],
      },
    ],
  }
);

Wallet.beforeValidate(Wallet.generateAccountNo);

export default Wallet;