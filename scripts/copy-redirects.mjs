import { copyFileSync } from "fs";
import { resolve } from "path";

const sourcePath = resolve(process.cwd(), "./_redirects");
const destinationPath = resolve(process.cwd(), "./build/_redirects");

copyFileSync(sourcePath, destinationPath);
