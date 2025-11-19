import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";

export enum MobileOperator {
  Safaricom = "Safaricom",
  Airtel = "Airtel",
}

export enum TopStatus {
  Pending = "Pending",
  Successful = "Success",
  Failed = "Failed",
}

export enum OperatorType {
  Safaricom = "Safaricom Kenya",
  Airtel = "Airtel Kenya",
}

class Topup extends Model {
  declare id?: string;
  declare transaction_id: number;
  declare airtime_amount: number;
  declare recipient_id: string;
  declare user_id: string;
  declare discount: number;
  declare status?: TopStatus;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date;

  public override toJSON(showHidden = false): object {
    const attributes = { ...this.get() } as any;
     if (!showHidden) {
       delete attributes.discount;
     }

    
    return attributes;
  }
}

Topup.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    airtime_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    recipient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TopStatus)),
      allowNull: false,
      defaultValue: TopStatus.Pending,
    },
  },
  {
    sequelize,
    tableName: "topups",
    indexes: [
      {
        unique: true,
        fields: ["transaction_id"],
      },
    ],
    timestamps: true,
    paranoid: true,
  }
);

export default Topup;
