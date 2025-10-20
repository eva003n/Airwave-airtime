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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Recipient from "./Recipients.js";
import User, { UserRole } from "./User.js";

export enum MobileOperator {
  Safaricom = "Safaricom",
  Airtel = "Airtel",
}

export enum TopStatus {
  Pending = "Pending",
  // Processing = "Processing",
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
    // avoid using Object.values(MobileOperator) here to prevent circular import at module initialization
    type: DataType.ENUM(...Object.values(MobileOperator)),
    allowNull: false,
  })
  declare operator: MobileOperator;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare airtime_amount: number;

  @ForeignKey(() => Recipient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare recipient_id: string;



  @ForeignKey(() => User)
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
