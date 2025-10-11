import { Sequelize } from "sequelize-typescript";
import { NODE_ENV, } from "../env.js";
import logger from "../../logger/logger.winston.js";
import User from "../../models/User.js";
import config, {} from "./config.js";
import Recipient from "../../models/Recipients.js";
const env = NODE_ENV || "development";
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
    logging: logger.info.bind(logger),
    models: [User, Recipient],
});
const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Connected to Postgres server successfully");
        await syncModels();
    }
    catch (error) {
        logger.error(`Failed to connect to Postgres server with error ${error}`);
        process.exit(1);
    }
};
const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        logger.info("All models synchronized with database successfully");
    }
    catch (error) {
        logger.error(`Failed to synchronized all models with database ${error}`);
    }
};
export { sequelize, connectDatabase, syncModels };
