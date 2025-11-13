import { PORT, SERVER_URL, NODE_ENV, BASE_URL } from "./config/env.js";
import { app } from "./app.js";
import logger from "./logger/logger.winston.js";
import { connectDatabase } from "./config/database/postgres/postgres.js";
import { runMigrations } from "./config/database/postgres/umzug.js";

const port = PORT;

const serverUrl =  NODE_ENV === "production" ? BASE_URL : `${SERVER_URL}`;

// fist connect to postgresdatabase
await connectDatabase();
//run database migrations
await runMigrations();


app.listen(port, () => {
  logger.info(`🚀 ${serverUrl} 🚀`);
});
