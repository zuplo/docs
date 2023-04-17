import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
const json = readFileSync(join(process.cwd(), "vercel.json"), "utf8");
const data = JSON.parse(json);

let redirects = {};
data.redirects.forEach((redirect) => {
  let source = redirect.source;
  if (source.endsWith("/")) {
    source = source.slice(0, -1);
  }
  redirects[source] = redirect.destination;
});

let newRedirects = [];
Object.entries(redirects).forEach(([source, destination]) => {
  newRedirects.push({
    source: `${source}{/}?`,
    destination,
    permanent: true,
  });
});

const outJson = JSON.stringify({ redirects: newRedirects }, null, 2);
writeFileSync(join(process.cwd(), "vercel.json"), outJson, "utf-8");
