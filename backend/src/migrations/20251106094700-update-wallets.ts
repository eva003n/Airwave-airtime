import { QueryInterface, DataTypes } from "sequelize";

async function up({ context }: { context: QueryInterface }) {

    const constraintName = "wallets_user_id_fkey";

    //  Try dropping the existing constraint if it exists
   await context.sequelize.query(`
    DO $$
    BEGIN
        IF EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = '${constraintName}'
        ) THEN
            ALTER TABLE "wallets" DROP CONSTRAINT "${constraintName}";
        END IF;
    END $$;
  `);

  //  Then re-add with cascading behavior
  await context.addConstraint('wallets', {
    fields: ['user_id'],
    type: 'foreign key',
    name: constraintName,
    references: {
      table: 'users',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });


}

async function down({ context }: { context: QueryInterface }) {
  await context.removeConstraint("wallets", "wallets_user_id_fkey");
}

export { up, down };
