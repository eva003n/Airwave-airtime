import { QueryInterface, DataTypes } from "sequelize";
import { MobileOperator } from "../models/Recipient.js";
import { TopStatus } from "../models/Topup.js";

async function up({ context }: { context: QueryInterface }) {
  await context.createTable("topups", {
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
      references: {
        model: "transactions",
        key: "id",
      },
    },

    airtime_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "recipients",
        key: "id",
      },
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  });
}

async function down({ context }: { context: QueryInterface }) {
  await context.dropTable("topups");
}

export { up, down };
