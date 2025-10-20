// src/migrate.ts
import { Sequelize } from "sequelize-typescript";
import { Umzug, SequelizeStorage } from "umzug";
import path from "path";
import { fileURLToPath } from "url";
import  config  from "./config/database/postgres/config.js";
import type { ConfigEnv } from "./config/database/postgres/config.js";
import { NODE_ENV } from "./config/env.js";
import logger from "./logger/logger.winston.js";

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const env = (NODE_ENV as keyof ConfigEnv) || "development";
const dbConfig = config[env];
// Initialize Sequelize
const sequelize = new Sequelize({
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  dialectOptions: {
    /* --production-- */
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
  },
  logging: false,
//   models: [User, Recipient, Topup],
});

// Configure Umzug
const migrator = new Umzug({
  migrations: {
    // ESM-compatible glob (you can use .ts in dev, .js in prod)
    glob: path.join(__dirname, "migrations", "*.{ts,js}"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: logger,
});

// Helper functions
export const runMigrations = async () => {
  console.log("⏳ Running pending migrations...");
  const result = await migrator.up();
  logger.info(
    "✅ Migrations done:",
    result.map((m) => m.name)
  );
};

export const revertLastMigration = async () => {
  logger.info("⏳ Reverting last migration...");
  const result = await migrator.down();
  logger.info("⏪ Reverted:", result?.[0]?.name);
};

// ESM-safe entrypoint check
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      logger.info("✅ All migrations completed");
      process.exit(0);
    })
    .catch((err) => {
      logger.error("❌ Migration failed", err);
      process.exit(1);
    });
}
