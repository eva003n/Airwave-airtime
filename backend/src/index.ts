import { PORT, NODE_ENV, BASE_URL } from "./config/env.js";
import { server } from "./app.js";
import logger from "./logger/logger.winston.js";
import {
  connectDatabase,
  sequelize,
} from "./config/database/postgres/postgres.js";
import { runMigrations } from "./config/database/postgres/umzug.js";

const port = PORT;

const serverUrl = BASE_URL || ` http://localhost:${port}`;

// fist connect to postgresdatabase
await connectDatabase();
//run database migrations
await runMigrations();

server.listen(port, () => {
  logger.info(`🚀 ${serverUrl} 🚀`);
  // signal to pm2 that the app is reasy after coonecting to db
  process.send?.("ready");
});

// handle graceful shutdown

const shutDown = () => {
  server.close((err) => {
    if (err) {
      logger.error(`❌ Error shutting down server: ${err.message}`);
      process.exit(1);
    }

    // If a graceful shutdown is not achieved after 1 second,
    // shut down the process completely
    logger.info("Server gracefully shutting down...");
    process.exit(0);
  });

  logger.info("⌛ Shutting down the server completely after 1 second ⌛");
  setTimeout(() => {
    logger.info("✅ Shutdown successfully and generated core dump file ➡️");
    process.abort(); // abort immediately and generate core dump file
  }, 1000).unref();
};

process.on("SIGINT", async () => {
  shutDown();
  logger.info("✅ Server shutdown gracefully ✅");
});
process.on("SIGTERM", async () => {
  shutDown();
  logger.info("✅ Server shutdown gracefully ✅");
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  shutDown();
});
process.on("unhandledRejection", () => {
  logger.error(`Uncaught rejection: `);
  shutDown();
});
