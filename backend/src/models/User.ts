import { Model, DataTypes } from "sequelize";

import { hash } from "bcryptjs";

import { sequelize } from "../config/database/postgres/postgres.js";
import Wallet from "./Wallet.js";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

class User extends Model {
  declare id?: string;
  declare username: string;
  declare email: string;
  declare password?: string;
  declare refresh_token?: string;
  declare avatar_url?: string;
  declare avatar_id?: string;
  declare verification_secret?: string;
  declare is_MFA_enabled?: boolean;
  declare role?: UserRole;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  public static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      instance.password = (await hash(
        instance.password as string,
        12
      )) as unknown as string;
    }
  }

  public static async createUserWallet(wallet: Wallet, user: User) {
    if (user.role && user.role !== "user") return;

    await Wallet.create({ user_id: user.id as string });
  }


  public override toJSON(showHidden = false): object {
    const attributes = { ...this.get() } as any;

    if (!showHidden) {
      delete attributes.email;
    }
    delete attributes.password;
    delete attributes.verification_secret;
    delete attributes.refresh_token;
    return attributes;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: "user",
    },

    refresh_token: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },

    avatar_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },

    avatar_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    verification_secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_MFA_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required

    indexes: [
      {
        unique: true,
        fields: ["email", "username"],
      },
    ],
  }
);

export default User;

//hooks
User.beforeCreate(User.hashPassword);
User.afterUpdate(User.hashPassword);

User.afterCreate(async (user, options) => {
  if (user.role && user.role !== "user") return;

  await Wallet.create(
    { user_id: user.id as string },
    { transaction: options.transaction }
  );
});

//when user role changes to admin they do not need a wallet anymore

User.afterUpdate(async (user) => {
  if (user.changed("role") && user.role === "admin") {
    await Wallet.destroy({ where: { user_id: user.id } });
  }
});
