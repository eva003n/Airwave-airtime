import { PORT, SERVER_URL, NODE_ENV } from "./config/env.js";
import { app } from "./app.js";
import logger from "./logger/logger.winston.js";
import { connectDatabase, syncModels } from "./config/database/postgres.js";

const port = PORT;

const serverUrl =
  NODE_ENV === "production" ? SERVER_URL : `${SERVER_URL}:${port}`;

app.listen(port, () => {
  connectDatabase().then(() => {
    logger.info(`🚀 Server running at ${serverUrl}...🚀`);
  });
});
