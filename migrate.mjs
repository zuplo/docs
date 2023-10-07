import { mkdir, rename } from "fs/promises";
import glob from "glob";
import path from "path";


const matches= await new Promise((resolve, reject) => {
  glob(
    "docs/**/*.md",
    (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }
  );
});

await Promise.all(matches.map(async (match) => {
  const currentPath = path.join(process.cwd(), match);
  const newPath = path.join(process.cwd(), "src/app", match).replace(".md", "")
  await mkdir(newPath, { recursive: true })
  await rename(currentPath, path.join(newPath, "page.md"))
}));