import { sequelize } from "../config/database/postgres/postgres.js";
import Recipient from "./Recipients.js";
import Topup from "./Topups.js";
import  User from "./User.js";

export const db = {
  sequelize,
  User,
  Recipient,
  Topup
};

export default db;
