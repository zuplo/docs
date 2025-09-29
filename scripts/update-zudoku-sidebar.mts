import esbuild from "esbuild";
import { writeFile } from "fs/promises";
import { resolve } from "path";

const categoriesToRemove = ["Deployment"];
const docsToRemove = ["docs/quickstart"];

const extractedDir = process.env.EXTRACTED_DIR;
if (!extractedDir) {
  throw new Error("No extracted dir provided");
}

const zudokuConfigPath = resolve(extractedDir, "./docs/sidebar.tsx");
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

function updatePaths(item) {
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

const sidebar = updatePaths(combined);

// Group categories with only component items under a "Components" category
function groupComponentCategories(items) {
  const componentCategories = [];
  const otherItems = [];

  for (const item of items) {
    if (item.type === "category" && item.items) {
      // Check if all items in this category are components
      const allAreComponents = item.items.every((subItem) => {
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
