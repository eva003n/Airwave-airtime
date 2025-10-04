import dotenv from "dotenv";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../env.js";

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
    username: DB_USER || "airwave_admin",
    password: DB_PASSWORD || "airwave@2925airtime",
    database: DB_NAME || "airwave_development",
    host: DB_HOST || "db",
    port: parseInt(DB_PORT || "5432", 10),
    dialect: "postgres",
  },
  test: {
    username: DB_USER || "airwave_admin",
    password: DB_PASSWORD || "airwave@2925airtime",
    database: DB_NAME || "airwave_test",
    host: DB_HOST || "db",
    port: parseInt(DB_PORT || "5432", 10),
    dialect: "postgres",
  },
  production: {
    username: DB_USER || "airwave_admin",
    password: DB_PASSWORD || "airwave@2925airtime",
    database: DB_NAME || "airwave_production",
    host: DB_HOST || "db",
    port: parseInt(DB_PORT || "5432", 10),
    dialect: "postgres",
  },
};
export type {ConfigEnv}
export default config;
