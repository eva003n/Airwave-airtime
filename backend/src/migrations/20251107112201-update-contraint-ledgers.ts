import { QueryInterface, DataTypes } from "sequelize";

async function up({ context }: { context: QueryInterface }) {
  const constraintName = "ledgers_transaction_id_fkey";
// drop if it exist
    await context.sequelize.query(`
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = '${constraintName}'
        ) THEN
            ALTER TABLE "ledgers" DROP CONSTRAINT "${constraintName}";
        END IF;
    END $$;
  `);

  //  Then re-add with cascading behavior
  await context.addConstraint('ledgers', {
    fields: ['transaction_id'],
    type: 'foreign key',
    name: constraintName,
    references: {
      table: 'transactions',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}



async function down({ context }: { context: QueryInterface }) {
  await context.removeConstraint("ledgers", "ledgers_transaction_id_fkey");

}

export { up, down };
