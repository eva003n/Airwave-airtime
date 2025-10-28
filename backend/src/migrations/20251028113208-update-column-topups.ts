import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  return await context.changeColumn("topups", "transaction" {

  })
}

 async function down({ context }: { context: QueryInterface }) {
  // TODO: revert migration logic here
}

export { up, down };
