import RefParser from "@apidevtools/json-schema-ref-parser";
import { render } from "@zuplo/md-tools";
import arg from "arg";
import chalk from "chalk";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import glob from "glob";
import path from "path";
import prettier from "prettier";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { OptionProperties } from "../src/components/PolicyOptionProperties";

type PolicySchema = RefParser.JSONSchema & {
  isPreview?: boolean;
  isPaidAddOn?: boolean;
};

const policiesDir = path.resolve(process.cwd(), "./policies");
const docsDir = path.resolve(process.cwd(), "./docs/policies");

function stringify(obj: any) {
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
      properties[key].description = await render(properties[key].description);
    if (properties[key].properties) {
      await processProperties(properties[key].properties);
    }
  });
  return Promise.all(tasks);
}

function getPolicyFilePaths(policyId) {
  return {
    iconSvg: path.join(policiesDir, policyId, "icon.svg"),
    introMd: path.join(policiesDir, policyId, "intro.md"),
    docMd: path.join(policiesDir, policyId, "doc.md"),
  };
}

function generateMarkdown(
  policyId: string,
  schema: PolicySchema,
  intro: string | undefined,
  doc: string | undefined
) {
  return `---
title: ${schema.title} Policy
sidebar_label: ${schema.title}
---

import schemaJson from '@site/policies/${policyId}/schema.json';

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

${intro ?? schema.description}

<PolicyStatus isPreview={${schema.isPreview ?? false}} isPaidAddOn={${
    schema.isPaidAddOn ?? false
  }} />

## Configuration

:::tip

Be sure to read about [policies](../overview/policies.md)

:::

<PolicyExample schema={schemaJson} policyId="${policyId}" />

<PolicyOptions schema={schemaJson} policyId="${policyId}" />

${doc ?? ""}
`;
}

async function getIndexPage() {
  const intro = await readFile(path.join(policiesDir, "_index.md"));
  return `---
title: Policy Catalog
sidebar_label: Policies
---
  
import ItemCatalog from '@site/src/components/ItemCatalog';
import policyConfig from '@site/policies.v3.json';

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

${intro}

<ItemCatalog items={policyConfig.policies.map(({ id, name, icon }) => ({ id, name, icon, href: "/docs/policies/" + id }))} />
`;
}

async function run() {
  await rm(docsDir, { recursive: true, force: true });
  await mkdir(docsDir, { recursive: true });

  const policyConfigJson = await readFile(
    path.join(policiesDir, "config.json"),
    "utf-8"
  );
  const policyConfig = JSON.parse(policyConfigJson);

  const matches: string[] = await new Promise((resolve, reject) => {
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

  const policies = [];
  const tasks = matches.map(async (match) => {
    const policyId = match.replace("/schema.json", "");
    const schemaPath = path.join(policiesDir, match);
    const schemaJson = await readFile(schemaPath, "utf-8");
    const rawSchema = JSON.parse(schemaJson);
    // RefParser uses cwd to resolve refs
    process.chdir(path.join(policiesDir, policyId));
    const schema = (await RefParser.dereference(rawSchema)) as PolicySchema;
    await processProperties(schema.properties);

    const policyFilePaths = getPolicyFilePaths(policyId);

    // Build the meta format for use in the portal
    const meta: Record<string, any> = {};
    meta.name = schema.title;
    meta.isPreview = !!schema.isPreview;
    meta.isPaidAddOn = !!schema.isPaidAddOn;
    meta.documentationUrl = `https://zuplo.com/docs/policies/${policyId}/`;
    meta.id = policyId;

    const { examples } = schema.properties?.handler as any;
    if (examples && examples.length > 0) {
      const example = { ...examples[0] };
      delete example._name;
      meta.defaultHandler = example;
    } else {
      console.warn(
        chalk.yellow(
          `WARN: Policy ${policyId} does not have any examples in the schema.json`,
          schemaJson
        )
      );
      const handler = schema.properties.handler as any;
      meta.defaultHandler = {
        export: handler.properties.export.const,
        module: handler.properties.module.const,
        options: {},
      };
    }
    meta.exampleHtml = await getExampleHtml(policyId, schemaPath, schema);

    if (existsSync(policyFilePaths.iconSvg)) {
      const svg = await readFile(policyFilePaths.iconSvg, "utf-8");
      const src = `data:image/svg+xml;base64,${btoa(svg)}`;
      meta.icon = src;
    }
    policies.push(meta);

    let introMd: string | undefined;
    if (existsSync(policyFilePaths.introMd)) {
      introMd = await readFile(policyFilePaths.introMd, "utf-8");
    }

    let docMd: string | undefined;
    if (existsSync(policyFilePaths.docMd)) {
      docMd = await readFile(policyFilePaths.docMd, "utf-8");
    }

    const generatedMd = generateMarkdown(policyId, schema, introMd, docMd);

    await writeFile(path.join(docsDir, `${policyId}.md`), generatedMd, "utf-8");
  });

  try {
    await Promise.all(tasks);
  } catch (err) {
    process.exit(1);
  }
  await writeFile(
    path.resolve(docsDir, "index.md"),
    await getIndexPage(),
    "utf-8"
  );

  const policyDataV3 = {
    config: policyConfig,
    policies,
  };

  const policiesV3Json = stringify(policyDataV3);

  await writeFile(
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

async function getExampleHtml(
  policyId: string,
  policyPath: string,
  schema: PolicySchema
) {
  const html: string[] = [];
  if (schema.description) {
    const output = await render(schema.description);
    html.push(output);
  } else {
    console.error(
      chalk.red(
        `ERROR: The policy ${policyId} does not have a description set in the schema`,
        policyPath
      )
    );
    throw new Error("Invalid schema");
  }

  const properties = (schema.properties.handler as any).properties.options
    ?.properties;

  if (properties && Object.keys(properties).length > 0) {
    const element = renderToStaticMarkup(
      <OptionProperties properties={properties} />
    );

    html.push("<h3>Options</h3>");
    html.push(element);
  } else if (properties !== undefined) {
    console.warn(
      chalk.yellow(
        `WARN: The policy ${policyId} does not have any options set in the schema.`
      )
    );
  }

  if (html.length === 0) {
    return undefined;
  }
  return html.join("");
}
