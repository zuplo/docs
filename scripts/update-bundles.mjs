import { createWriteStream } from "fs";
import { resolve } from "path";
import { Readable } from "stream";

fetch(`https://cdn.zuplo.com/types/@zuplo/bundled/bundles.json`, {
  cache: "no-cache",
}).then((response) =>
  Readable.fromWeb(response.body).pipe(
    createWriteStream(resolve(process.cwd(), "./src/components/bundles.json"))
  )
);
