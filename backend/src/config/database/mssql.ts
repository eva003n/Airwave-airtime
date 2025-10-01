import { Sequelize } from "sequelize-typescript";
import path from "path"
import { fileURLToPath } from "url";
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

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(process.cwd() + "/src/models");

const sequelize = new Sequelize({
  host: "db",
  dialect: "mssql",
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialectOptions: {
     options: {
        encrypt: false,
        trustServerCertificate: true

      },
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
    sequelize.authenticate();
    logger.info("Connected to MSsql server successfully");
    await syncModels()
  } catch (error) {
    logger.error(`Failed to connect to MSsql server with error ${error}`);
    await sequelize.close();
    logger.info("Connection to MSsql server closed");
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
