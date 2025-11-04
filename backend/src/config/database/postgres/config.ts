import dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../../env.js";

dotenv.config();

interface SequelizeConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port?: number;
  dialect: "postgres"; // since all are postgres
}

interface ConfigEnv {
  development: SequelizeConfig;
  test: SequelizeConfig;
  production: SequelizeConfig;
}

const config: ConfigEnv = {
  development: {
    username: DB_USER as string,
    password: DB_PASSWORD as string,
    database: DB_NAME as string,
    host: DB_HOST as string,
    port: parseInt(DB_PORT as string, 10),
    dialect: "postgres",
  },
  test: {
    username: DB_USER as string,
    password: DB_PASSWORD  as string,
    database: DB_NAME as string,
    host: DB_HOST as string,
    port: parseInt(DB_PORT as string, 10),
    dialect: "postgres",
  },
  production: {
    username: DB_USER as string,
    password: DB_PASSWORD as string,
    database: DB_NAME as string,
    host: DB_HOST as string,
    port: parseInt(DB_PORT as string, 10),
    dialect: "postgres",
  },
};
export type { ConfigEnv };
export default config;
