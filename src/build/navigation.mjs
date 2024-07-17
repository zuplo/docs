import * as fs from "fs";
import matter from "gray-matter";
import * as path from "path";
import { createLoader } from "simple-functional-loader";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);

function resolveLink(item) {
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
    return {
      label: schema.title,
      href: `/${item}`,
    };
  } else {
    const docPath = path.resolve(path.join("docs", `${item}.md`));
    if (!fs.existsSync(docPath)) {
      throw new Error(`Doc file not found: ${docPath}`);
    }
    const docMd = fs.readFileSync(docPath, "utf8");
    const { data } = matter(docMd);
    return {
      label: data.sidebar_label ?? data.title,
      href: `/${item}`,
    };
  }
}

function resolveDoc(item) {
  const docPath = path.resolve(path.join("docs", `${item.id}.md`));
  if (!fs.existsSync(docPath)) {
    throw new Error(`Doc file not found: ${docPath}`);
  }
  const docMd = fs.readFileSync(docPath, "utf8");
  const { data } = matter(docMd);
  return {
    label: data.sidebar_label ?? data.title,
    href: `/${item.id}`,
  };
}

function buildNavSection(rawSection) {
  let section = {
    label: rawSection.label,
    isExpandedByDefault: rawSection.isExpandedByDefault,
  };
  if ("link" in rawSection) {
    if (typeof rawSection.link === "string") {
      const link = resolveLink(rawSection.link);
      section.href = link.href;
    } else if ("type" in rawSection.link && rawSection.link.type === "doc") {
      const doc = resolveDoc(rawSection.link);
      section.href = doc.href;
    } else if ("type" in rawSection.link && rawSection.link.type === "href") {
      section.href = rawSection.link.href;
    } else {
      throw new Error("Invalid link type");
    }
  }
  // setting down here just so the output of the code is easier to read with props at top of obj
  section.items = [];
  if (!rawSection.items) {
    return section;
  }
  for (const item of rawSection.items) {
    if (typeof item === "string") {
      section.items.push(resolveLink(item));
    } else if ("items" in item) {
      const child = buildNavSection(item);
      section.items.push(child);
    } else if ("type" in item && item.type === "doc") {
      section.items.push(resolveDoc(item));
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
