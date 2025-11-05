import { QueryInterface } from "sequelize";
import Sequelize from "sequelize";
import { UserRole } from "../models/User.js";

async function up({ context }: { context: QueryInterface }) {
  await context.createTable("users", {
    id: {
      type: Sequelize.DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: "user",
    },
    refresh_token: {
      type: Sequelize.DataTypes.STRING(512),
      allowNull: true,
    },
    avatar_url: {
      type: Sequelize.DataTypes.STRING(512),
      allowNull: true,
    },
    avatar_id: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    verification_secret: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    },
    is_MFA_enabled: {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW,
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.DataTypes.NOW,
    },
  });
}

async function down({ context }: { context: QueryInterface }) {
  await context.dropTable("users");
}

export { up, down };
