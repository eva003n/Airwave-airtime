import type {CreationAttributes, InferCreationAttributes, InferAttributes } from "sequelize";

import { Table, Column, DataType, Model, Unique, BeforeCreate, BeforeUpdate } from "sequelize-typescript";
import { MobileOperator } from "./Recipients.js";


export enum TopStatus {
  Pending = "Pending",
  Processing = "Processing",
  Successful = "Success",
  Failed = "Failed",
}

export enum OperatorType {
    Safaricom = "Safaricom Kenya",
    Airtel = "Airtel Kenya",

}
@Table({
  tableName: "topups",
  modelName: "Topup",
  indexes: [
    {
      unique: true,
      fields: ["transaction_id"],
    },
  ],
})

// sequelize model name | sql table name
export default class Topup extends Model<
  InferAttributes<Topup>,
  InferCreationAttributes<Topup>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare transaction_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone_number: string;

  @Column({
    type: DataType.ENUM(...Object.values(MobileOperator)),
    allowNull: false,
    // unique: true
  })
  declare operator: MobileOperator;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare airtime_amount: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipient_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare user_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(TopStatus)),
    allowNull: false,
    defaultValue: "Pending",
  })
  declare status?: TopStatus;

  // @BeforeCreate


  //   public override toJSON(): object  {
  //     const attributes = {...this.get()} as any
  //     delete attributes.password
  //     delete attributes.verification_secret
  //     delete attributes.refresh_token
  //     delete attributes.email
  //     return attributes;
  //   }
}

