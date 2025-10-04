import type {CreationAttributes, InferCreationAttributes, InferAttributes } from "sequelize";

import { Table, Column, DataType, Model, Unique, BeforeCreate, BeforeUpdate } from "sequelize-typescript";
import { hash } from "bcryptjs";


export enum UserRole {
    Admin = "admin",
    User = "user"
}
@Table({
  tableName: "users",
  modelName: "User",
  indexes: [
    {
      unique: true,
      fields: ["email", "username"],
    },
  ],
})

// sequelize model name | sql table name
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  
  })
  declare password: string;
 

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: "user",
  })
  declare role?: UserRole;

  @Column({
    type: DataType.STRING(512),
    allowNull: true,
  })
  declare refresh_token?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatar_url?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare avatar_id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare verification_secret?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_MFA_enabled?: boolean;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if(instance.changed("password")) {
      instance.password = await hash(instance.password, 12);
    }

    
  }

  public override toJSON(): object  {
    const attributes = {...this.get()} as any
    delete attributes.password
    delete attributes.verification_secret
    delete attributes.refresh_token
    delete attributes.email
    return attributes;
  }
}

