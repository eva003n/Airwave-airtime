import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.removeColumn("recipients", "operator_code");
  
}

 async function down({ context }: { context: QueryInterface }) {
   await context.addColumn("recipients", "operator_code", {
     type: DataTypes.INTEGER,
     allowNull: false,
   });
}

export { up, down };
