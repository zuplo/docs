const http = require("https");
const { resolve } = require("path");
const { createWriteStream } = require("fs");

const file = createWriteStream(
  resolve(__dirname, "../components/articles/bundles.json")
);
http.get(
  `https://cdn.zuplo.com/portal/bundles.json?t=${Date.now()}`,
  function (response) {
    response.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log("Updated bundles.json");
    });
  }
);
