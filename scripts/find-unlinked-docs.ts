import fs from "fs";
import { glob } from "glob";
import { minimatch } from "minimatch";
import config from "../zudoku.config.js";
import { guides } from "../sidebar.guides.js";
import { extractDocsFromNavigation } from "./sidebar-utils.js";

// Read ignored docs (supports glob patterns and comments)
const ignorePatterns = await fs.promises
  .readFile(".sidebarignore", "utf8")
  .then((content) =>
    content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );

// Function to check if a doc should be ignored
function shouldIgnore(doc: string): boolean {
  return ignorePatterns.some((pattern) => {
    // Direct match
    if (pattern === doc) return true;
    // Glob pattern match
    return minimatch(doc, pattern, { dot: true });
  });
}

// Find all actual docs
const docs = (await glob("./docs/**/*.{md,mdx}")).map((file) =>
  file.replace("docs/", "").replace(/\.mdx?$/, ""),
);

const policies = (await glob("./temp/**/schema.json")).map((file) =>
  file.replace("temp/", "policies/").replace("/schema.json", ""),
);

const navigation = [...(config.navigation ?? []), ...guides];

// Extract all linked docs from navigation
const allLinkedDocs = extractDocsFromNavigation(navigation);

// Create unique sets and filter out ignored docs
const uniqueDocs = [...new Set([...docs, ...policies])].filter(
  (doc) => !shouldIgnore(doc),
);

const uniqueLinkedDocs = [...new Set(allLinkedDocs)];

// Find unlinked docs
const unlinkedDocs = uniqueDocs.filter(
  (doc) => !uniqueLinkedDocs.includes(doc),
);

// Report results
console.group();
console.log("The following docs aren't linked to in the sidebar:");
console.group();
for (const doc of unlinkedDocs.sort()) {
  console.log(doc);
}
console.groupEnd();

console.warn(
  `There are ${unlinkedDocs.length} docs that aren't linked to in the sidebar.`,
);

// Also check for broken links (linked but don't exist)
const brokenLinks = uniqueLinkedDocs.filter(
  (doc) => !docs.includes(doc) && !policies.includes(doc),
);

if (brokenLinks.length > 0) {
  console.group();
  console.error("The following linked docs don't exist:");
  console.group();
  for (const doc of brokenLinks.sort()) {
    console.error(doc);
  }
  console.groupEnd();
  console.error(`There are ${brokenLinks.length} broken links in the sidebar.`);
}

// Exit with error if there are issues
if (unlinkedDocs.length > 0 || brokenLinks.length > 0) {
  process.exit(1);
}
