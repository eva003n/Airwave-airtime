import { Sequelize } from "sequelize-typescript";

import { NODE_ENV } from "../../env.js";
import logger from "../../../logger/logger.winston.js";
import User from "../../../models/User.js";
import config, { type ConfigEnv } from "./config.js";
import Recipient from "../../../models/Recipients.js";
import Topup from "../../../models/Topups.js";
import { defineAssociations } from "../../../models/Associations.js";

const env = (NODE_ENV as keyof ConfigEnv) || "development";
const dbConfig = config[env];

const sequelize = new Sequelize({
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  dialectOptions: {
    /* --production-- */
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
  logging:NODE_ENV === "development"? logger.info.bind(logger) : false,
  models: [User, Recipient, Topup],
});
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connected to Postgres server successfully");
    defineAssociations()
  } catch (error) {
    logger.error(`Failed to connect to Postgres server with error ${error}`);
    process.exit(1);
  }
};


export { sequelize, connectDatabase };
