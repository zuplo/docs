import fs from "fs";
import path from "path";
import sidebars from "./sidebars.js";

// Images
const staticDir = path.join(process.cwd(), "static");
const publicDir = path.join(process.cwd(), "public");
const mediaDir = path.join(process.cwd(), "docs/articles/media");
const publicMediaDir = path.join(publicDir, "media");
if (!fs.existsSync(publicDir)) {
  await fs.promises.cp(staticDir, publicDir, { recursive: true });
  await fs.promises.cp(mediaDir, publicMediaDir, { recursive: true });
}

function migrateCategory(category) {
  category.items = category.items.map((item) => {
    if (typeof item === "string") {
      if (item === "articles/node-modules") {
        return {
          type: "link",
          label: "Node Modules",
          href: "/articles/node-modules",
        };
      } else {
        return item;
      }
    } else if (item.type === "category") {
      return migrateCategory(item);
    } else {
      return item;
    }
  });
  return category;
}

const product = [
  sidebars.docs.pop(),
  sidebars.docs.pop(),
  sidebars.docs.pop(),
  sidebars.docs.pop(),
];
const navigation = [
  ...sidebars.docs.splice(0, sidebars.docs.length - 1),
  {
    type: "category",
    label: "Product",
    items: product,
  },
].map(migrateCategory);

await fs.promises.writeFile(
  "./sidebar.jsonc",
  JSON.stringify(navigation, null, 2),
  "utf-8",
);
