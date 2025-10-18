import type {
  CreationAttributes,
  InferCreationAttributes,
  InferAttributes,
} from "sequelize";

import {
  Table,
  Column,
  DataType,
  Model,
  Unique,
  BeforeCreate,
  BeforeUpdate,
  BeforeBulkCreate,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Topup from "./Topups.js";
import User from "./User.js";

export enum MobileOperator {
  Safaricom = "Safaricom",
  Airtel = "Airtel",
}
@Table({
  tableName: "recipients",
  modelName: "Recipient",
  indexes: [
    {
      unique: true,
      fields: ["phone_number"],
    },
  ],
})

// sequelize model name | sql table name
export default class Recipient extends Model<
  InferAttributes<Recipient>,
  InferCreationAttributes<Recipient>
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare branch: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare user_id: string;

  //   @BelongsTo(() => User, {
  //     as: "user",
  //     foreignKey: "user_id"
  //   })
  // declare user?: User

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone_number: string;

  @Column({
    type: DataType.ENUM(...Object.values(MobileOperator)),
    // defaultValue: "Safaricom",
  })
  declare operator: MobileOperator;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 266, //safaricom
  })
  declare operator_code?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare airtime_amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "none",
  })
  declare designation?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare active?: boolean;

  @BeforeBulkCreate
  @BeforeCreate
  static async assignOperatorCode(instance: Recipient) {
    if (!instance.operator_code) {
      const operatorCode =
        instance.operator === MobileOperator.Safaricom ? 266 : 265;

      instance.operator_code = operatorCode;
    }
  }

  //   public override toJSON(): object  {
  //     const attributes = {...this.get()} as any
  //     delete attributes.password
  //     delete attributes.verification_secret
  //     delete attributes.refresh_token
  //     delete attributes.email
  //     return attributes;
  //   }
}
