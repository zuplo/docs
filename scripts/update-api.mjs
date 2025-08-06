import { writeFileSync } from "fs";

const response = await fetch("https://dev.zuplo.com/openapi", {
  headers: {
    Accept: "application/json",
    "Accept-Encoding": "identity",
  },
});
const data = await response.json();

data.servers[0].url = "https://dev.zuplo.com";
data.servers[0].description = "Zuplo API";

writeFileSync("./api.json", JSON.stringify(data, null, 2), "utf-8");
