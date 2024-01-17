import glob from "fast-glob";
import fs from "fs";
import { migrateContent } from "./src/build/migrate.mjs";

// Docs
const files = await glob("docs/**/*.md");

for (const file of files) {
  const content = await fs.promises.readFile(file, "utf-8");
  const modified = await migrateContent(content, file);
  await fs.promises.writeFile(file, modified, "utf-8");
}
