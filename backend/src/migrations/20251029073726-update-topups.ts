import { QueryInterface, DataTypes } from "sequelize";
import { MobileOperator } from "../models/Topup.js";

async function up({ context }: { context: QueryInterface }) {
  await context.removeColumn("topups", "operator");
  await context.removeColumn("topups", "phone_number");
}

async function down({ context }: { context: QueryInterface }) {
  await context.addColumn("topups", "operator", {
    type: DataTypes.ENUM(...Object.values(MobileOperator)),
    allowNull: false,
  });

  await context.addColumn("topups", "phone_number", {
    type: DataTypes.STRING,
    allowNull: false,
  });
}

export { up, down };
