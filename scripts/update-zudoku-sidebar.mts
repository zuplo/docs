import esbuild from "esbuild";
import { writeFile } from "fs/promises";
import { resolve } from "path";

const extractedDir = process.env.EXTRACTED_DIR;
if (!extractedDir) {
  throw new Error("No extracted dir provided");
}

const zudokuConfigPath = resolve(extractedDir, "./docs/sidebar.ts");
const outfile = resolve("./dist/zudoku.sidebar.js");
await esbuild.build({
  entryPoints: [zudokuConfigPath],
  outfile,
  external: ["zudoku"],
  bundle: true,
  format: "esm",
});

const { components, docs } = await import(outfile);

const categoriesToRemove = ["Getting started", "Deployment"];
const combined = [...docs, ...components].filter(
  (item) => !categoriesToRemove.includes(item.label),
);

function updatePaths(item) {
  if (typeof item === "string") {
    item = `dev-portal/zudoku/${item}`;
  } else if (typeof item === "object") {
    if (item.link) {
      item.link = `dev-portal/zudoku/${item.link}`;
    }

    if (Array.isArray(item)) {
      item = item.map(updatePaths);
    } else if (item.type === "category") {
      item.items = item.items.map(updatePaths);
    } else if (item.type === "doc") {
      item.path = item.path.replace(/^\/docs/, "");
    }
  }
  return item;
}

const sidebar = updatePaths(combined);

await writeFile("./sidebar.zudoku.json", JSON.stringify(sidebar, null, 2));
