import glob from "fast-glob";
import fs from "fs";
import path from "path";
import sidebars from "./sidebars.js";
import { migrateContent } from "./src/build/migrate.mjs";

// Partials
const partials = path.join(process.cwd(), "src/markdoc/partials");
await fs.promises.rm(partials, { recursive: true, force: true });
await fs.promises.mkdir(path.join(process.cwd(), "src/markdoc/partials"));
const source = path.join(process.cwd(), "docs/articles/_github-setup.md");
const dest = path.join(process.cwd(), "src/markdoc/partials/_github-setup.md");
const partial = await fs.promises.readFile(source, "utf-8");
const migrated = await migrateContent(partial);
await fs.promises.writeFile(dest, migrated, "utf-8");

// Images
const staticDir = path.join(process.cwd(), "static");
const publicDir = path.join(process.cwd(), "public");
const mediaDir = path.join(process.cwd(), "docs/articles/media");
const publicMediaDir = path.join(publicDir, "media");
if (!fs.existsSync(publicDir)) {
  await fs.promises.cp(staticDir, publicDir, { recursive: true });
  await fs.promises.cp(mediaDir, publicMediaDir, { recursive: true });
}

// Docs
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

const product = [
  sidebars.docs.pop(),
  sidebars.docs.pop(),
  sidebars.docs.pop(),
  sidebars.docs.pop(),
];
const navigation = [
  ...sidebars.docs.splice(0, sidebars.docs.length - 1),
  {
    type: "category",
    label: "Product",
    items: product,
  },
];

await fs.promises.writeFile(
  "./sidebar.jsonc",
  JSON.stringify(navigation, null, 2),
  "utf-8",
);
