import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
 context.addColumn("topups", "discount", {
   type: DataTypes.DECIMAL(10, 2),
   allowNull: false,
 });
}

 async function down({ context }: { context: QueryInterface }) {
  context.removeColumn("topups", "discount")
}

export { up, down };
