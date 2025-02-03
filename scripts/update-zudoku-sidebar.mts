import { cp } from "fs/promises";
import { resolve } from "path";

const extractedDir = process.env.EXTRACTED_DIR;
if (!extractedDir) {
  throw new Error("No extracted dir provided");
}

const zudokuConfigPath = resolve(extractedDir, "./docs/sidebar.ts");

const tempConfigPath = new URL("../zudoku.sidebar.ts", import.meta.url)
  .pathname;

await cp(zudokuConfigPath, tempConfigPath);

console.log({ extractedDir, zudokuConfigPath });

const zudokuConfig = await import(tempConfigPath);

console.log({ zudokuConfig });
