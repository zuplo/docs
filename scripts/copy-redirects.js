const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve(__dirname, "../_redirects");
const destinationPath = path.resolve(__dirname, "../build/_redirects");

fs.copyFileSync(sourcePath, destinationPath);
