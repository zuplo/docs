import fs from "fs";

const redirectsContent = fs.readFileSync("_redirects");

const lines = redirectsContent.split("\n");

const data = lines.map((line) => {
  const items = line.split(" ");
  return {
    source: items[0],
    target: items[1],
    code: items[2],
  };
});
