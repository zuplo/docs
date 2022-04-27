const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

async function getPolicies() {
  const policiesPath = path.resolve(
    __dirname,
    "../src/components/policies.json"
  );

  const response = await fetch(
    `https://cdn.zuplo.com/portal/policies.json?t=${Date.now()}`
  );
  const fileStream = fs.createWriteStream(policiesPath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
  console.log("Updated policies from CDN");
}

getPolicies().catch(console.error);
