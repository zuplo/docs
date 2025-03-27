import { writeFileSync } from "fs";

const response = await fetch("https://dev.zuplo.com/openapi");
const data = await response.json();

data.servers[0].url = "https://api.zuplo.com";
data.servers[0].description = "Zuplo API";

writeFileSync("./api.json", JSON.stringify(data, null, 2), "utf-8");
