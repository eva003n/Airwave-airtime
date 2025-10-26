import { QueryInterface, DataTypes } from "sequelize";
import { MobileOperator } from "../models/Recipient.js";

async function up({ context }: { context: QueryInterface }) {
  await context.createTable("recipients", {
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
    operator_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 266,
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
  });
}

async function down({ context }: { context: QueryInterface }) {
  await context.dropTable("recipients");
}

export { up, down };
