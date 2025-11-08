import { QueryInterface, DataTypes } from "sequelize";
import { UserRole } from "../models/User.js";

async function up({ context }: { context: QueryInterface }) {
  await context.changeColumn("users", "role", {
    type: DataTypes.ENUM(...Object.values(UserRole)),
    defaultValue: "user",
  });
}

async function down({ context }: { context: QueryInterface }) {
  // TODO: revert migration logic here
    await context.changeColumn("users", "role", {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    });
}

export { up, down };
