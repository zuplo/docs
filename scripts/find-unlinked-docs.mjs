import fs from "fs";
import { glob } from "glob";

const ignoredDocs = await fs.promises
  .readFile(".sidebarignore", "utf8")
  .then((content) => content.split("\n"));

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
    } else if ("type" in item && item.type === "doc") {
      allDocs.push(item.id);
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

const uniqueDocs = [...new Set(docs), ...new Set(policies)].filter(
  (doc) => !ignoredDocs.includes(doc),
);

const unlinkedDocs = uniqueDocs.filter((doc) => !allDocs.includes(doc));

console.group();
console.log("The following docs are not linked to in the sidebar:");
console.group();
for (const doc of unlinkedDocs) {
  console.log(doc);
}
console.groupEnd();

console.warn(
  `There are ${unlinkedDocs.length} that are not linked to in the sidebar.`,
);
