import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.bulkInsert("users", [
    {
      username: "evan21",
      email: "evan18@gmail.com",
      password: "Evan@2025"
    },
    {
      username: "kenny25",
      email: "kenny21@gmail.com",
      password: "Kenny@2025"
    }
  ])
}

 async function down({ context }: { context: QueryInterface }) {
  // TODO: revert migration logic here
}

export { up, down };
