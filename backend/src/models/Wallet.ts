import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";


class Wallet extends Model {
    declare id?: string;
    declare user_id: string;
    declare balance?: number;
    declare currency_code?: string;
    declare currency_name?: string;
    declare active?: boolean;
    declare lower_threshold?: number;
    declare upper_threshold?: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
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
        fields: ["user_id"],
      },
    ],
  }
);

export default Wallet;