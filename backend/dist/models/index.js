// src/models/index.ts
import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";
import { dirname } from "path";
// Resolve current file path (ESM replacement for __dirname, __filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// Import config (make sure config/config.json or config/config.ts exists)
import configFile from "../config/database/config.js";
const config = configFile[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// Dynamically import all models
fs.readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".ts" &&
        file.indexOf(".test.ts") === -1);
})
    .forEach(async (file) => {
    const { default: modelDefiner } = await import(path.join(__dirname, file));
    const model = modelDefiner(sequelize, DataTypes);
    db[model.name] = model;
});
// Setup associations if defined
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
