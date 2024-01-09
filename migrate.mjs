import glob from "fast-glob";
import fs from "fs/promises";
import path from "path";
const files = await glob("docs/**/*.md");
await fs.rm(path.join(process.cwd(), "src/app/docs"), {
  recursive: true,
  force: true,
});
for (const file of files) {
  const basename = path.basename(file);
  const filePath = path.join(
    "src",
    "app",
    file.replace(basename, ""),
    basename.replace(/\.md$/, ""),
    "page.md",
  );
  const dirname = path.dirname(filePath);
  await fs.mkdir(dirname, { recursive: true });
  await fs.rename(file, filePath);
}
