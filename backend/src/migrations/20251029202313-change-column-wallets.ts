import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.renameColumn("wallets", "user_id", "owner")
  
}

 async function down({ context }: { context: QueryInterface }) {
  await context.renameColumn("wallets", "owner", "user_id");
  
}

export { up, down };
