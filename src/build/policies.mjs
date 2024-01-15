import { dereference } from "@apidevtools/json-schema-ref-parser";

import fs, { readFileSync } from "fs";
import { glob } from "glob";
import path from "path";
import { createLoader } from "simple-functional-loader";
import url from "url";
import { migrateContent } from "./migrate.mjs";

const __filename = url.fileURLToPath(import.meta.url);

/**
 * This builds the navigation tree from the navigation.json file.
 */
export default function withPolicies(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: __filename,
        use: [
          // Adding the babel loader enables fast refresh
          options.defaultLoaders.babel,
          createLoader(function () {
            const callback = this.async();
            getPolicies(this)
              .then((policies) => {
                const result = [];
                policies.forEach((policy) => {
                  result.push(
                    `export const ${policy.policyId.replaceAll(
                      "-",
                      "_",
                    )} = ${JSON.stringify(policy)};`,
                  );
                });
                callback(null, result.join("\n"));
              })
              .catch(callback);
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

async function getPolicies(loader) {
  const matches = await glob("./{policies,temp}/**/schema.json", {
    cwd: process.cwd(),
  });
  const policies = [];

  await Promise.all(
    matches.map(async (match) => {
      const policyDir = path.resolve(match.replace("/schema.json", ""));

      const policyId = match.split("/")[1];
      const schemaPath = path.join(policyDir, "schema.json");

      loader.addContextDependency(schemaPath);

      const schemaJson = readFileSync(schemaPath, "utf-8");
      const rawSchema = JSON.parse(schemaJson);
      // RefParser uses cwd to resolve refs
      // process.chdir(policyDir);
      const schema = await dereference(rawSchema);

      // Skip unlisted policies, they don't get docs or included in the output
      if (schema.isUnlisted) {
        return;
      }

      await processProperties(schema.properties);

      const files = [
        { name: "iconSvg", path: path.join(policyDir, "icon.svg") },
        { name: "introMd", path: path.join(policyDir, "intro.md") },
        { name: "docMd", path: path.join(policyDir, "doc.md") },
        { name: "policyTs", path: path.join(policyDir, "policy.ts") },
      ];

      const policy = {
        policyId,
        schema,
        files: {},
      };
      for (const file of files) {
        if (fs.existsSync(file.path)) {
          const sourcePath = path.resolve(file.path);
          loader.addContextDependency(sourcePath);
          const source = await fs.promises.readFile(sourcePath, "utf-8");

          if (["introMd", "docMd"].includes(file.name)) {
            policy.files[file.name] = await migrateContent(source, file.path);
          } else if (file.name === "iconSvg") {
            policy.icon = `data:image/svg+xml;base64,${btoa(source)}`;
          } else {
            policy.files[file.name] = source;
          }
        }
      }
      policies.push(policy);
    }),
  );

  return policies;
}

async function processProperties(properties) {
  const tasks = Object.keys(properties).map(async (key) => {
    if (properties[key].description) {
      properties[key].description = properties[key].description;
    }
    if (properties[key].properties) {
      await processProperties(properties[key].properties);
    }
  });
  return Promise.all(tasks);
}
