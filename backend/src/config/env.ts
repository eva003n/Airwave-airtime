import { Console } from "console";
import { config } from "dotenv";

//first load the main .env file and get the mode
config();
const mode = process.env.NODE_ENV || "development";
//the conditionally load the the correct .env based on mode
config({
  path: `./.env.${mode}`
})

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
  APP_NAME,
  RELOADLY_CLIENT_ID,
  RELOADLY_CLIENT_SECRET,
  RELOADLY_AUDIENCE,
  RELOADLY_AUTH_URL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASSWORD,
  REDIS_DB,
  AFRICAS_TALKING_API_KEY,
  AFRICAS_TALKING_USERNAME,
  AFRICAS_TALKING_AIRTIME_API_URI,
  MPESA_CUSTOMER_KEY,
  MPESA_CUSTOMER_SECRET,
  MPESA_BASE_URL,
  MPESA_AUTH_URL,

} = process.env;

