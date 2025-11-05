// src/migrate.ts
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./logger/logger.winston.js";
import { sequelize } from "./config/database/postgres/postgres.js";
import { DB_NAME, NODE_ENV } from "./config/env.js";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)


// const env = (NODE_ENV as keyof ConfigEnv) || "development";

const isProd = NODE_ENV === "production" || "development";

// Configure Umzug
const migrator = new Umzug({
  // migration files path
  migrations: {
    // ESM-compatible glob (you can use .ts in dev, .js in prod)
    // glob: ["src/migrations/*.{ts,js}", { cwd: path.resolve(__dirname, "..") }],
    glob: [
      isProd
        ? "dist/migrations/*.js" // compiled migrations
        : "src/migrations/*.ts", // raw TS files
      { cwd: path.resolve(__dirname, "..") },
    ],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: logger
});

// Helper functions
export const runMigrations = async () => {
  logger.info(`Running migrations in ${NODE_ENV} environment`)
  logger.info(
    `🔍 Searching for pending database migrations (Database -> ${sequelize.config.database})`
  );
  const pending = await migrator.pending();
  if (pending.length === 0) {
    logger.info("✅ No pending migrations. Database is up to date.");
    return;
  }else  {
  logger.info(
    `🔍 Searching for pending database migrations (Database -> ${sequelize.config.database})`
  );

    logger.info(`🔄 Found ${pending.length} pending migrations.`);
  }
  const result = await migrator.up();
  logger.info(
    `✅ Database migrations done (Database -> ${sequelize.config.database})`,
    result.map((m) => JSON.stringify(m.name))
  );
};

export const revertLastMigration = async () => {
    logger.info(`Rerveting migrations in ${NODE_ENV} environment`);

  logger.info(`⏳ Reverting last database migration (Database -> ${sequelize.config.database})`);
  const result = await migrator.down();
  logger.info(
    "⏪ Reverted database migration...",
    JSON.stringify(result?.[0]?.name)
  );
};

// ESM-safe entrypoint check
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      logger.info("✅ All database migrations completed");
      process.exit(0);
    })
    .catch((err) => {
      logger.error("❌Database  migration failed", err);
      process.exit(1);
    });
}


const command = process.argv[2]; // "up" or "down"
console.log(command);

(async () => {
  if (command === "up") {
    await migrator.up();
  } else if (command === "down") {
    await migrator.down();
  } else {
    logger.info("💡Use: pnpm migrate or pnpm migrate:undo");
  }
})();
