import RefParser from "@apidevtools/json-schema-ref-parser";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import glob from "glob";
import path from "path";
import prettier from "prettier";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const policiesDir = path.resolve(process.cwd(), "./policies");
const docsDir = path.resolve(process.cwd(), "./docs/policies");

const policyConfigJson = await readFile(
  path.join(policiesDir, "config.json"),
  "utf-8"
);
const policyConfig = JSON.parse(policyConfigJson);

const renderer = unified().use(remarkParse).use(remarkHtml);

async function md(val) {
  const result = await renderer.process(val);
  return result.value;
}

function stringify(obj) {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(obj);
  }
  return prettier.format(JSON.stringify(obj), {
    parser: "json",
  });
}

async function processProperties(properties) {
  const tasks = Object.keys(properties).map(async (key) => {
    if (properties[key].description)
      properties[key].description = await md(properties[key].description);
    if (properties[key].properties) {
      await processProperties(properties[key].properties);
    }
  });
  return Promise.all(tasks);
}

function getDirs(policyId) {
  return {
    exampleMd: path.join(policiesDir, policyId, "example.md"),
    iconSvg: path.join(policiesDir, policyId, "icon.svg"),
  };
}

function generateMarkdown(policyId, schema) {
  return `---
title: ${schema.title}
sidebar_label: ${schema.title.replace(" Policy", "")}
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

<PolicyIntro policy="${policyId}" />

## Configuration

:::tip

Be sure to read about [policies](./index.md)

:::

<PolicyExample policy="${policyId}" />

<PolicyOptions policy="${policyId}" />
`;
}

const matches = await new Promise((resolve, reject) => {
  glob(
    "**/schema.json",
    {
      cwd: policiesDir,
    },
    (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }
  );
});

const policies = {};
const policiesMetaFormat = [];
const tasks = matches.map(async (match) => {
  const policyId = match.replace("/schema.json", "");
  const schemaJson = readFileSync(path.join(policiesDir, match), "utf-8");
  const rawSchema = JSON.parse(schemaJson);
  // RefParser uses cwd to resolve refs
  process.chdir(path.join(policiesDir, policyId));
  const schema = await RefParser.dereference(rawSchema);
  await processProperties(schema.properties);

  const dirs = getDirs(policyId);

  // Build the meta format for use in the portal
  const meta = {};
  meta.name = schema.title;
  meta.isPreview = schema.isPreview;
  meta.id = policyId;

  if (meta.examples) {
    const example = { ...schema.examples[0] };
    delete example._name;
    meta.defaultHandler = example;
  } else {
    meta.defaultHandler = {
      export: schema.properties.handler.properties.export.const,
      module: schema.properties.handler.properties.module.const,
      options: {},
    };
  }

  if (existsSync(dirs.exampleMd)) {
    meta.exampleMarkdown = readFileSync(dirs.exampleMd, "utf-8");
  }
  if (existsSync(dirs.iconSvg)) {
    const svg = readFileSync(dirs.iconSvg, "utf-8");
    const src = `data:image/svg+xml;base64,${btoa(svg)}`;
    meta.icon = src;
  }
  policiesMetaFormat.push(meta);

  policies[policyId] = schema;

  const docMd = generateMarkdown(policyId, schema);

  await writeFile(path.join(docsDir, `${policyId}.md`), docMd, "utf-8");
});

await Promise.all(tasks);

const policyDataV2 = {
  config: policyConfig,
  policies: policiesMetaFormat,
};

const policyDataV3 = {
  config: policyConfig,
  policies,
};

const policiesV2Json = stringify(policyDataV2);
console.log(path.resolve("./policies.v2.json"));
writeFileSync(path.resolve("./policies.v2.json"), policiesV2Json, "utf-8");

const policiesV3Json = stringify(policyDataV3);
writeFileSync(path.resolve("./policies.v3.json"), policiesV3Json, "utf-8");
