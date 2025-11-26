import { config } from "dotenv";
/* 
Based on twelve factor app guide a single file that lists all the configs the app uses 
Dotenv is only used used for development
*/

/*---- This code only works in development | local environment using dotenv not in production since their is no dotenv package (local machine) ---- */

//first load the main .env file and get the enviroment
const deploy = process.env.DEPLOY;

if (deploy) {
  config();
  const enviroment = process.env.NODE_ENV || "development";
  //the conditionally load the the correct .env based on mode
  config({
    path: `./.env.${enviroment}`,
  });
}


/*---- Shared configl loader no matter enviroment */
export const {
  /*------ Shared env configs ------ */
  NODE_ENV,
  BASE_URL,
  PORT,
  CORS_ORIGIN_URLS,
  API_DOC_URI,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  // Authentication
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  APP_NAME,
  // Redis service
  REDIS_URL,

  /*------ Reloadly adapter service ------ */
  // development
  RELOADLY_SANDBOX_CLIENT_ID,
  RELOADLY_SANDBOX_CLIENT_SECRET,
  RELOADLY_SANDBOX_AUDIENCE,
  RELOADLY_SANDBOX_AUTH_URL,
  // production
  RELOADLY_CLIENT_ID,
  RELOADLY_CLIENT_SECRET,
  RELOADLY_AUDIENCE,
  RELOADLY_AUTH_URL,

  /*------ Africa talking adapter service ------ */
  // development
  AFRICAS_TALKING_SANDBOX_API_KEY,
  AFRICAS_TALKING_SANDBOX_USERNAME,
  AFRICAS_TALKING_AIRTIME_API_SANDBOX_URI,
  AFRICAS_TALKING_SANDBOX_PAYBILL,
  // production
  AFRICAS_TALKING_AIRTIME_API,
  AFRICAS_TALKING_API_KEY,
  AFRICAS_TALKING_USERNAME,
  AFRICAS_TALKING_PAYBILL,

  /*------ Mpesa payment gateway ------ */
  // development
  MPESA_SANDBOX_CUSTOMER_KEY,
  MPESA_SANDBOX_CUSTOMER_SECRET,
  MPESA_SANDBOX_BASE_URL,
  MPESA_SANDBOX_AUTH_URL,
  MPESA_SANDBOX_INITIATOR,
  MPESA_SANDBOX_SHORT_CODE,
  MPESA_SANDBOX_SECURITY_CREDENTIAL,
  // production
  MPESA_CUSTOMER_KEY,
  MPESA_CUSTOMER_SECRET,
  MPESA_BASE_URL,
  MPESA_AUTH_URL,
  MPESA_INITIATOR,
  MPESA_SECURITY_CREDENTIAL,
  MPESA_SHORT_CODE,
} = process.env;
