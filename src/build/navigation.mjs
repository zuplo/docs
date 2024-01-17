import * as fs from "fs";
import matter from "gray-matter";
import * as path from "path";
import { createLoader } from "simple-functional-loader";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);

function buildNavSection(rawSection) {
  let section = {
    label: rawSection.label,
    items: [],
  };
  if (!rawSection.items) {
    return section;
  }
  for (const item of rawSection.items) {
    if (typeof item === "string") {
      if (item.startsWith("policies/")) {
        let schemaPath = path.resolve(path.join(item, `schema.json`));
        if (!fs.existsSync(schemaPath)) {
          schemaPath = path.resolve(
            path.join(item.replace("policies/", "temp/"), `schema.json`),
          );
        }
        if (!fs.existsSync(schemaPath)) {
          throw new Error(`Schema file not found: ${schemaPath}`);
        }
        const schemaJson = fs.readFileSync(schemaPath, "utf8");
        const schema = JSON.parse(schemaJson);
        section.items.push({
          label: schema.title,
          href: `/${item}`,
        });
      } else {
        const docPath = path.resolve(path.join("docs", `${item}.md`));
        if (!fs.existsSync(docPath)) {
          throw new Error(`Doc file not found: ${docPath}`);
        }
        const docMd = fs.readFileSync(docPath, "utf8");
        const { data } = matter(docMd);
        section.items.push({
          label: data.sidebar_label ?? data.title,
          href: `/${item}`,
        });
      }
    } else if ("items" in item) {
      const child = buildNavSection(item);
      section.items.push(child);
    } else if ("type" in item && item.type === "doc") {
      const docPath = path.resolve(path.join("docs", `${item.id}.md`));
      if (!fs.existsSync(docPath)) {
        throw new Error(`Doc file not found: ${docPath}`);
      }
      const docMd = fs.readFileSync(docPath, "utf8");
      const { data } = matter(docMd);
      section.items.push({
        label: data.sidebar_label ?? data.title,
        href: `/${item.id}`,
      });
    } else {
      section.items.push(item);
    }
  }

  return section;
}

/**
 * This builds the navigation tree from the navigation.json file.
 */
export default function withNavigation(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: __filename,
        use: [
          // Adding the babel loader enables fast refresh
          options.defaultLoaders.babel,
          createLoader(function () {
            let navPath = path.resolve("./sidebar.json");
            this.addContextDependency(navPath);

            const json = fs.readFileSync(navPath, "utf8");
            const raw = JSON.parse(json);
            const navigation = [];
            for (const rawSection of raw) {
              const section = buildNavSection(rawSection);
              navigation.push(section);
            }

            const result = `
              export const navigation = ${JSON.stringify(navigation)};
            `;
            return result;
          }),
        ],
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}
