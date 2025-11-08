import { randomUUID } from "crypto";
import { QueryInterface, DataTypes } from "sequelize";

async function up({ context }: { context: QueryInterface }) {
  await context.bulkInsert("users", [
    {
      id: randomUUID(),
      username: "evan21",
      email: "evanngugi547@gmail.com",
      password: "$2y$12$Easb6llCDeNbIElb4rff7u1EE5rjjFiyx6tHxSSMlM.QiBdctvbqy",
      role: "admin",
      is_MFA_enabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      username: "kunity@50",
      email: "kunity@k-unity.co.ke",
      password: "$2y$12$u7kD2drRYsgSEK65pmuXCOxhwM/rA.nnddztf8Y9tsI7Cyes13SwW",
      role: "test",
      is_MFA_enabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete("users", {
    email: ["kunity@k-unity.co.ke", "evanngugi547@gmail.com"],
  });
}

export { up, down };
