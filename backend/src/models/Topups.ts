import type {CreationAttributes, InferCreationAttributes, InferAttributes } from "sequelize";

import { Table, Column, DataType, Model, Unique, BeforeCreate, BeforeUpdate } from "sequelize-typescript";


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
  // indexes: [
  //   {
  //     unique: true,
  //     fields: ["email", "username"],
  //   },
  // ],
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
    defaultValue: DataType.UUID,
  })
  declare id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true
  })
  declare operator: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  
  })
  declare amount: string;
 

  @Column({
    type: DataType.ENUM(...Object.values(TopStatus)),
    defaultValue: "Pending",
  })
  declare status?: TopStatus;

//   @BeforeCreate
//   @BeforeUpdate


//   public override toJSON(): object  {
//     const attributes = {...this.get()} as any
//     delete attributes.password
//     delete attributes.verification_secret
//     delete attributes.refresh_token
//     delete attributes.email
//     return attributes;
//   }
}

