import { createWriteStream } from "fs";
import { get } from "https";
import { resolve } from "path";

const file = createWriteStream(
  resolve(process.cwd(), "./src/components/bundles.json")
);
get(
  `https://cdn.zuplo.com/portal/bundles.json?t=${Date.now()}`,
  function (response) {
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log("Updated bundles.json");
    });
  }
);
