import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
await context.sequelize.transaction(async (t) => {
  await context.sequelize.query(
    `ALTER TABLE "topups"
         ALTER COLUMN "airtime_amount" TYPE DECIMAL(10,2)
         USING "airtime_amount"::DECIMAL(10,2);`,
    { transaction: t }
  );
});
}

 async function down({ context }: { context: QueryInterface }) {
   await context.sequelize.transaction(async (t) => {
     await context.sequelize.query(
       `ALTER TABLE "topups"
         ALTER COLUMN "airtime_amount" TYPE INTEGER
         USING ROUND("airtime_amount");`,
       { transaction: t }
     );
   });
}

export { up, down };
