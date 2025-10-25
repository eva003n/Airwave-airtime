import fs from "fs";
import path from "path";

const name = process.argv[2];
if (!name) {
  console.error(
    "❌  Please provide a migration name, e.g. npm run make:migration create-users"
  );
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-T:\.Z]/g, "")
  .slice(0, 14); // YYYYMMDDHHmmss

const fileName = `${timestamp}-${name}.ts`;
const filePath = path.resolve("src/migrations", fileName);

const template = `import { QueryInterface, DataTypes } from "sequelize";

 async function up({ context }: { context: QueryInterface }) {
  // TODO: write migration logic here
}

 async function down({ context }: { context: QueryInterface }) {
  // TODO: revert migration logic here
}

export { up, down };
`;

fs.writeFileSync(filePath, template);
console.log(`✅ Created migration file ${fileName}`, filePath);
