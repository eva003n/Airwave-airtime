import { Sequelize } from "sequelize";
import { NODE_ENV } from "../../env.js";
import logger from "../../../logger/logger.winston.js";
import config, { type ConfigEnv } from "./config.js";
import { app } from "../../../app.js";

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
  // logging:NODE_ENV === "development"? logger.info.bind(logger) : false,
  logging: false,
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connected to Postgres server successfully");
    // Import associations dynamically to avoid ES module circular import issues
    // (models import this `sequelize` export). Using dynamic import here
    // delays evaluating the models until after `sequelize` is initialized.
    try {
      const mod = await import("../../../models/Associations.js");
      if (mod?.defineAssociations) {
        mod.defineAssociations();
      }
    } catch (err) {
      logger.warn("❌ Could not define associations dynamically:", err);
    }
  } catch (error) {
    logger.error(`Failed to connect to Postgres server with error ${error}`);
    process.exit(1);
  }
};

export { sequelize, connectDatabase };
