import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database/postgres/postgres.js";

export enum MobileOperator {
  Safaricom = "Safaricom",
  Airtel = "Airtel",
}

class Recipient extends Model {
  declare id?: string;
  declare name: string;
  declare department: string;
  declare branch: string;
  declare user_id: string;
  declare phone_number: string;
  declare operator?: MobileOperator;
  // declare operator_code?: number;
  declare airtime_amount: number;
  declare designation?: string;
  declare active?: boolean;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  // static async assignOperatorCode(instance: Recipient) {
  //   if (!instance.operator_code) {
  //     const operatorCode =
  //       instance.operator === MobileOperator.Safaricom ? 266 : 265;
  //     instance.operator_code = operatorCode;
  //   }
  // }
}

Recipient.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    operator: {
      type: DataTypes.ENUM(...Object.values(MobileOperator)),
    },

    airtime_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "none",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "recipients",
    indexes: [
      {
        unique: true,
        fields: ["phone_number"],
      },
    ],
  }
);

// Register hooks (same behavior as @BeforeCreate / @BeforeBulkCreate)
// Recipient.beforeCreate(Recipient.assignOperatorCode);
// Recipient.beforeBulkCreate(async (instances: Recipient[]) => {
//   for (const inst of instances) {
//     await Recipient.assignOperatorCode(inst);
//   }
// });

export default Recipient;
