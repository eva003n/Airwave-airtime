import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  await context.createTable("wallets", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "KES",
    },
    currency_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Kenyan Shilling",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lower_threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    upper_threshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

 async function down({ context }: { context: QueryInterface }) {
  await context.dropTable("wallets");
}

export { up, down };
