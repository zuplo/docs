import { dereference } from "@apidevtools/json-schema-ref-parser";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser/dist/lib/types";
import { render } from "@zuplo/md-tools";
import arg from "arg";
import chalk from "chalk";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { copyFile, mkdir, readFile, rm, writeFile } from "fs/promises";
import glob from "glob";
import path from "path";
import prettier from "prettier";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

type PolicySchema = JSONSchema & {
  isPreview?: boolean;
  isPaidAddOn?: boolean;
  fakePolicyUrl?: string;
};

type PolicyProperties = Record<
  string,
  { description: string; properties?: PolicyProperties }
>;

// NOTE: This component is used to generate policy HTML in the policy script
// as such it CANNOT include css module imports

export const OptionProperties = ({
  properties,
}: {
  properties: PolicyProperties;
}) => (
  <ul>
    {Object.entries(properties).map(([key, value]) => (
      <li key={key}>
        <code>{key}</code>{" "}
        <div dangerouslySetInnerHTML={{ __html: value.description }} />
        {value.properties ? (
          <OptionProperties properties={value.properties} />
        ) : undefined}
      </li>
    ))}
  </ul>
);

const PolicyOptions = ({
  schema,
  policyId,
}: {
  schema: any;
  policyId: string;
}) => {
  const { properties } = schema.properties.handler;
  return (
    <ul>
      <li>
        <code>name</code> the name of your policy instance. This is used as a
        reference in your routes.
      </li>
      <li>
        <code>policyType</code> the identifier of the policy. This is used by
        the Zuplo UI. Value should be <code>{policyId}</code>.
      </li>
      <li>
        <code>handler/export</code> The name of the exported type. Value should
        be <code>{properties.export.const}</code>.
      </li>
      <li>
        <code>handler/module</code> the module containing the policy. Value
        should be <code>{properties.module.const}</code>.
      </li>
      {properties.options ? (
        <li>
          <code>handler/options</code> The options for this policy:
          <OptionProperties properties={properties.options.properties} />
        </li>
      ) : null}
    </ul>
  );
};

export default PolicyOptions;

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

async function generateMarkdown(
  policyId: string,
  schema: PolicySchema,
  policyFilePaths: Record<string, string>
) {
  let introMd: string | undefined;
  if (existsSync(policyFilePaths.introMd)) {
    introMd = await readFile(policyFilePaths.introMd, "utf-8");
  }

  let docMd: string | undefined;
  if (existsSync(policyFilePaths.docMd)) {
    docMd = await readFile(policyFilePaths.docMd, "utf-8");
  }

  const { examples } = schema.properties.handler as any;
  if (!Array.isArray(examples) || examples.length === 0) {
    throw new Error(`There are no examples set for policy ${policyId}`);
  }

  const copy = { ...examples[0] };
  delete copy._name;

  const code = {
    name: `my-${policyId}-policy`,
    policyType: policyId,
    handler: copy,
  };

  const optionsHtml = renderToStaticMarkup(
    <PolicyOptions schema={schema} policyId={policyId} />
  );
  return `---
title: ${schema.title} Policy
sidebar_label: ${schema.title}
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

<!-- start: intro.md -->
${introMd ?? schema.description}
<!-- end: intro.md -->

<PolicyStatus isPreview={${schema.isPreview ?? false}} isPaidAddOn={${
    schema.isPaidAddOn ?? false
  }} />

## Configuration 

\`\`\`json
${JSON.stringify(code, null, 2)}
\`\`\`

<div className="policy-options">
${optionsHtml}
</div>

<!-- start: doc.md -->
${docMd ?? ""}
<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
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
    const schema = (await dereference(rawSchema)) as PolicySchema;
    await processProperties(schema.properties);

    const policyFilePaths = getPolicyFilePaths(policyId);

    // Build the meta format for use in the portal
    const meta: Record<string, any> = {};
    meta.name = schema.title;
    meta.isPreview = !!schema.isPreview;
    meta.isPaidAddOn = !!schema.isPaidAddOn;
    meta.fakePolicyUrl = !!schema.fakePolicyUrl;
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

    const generatedMd = await generateMarkdown(
      policyId,
      schema,
      policyFilePaths
    );

    await writeFile(path.join(docsDir, `${policyId}.md`), generatedMd, "utf-8");
  });

  await Promise.all(tasks);

  await copyFile(
    path.resolve(policiesDir, "index.md"),
    path.resolve(docsDir, "index.md")
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
  watch().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

async function getExampleHtml(
  policyId: string,
  policyPath: string,
  schema: PolicySchema
) {
  if (!schema.description) {
    console.error(
      chalk.red(
        `ERROR: The policy ${policyId} does not have a description set in the schema`,
        policyPath
      )
    );
    throw new Error("Invalid schema");
  }

  const description = await render(schema.description);
  const properties = (schema.properties.handler as any).properties.options
    ?.properties;

  if (properties && Object.keys(properties).length === 0) {
    console.warn(
      chalk.yellow(
        `WARN: The policy ${policyId} does not have any options set in the schema.`
      )
    );
  }

  const html = renderToStaticMarkup(
    <>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {properties ? (
        <>
          <h3>Options</h3>
          <OptionProperties properties={properties} />{" "}
        </>
      ) : null}
    </>
  );

  return html;
}
