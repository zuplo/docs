import glob from "fast-glob";
import fs from "fs/promises";
import path from "path";
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
    fs.mkdir(path.join(process.cwd(), "src/app", folder), {
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
  await fs.mkdir(dirname, { recursive: true });
  await fs.copyFile(file, filePath);
}
