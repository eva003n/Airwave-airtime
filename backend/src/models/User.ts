import  {
  Model,
  DataTypes
} from "sequelize";

import { compare, hash } from "bcryptjs";


import { sequelize } from "../config/database/postgres/postgres.js";
import { randomBytes, randomInt } from "crypto";

export enum UserRole {
  Admin = "admin",
  User = "user",
}


class User extends Model {
  declare id?: string;
  declare username: string;
  declare email: string;
  declare password?: string;
  declare account_number: number;
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
  public static async generateAccountNo(instance: User) {
  const accNo = randomInt(80000000); // 8 numbers
  instance.account_number = accNo ; // e.g. 12345678
}




  public override toJSON(): object {
    const attributes = { ...this.get() } as any;
    delete attributes.password;
    delete attributes.verification_secret;
    delete attributes.refresh_token;
    delete attributes.email;
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
    account_number: {
      type: DataTypes.INTEGER,
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
        fields: ["email", "username", "account_number"],
      },
    ],
  }
);

export default User;

//hooks
User.beforeCreate(User.hashPassword);
User.beforeCreate(User.generateAccountNo)