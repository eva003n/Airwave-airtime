import { QueryInterface, DataTypes } from "sequelize";
import { UserRole } from "../models/User.js";

async function up({ context }: { context: QueryInterface }) {
await context.sequelize.query(`
  ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'test';
`);
}

async function down({ context }: { context: QueryInterface }) {
  // Must remove the column before dropping the ENUM type
  await context.removeColumn("users", "role");
  await context.sequelize.query(
    'DROP TYPE IF EXISTS "enum_users_role";'
  );
}

export { up, down };
