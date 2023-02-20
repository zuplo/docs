import fs from "fs";

const url = "https://zuplo.com";

const checkUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      console.warn(response.status, url);
    }
  } catch (err) {
    console.error(`ERROR ${url} - ${err.message}`);
  }
};

const checkEntry = async (entry) => {
  await checkUrl(`${url}${entry.source}`);
};

const main = async () => {
  const redirectsContent = fs.readFileSync("_redirects").toString();

  const lines = redirectsContent.split("\n");

  const data = lines.map((line) => {
    const items = line.split(" ");
    return {
      source: items[0],
      target: items[1],
      code: items[2],
    };
  });

  const errors = [];

  data.forEach(checkEntry);
};

main();
