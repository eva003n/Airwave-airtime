import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.changeColumn("users", "account_number", {
      type: DataTypes.INTEGER,
      allowNull: false,
  });
}

 async function down({ context }: { context: QueryInterface }) {
  await context.changeColumn("users", "account_number", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });

}

export { up, down };
