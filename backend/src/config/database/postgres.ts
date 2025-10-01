import { Sequelize } from "sequelize-typescript";

import {
  DB_DIALECT,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  NODE_ENV,
} from "../env.js";
import logger from "../../logger/logger.winston.js";
import User from "../../models/User.js";



const sequelize = new Sequelize({
  host: "db",
  dialect: "postgres",
  port: parseInt(DB_PORT || "5432"),
  database: DB_NAME || "airwave-airtime",
  username: DB_USER || "pg_admin",
  password: DB_PASSWORD || "airwave@2925airtime",
  dialectOptions: {
    /* --production-- */
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
  logging: logger.info.bind(logger),
  models: [User],
  // models: [process.cwd() + "/src/models"],
  // modelMatch: (filename, member) => {
  //   return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  // },
});
const connectDatabase = async () => {
  try {
   await sequelize.authenticate();
    logger.info("Connected to Postgres server successfully");
    // await syncModels()
  } catch (error) {
    logger.error(`Failed to connect to Postgres server with error ${error}`);
    process.exit(1)
  }
};

const syncModels = async () => {
  try {
  await sequelize.sync({ alter: true });
    logger.info("All models synchronized with database successfully");
  
  } catch (error) {
    logger.error(`Failed to synchronized all models with database ${error}`);
  }
}
export { sequelize, connectDatabase, syncModels };
