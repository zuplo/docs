import { copyFileSync } from "fs";
import { resolve } from "path";

const sourcePath = resolve(__dirname, "../_redirects");
const destinationPath = resolve(__dirname, "../build/_redirects");

copyFileSync(sourcePath, destinationPath);
