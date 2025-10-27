import { QueryInterface, DataTypes } from "sequelize";

async function up({ context }: { context: QueryInterface }) {
  await context.addColumn("topups", "deletedAt", {
    type: DataTypes.DATE,
    allowNull: true,
  });
}

async function down({ context }: { context: QueryInterface }) {
  await context.removeColumn("topups", "deletedAt");
}

export { up, down };
