import { writeFileSync } from "fs";

const [response, responseBeta] = await Promise.all([
  fetch("https://dev.zuplo.com/openapi", {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  }),
  fetch("https://dev.zuplo.com/openapi-preview", {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  }),
]);

const data = await response.json();
data.servers[0].url = "https://dev.zuplo.com";
data.servers[0].description = "Zuplo API";
writeFileSync("./api.json", JSON.stringify(data, null, 2), "utf-8");

const dataBeta = await responseBeta.json();
dataBeta.servers[0].url = "https://dev.zuplo.com";
dataBeta.servers[0].description = "Zuplo API (Preview)";
writeFileSync("./api-preview.json", JSON.stringify(dataBeta, null, 2), "utf-8");
