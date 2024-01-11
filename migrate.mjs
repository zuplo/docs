import glob from "fast-glob";
import fs from "fs";
import path from "path";
import sidebars from "./sidebars.js";

const files = await glob("docs/**/*.md");
const folders = [
  "articles",
  "cli",
  "conferences",
  "deprecations",
  "errors",
  "handlers",
  "overview",
  "sample-apis",
];
await Promise.all(
  folders.map((folder) =>
    fs.promises.mkdir(path.join(process.cwd(), "src/app", folder), {
      recursive: true,
    }),
  ),
);
for (const file of files) {
  const basename = path.basename(file);
  const filePath = path.join(
    "src",
    "app",
    file.replace(basename, "").replace("docs/", ""),
    basename.replace(/\.md$/, ""),
    "page.md",
  );
  const dirname = path.dirname(filePath);
  await fs.promises.mkdir(dirname, { recursive: true });
  const content = await fs.promises.readFile(file, "utf-8");
  const modified = await migrateContent(content);
  await fs.promises.writeFile(filePath, modified, "utf-8");
}

await fs.promises.writeFile(
  "./sidebar.jsonc",
  JSON.stringify(sidebars.docs, null, 2),
  "utf-8",
);

async function migrateContent(content) {
  return content.replace(/<Screenshot src="(.*)" \/>/g, "![]($1)");
}
