// src/migrate.ts
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./logger/logger.winston.js";
import { sequelize } from "./config/database/postgres/postgres.js";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)


// const env = (NODE_ENV as keyof ConfigEnv) || "development";


// Configure Umzug
const migrator = new Umzug({
  // migration files path
  migrations: {
    // ESM-compatible glob (you can use .ts in dev, .js in prod)
    glob: ["src/migrations/*.{ts,js}", { cwd: path.resolve(__dirname, "..") }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: logger,
});

// Helper functions
export const runMigrations = async () => {
  logger.info("🔍 Searching for pending database migrations...");
  const pending = await migrator.pending();
  if (pending.length === 0) {
    logger.info("✅ No pending migrations. Database is up to date.");
    return;
  }else  {
    logger.info(`🔄 Found ${pending.length} pending migrations.`);
  }
  const result = await migrator.up();
  logger.info(
    "✅ Database migrations done...",
    result.map((m) => m.name)
  );
};

export const revertLastMigration = async () => {
  logger.info("⏳ Reverting last database migration...");
  const result = await migrator.down();
  logger.info("⏪ Reverted database migration...", result?.[0]?.name);
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
