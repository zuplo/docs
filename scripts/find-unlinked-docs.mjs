import fs from "fs";
import { glob } from "glob";

const sidebar = await fs.promises
  .readFile("./sidebar.json", "utf8")
  .then(JSON.parse);

const docs = (await glob("./docs/**/*.md")).map((file) =>
  file.replace("docs/", "").replace(".md", ""),
);
const policies = (await glob("./temp/**/schema.json")).map((file) =>
  file.replace("temp/", "policies/").replace("/schema.json", ""),
);

const allDocs = [];

function listDocs(items) {
  for (const item of items) {
    if (typeof item === "string") {
      allDocs.push(item);
    } else if ("items" in item && typeof item.items === "object") {
      listDocs(item.items);
    }
    if (typeof item === "object" && "link" in item) {
      if (typeof item.link === "string") {
        allDocs.push(item.link);
      } else if (
        "link" in item &&
        "type" in item.link &&
        item.link.type === "doc"
      ) {
        allDocs.push(item.link.id);
      }
    }
  }
}

listDocs(sidebar);

const uniqueDocs = [...new Set(docs), ...new Set(policies)];

const unlinkedDocs = uniqueDocs.filter((doc) => !allDocs.includes(doc));

console.log(unlinkedDocs);
console.log(
  `Total Docs: ${uniqueDocs.length}, Unlinked Docs: ${unlinkedDocs.length}`,
);
