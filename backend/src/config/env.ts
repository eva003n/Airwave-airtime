import { Console } from "console";
import { config } from "dotenv";

//first load the main .env file and get the mode
config();
const mode = process.env.NODE_ENV;

//the conditionally load the the correct .env based on mode
config({
  path: `./.env.${mode || "development"}`,
});

export const {
  NODE_ENV,
  PORT,
  SERVER_URL,
  CORS_ORIGIN_URLS,
  API_DOC_URI,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  APP_NAME
} = process.env;
