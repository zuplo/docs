import RefParser from "@apidevtools/json-schema-ref-parser";
import arg from "arg";
import chokidar from "chokidar";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import glob from "glob";
import path from "path";
import prettier from "prettier";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const policiesDir = path.resolve(process.cwd(), "./policies");
const docsDir = path.resolve(process.cwd(), "./docs/policies");

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

function getPolicyFilePaths(policyId) {
  return {
    exampleMd: path.join(policiesDir, policyId, "example.md"),
    iconSvg: path.join(policiesDir, policyId, "icon.svg"),
    introMd: path.join(policiesDir, policyId, "intro.md"),
    docMd: path.join(policiesDir, policyId, "doc.md"),
  };
}

function generateMarkdown(policyId, schema, intro, doc) {
  return `---
title: ${schema.title}
sidebar_label: ${schema.title.replace(" Policy", "")}
---

import schemaJson from '@site/policies/${policyId}/schema.json';

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

${intro ?? schema.description}

<PolicyStatus isPreview={${schema.isPreview ?? false}} />

## Configuration

:::tip

Be sure to read about [policies](../overview/policies.md)

:::

<PolicyExample schema={schemaJson} policyId="${policyId}" />

<PolicyOptions schema={schemaJson} policyId="${policyId}" />

${doc ?? ""}
`;
}

async function run() {
  console.info("Updating policies...");
  await mkdir(docsDir, { recursive: true });

  const policyConfigJson = await readFile(
    path.join(policiesDir, "config.json"),
    "utf-8"
  );
  const policyConfig = JSON.parse(policyConfigJson);

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

    const policyFilePaths = getPolicyFilePaths(policyId);

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

    if (existsSync(policyFilePaths.exampleMd)) {
      meta.exampleMarkdown = readFileSync(policyFilePaths.exampleMd, "utf-8");
    }
    if (existsSync(policyFilePaths.iconSvg)) {
      const svg = readFileSync(policyFilePaths.iconSvg, "utf-8");
      const src = `data:image/svg+xml;base64,${btoa(svg)}`;
      meta.icon = src;
    }
    policiesMetaFormat.push(meta);

    policies[policyId] = schema;

    let introMd;
    if (existsSync(policyFilePaths.introMd)) {
      introMd = await readFile(policyFilePaths.introMd, "utf-8");
    }

    let docMd;
    if (existsSync(policyFilePaths.docMd)) {
      docMd = await readFile(policyFilePaths.docMd, "utf-8");
    }

    const generatedMd = generateMarkdown(policyId, schema, introMd, docMd);

    await writeFile(path.join(docsDir, `${policyId}.md`), generatedMd, "utf-8");
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

  writeFileSync(
    path.resolve(policiesDir, "../policies.v2.json"),
    policiesV2Json,
    "utf-8"
  );

  const policiesV3Json = stringify(policyDataV3);
  writeFileSync(
    path.resolve(policiesDir, "../policies.v3.json"),
    policiesV3Json,
    "utf-8"
  );

  console.info("Policies updated");
}

async function watch() {
  await run();
  var watcher = chokidar.watch(policiesDir, {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: true,
  });

  function changed(path) {
    run().catch(console.error);
  }

  watcher
    .on("add", changed)
    .on("change", changed)
    .on("unlink", changed)
    .on("error", function (error) {
      console.error("Error happened", error);
    });
}

const args = arg({
  // Types
  "--watch": Boolean,
});

if (args["--watch"]) {
  watch().catch(console.error);
} else {
  run().catch(console.error);
}
