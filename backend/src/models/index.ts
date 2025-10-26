import { sequelize } from "../config/database/postgres/postgres.js";
import Recipient from "./Recipient.js";
import Topup from "./Topup.js";
import User from "./User.js";

export const db = {
  sequelize,
  User,
  Recipient,
  Topup,
};

export default db;
