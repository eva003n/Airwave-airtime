var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, DataType, Model, Unique, BeforeCreate, BeforeUpdate } from "sequelize-typescript";
export var MobileOperator;
(function (MobileOperator) {
    MobileOperator["Safaricom"] = "Safaricom";
    MobileOperator["Airtel"] = "Airtel";
})(MobileOperator || (MobileOperator = {}));
let Recipient = class Recipient extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUID,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "name", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "branch", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "user_id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "phone_number", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(MobileOperator)),
        defaultValue: "Safaricom",
    }),
    __metadata("design:type", String)
], Recipient.prototype, "operator", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "266" //safaricom
    }),
    __metadata("design:type", String)
], Recipient.prototype, "operator_code", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Recipient.prototype, "airtime_amount", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "none"
    }),
    __metadata("design:type", String)
], Recipient.prototype, "designation", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Recipient.prototype, "active", void 0);
Recipient = __decorate([
    Table({
        tableName: "recipients",
        modelName: "Recipient",
        indexes: [
            {
                unique: true,
                fields: ["phone_number"]
            },
        ],
    })
    // sequelize model name | sql table name
], Recipient);
export default Recipient;
