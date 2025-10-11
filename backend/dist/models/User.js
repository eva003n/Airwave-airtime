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
import { hash } from "bcryptjs";
export var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["User"] = "user";
})(UserRole || (UserRole = {}));
let User = class User extends Model {
    static async hashPassword(instance) {
        if (instance.changed("password")) {
            instance.password = await hash(instance.password, 12);
        }
    }
    toJSON() {
        const attributes = { ...this.get() };
        delete attributes.password;
        delete attributes.verification_secret;
        delete attributes.refresh_token;
        delete attributes.email;
        return attributes;
    }
};
__decorate([
    Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataType.UUID,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
        // unique: true
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: "user",
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column({
        type: DataType.STRING(512),
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "refresh_token", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar_id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "verification_secret", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "is_MFA_enabled", void 0);
__decorate([
    BeforeCreate,
    BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
User = __decorate([
    Table({
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
], User);
export default User;
