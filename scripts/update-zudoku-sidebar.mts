import esbuild from "esbuild";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import { resolve } from "path";

const categoriesToRemove = ["Deployment"];
const docsToRemove = ["docs/quickstart"];

const extractedDir = process.env.EXTRACTED_DIR;
if (!extractedDir) {
  throw new Error("No extracted dir provided");
}

async function getExcludedDocs(
  dir: string,
  prefix: string,
): Promise<Set<string>> {
  const excluded = new Set<string>();
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return excluded;
  }

  for (const file of files) {
    const filePath = resolve(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      const subExcluded = await getExcludedDocs(filePath, `${prefix}/${file}`);
      for (const item of subExcluded) {
        excluded.add(item);
      }
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      const content = await readFile(filePath, "utf8");
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch && /^zuplo:\s*false$/m.test(frontmatterMatch[1])) {
        const docPath = `${prefix}/${file.replace(/\.mdx?$/, "")}`;
        excluded.add(docPath);
      }
    }
  }

  return excluded;
}

function filterExcludedDocs(items: any[], excluded: Set<string>): any[] {
  return items
    .filter((item) => {
      if (typeof item === "string") {
        return !excluded.has(item);
      }
      if (item.type === "doc" && item.id) {
        return !excluded.has(item.id);
      }
      if (item.type === "filter") {
        return false;
      }
      return true;
    })
    .map((item) => {
      if (item.type === "category" && item.items) {
        return { ...item, items: filterExcludedDocs(item.items, excluded) };
      }
      return item;
    })
    .filter((item) => {
      // Remove empty categories after filtering
      if (item.type === "category" && item.items) {
        return item.items.length > 0;
      }
      return true;
    });
}

const excludedDocs = await getExcludedDocs(
  resolve(extractedDir, "docs/pages/docs"),
  "docs",
);

const zudokuConfigPath = resolve(extractedDir, "./docs/sidebar.ts");
const outfile = resolve("./node_modules/.zuplo-docs/zudoku.sidebar.js");
await esbuild.build({
  entryPoints: [zudokuConfigPath],
  outfile,
  external: ["zudoku"],
  bundle: true,
  format: "esm",
});

const { components, docs } = await import(outfile);

const combined = [...docs, ...components].filter(
  (item) =>
    !categoriesToRemove.includes(item.label) && !docsToRemove.includes(item),
);

const filtered = filterExcludedDocs(combined, excludedDocs);

function updatePaths(item: any) {
  if (typeof item === "string") {
    item = `dev-portal/zudoku/${item.replace(/^docs\//, "")}`;
  } else if (typeof item === "object") {
    if (item.link) {
      item.link = `dev-portal/zudoku/${item.link.replace(/^docs\//, "")}`;
    }

    if (Array.isArray(item)) {
      item = item.map(updatePaths);
    } else if (item.type === "category") {
      item.items = item.items.map(updatePaths);
    } else if (item.type === "doc") {
      item.path = item.path.replace(/^\/docs/, "");
    }
  }
  return item;
}

const sidebar = updatePaths(filtered);

// Group categories with only component items under a "Components" category
function groupComponentCategories(items: any) {
  const componentCategories = [];
  const otherItems = [];

  for (const item of items) {
    if (item.type === "category" && item.items) {
      // Check if all items in this category are components
      const allAreComponents = item.items.every((subItem: any) => {
        const path =
          typeof subItem === "string" ? subItem : subItem.path || subItem.link;
        return path && path.startsWith("dev-portal/zudoku/components/");
      });

      if (allAreComponents) {
        componentCategories.push(item);
      } else {
        otherItems.push(item);
      }
    } else {
      otherItems.push(item);
    }
  }

  // If there are component categories, group them under a single "Components" category
  if (componentCategories.length > 0) {
    const componentsCategory = {
      type: "category",
      label: "Components",
      icon: "component",
      items: componentCategories,
    };
    return [...otherItems, componentsCategory];
  }

  return items;
}

const groupedSidebar = groupComponentCategories(sidebar);

await writeFile(
  "./sidebar.zudoku.json",
  JSON.stringify(groupedSidebar, null, 2),
);
