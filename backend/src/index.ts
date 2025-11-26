import { PORT, NODE_ENV, BASE_URL } from "./config/env.js";
import { server } from "./app.js";
import logger from "./logger/logger.winston.js";
import { connectDatabase, sequelize } from "./config/database/postgres/postgres.js";
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

const shutDown =  () => {
  server.close(async(err) => {
    if (err) {
      logger.error(`❌ Error shutting down server: ${err.message}`);
      process.exit(1);
    }


    
    logger.info("🧹Cleaning up resources 🧹");
    setTimeout(() => {
      logger.info("✅ Resources cleaned up successfully. Exiting process ➡️");

      process.exit(0);
    }, 1000)
  });
};

process.on("SIGINT", async () => {
  shutDown()
  logger.info("✅ Server shutdown gracefully ✅");

});
process.on("SIGTERM", async () => {
  shutDown()
  logger.info("✅ Server shutdown gracefully ✅");

});
