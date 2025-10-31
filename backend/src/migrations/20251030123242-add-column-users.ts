import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.addColumn("users", "account_number", {
      type: DataTypes.INTEGER,
      allowNull: true,
  });
}

 async function down({ context }: { context: QueryInterface }) {
  await context.removeColumn("users", "account_number")
}

export { up, down };
