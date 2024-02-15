import { dereference } from "@apidevtools/json-schema-ref-parser";
import chalk from "chalk";
import { existsSync } from "fs";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { JSONSchema7 } from "json-schema";
import path from "path";
import prettier from "prettier";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  OptionProperty,
  isObjectSchema,
} from "../src/components/policies/PolicyOptions";

// here just to keep the react import
const version = React.version;

type PolicySchema = JSONSchema7 & {
  isPreview?: boolean;
  isDeprecated?: boolean;
  isInternal?: boolean;
  isPaidAddOn?: boolean;
  isCustom?: boolean;
  deprecatedMessage?: string;
};

type Heading = {
  depth: number;
  value: string;
  data?: any;
};

type RenderResult = {
  html: string | Buffer;
  headings: Array<Heading>;
};

const docsDir = path.resolve(process.cwd(), "./src/app/policies");
const policiesDir = path.resolve(process.cwd(), "./policies");
const policyManifestOutputPath = path.resolve(
  process.cwd(),
  "policies.v3.json",
);

function stringify(obj: any) {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(obj);
  }
  return prettier.format(JSON.stringify(obj), {
    parser: "json",
  });
}

async function render(markdown: string): Promise<string> {
  const unified = (await import("unified")).unified;
  const rehypeStringify = (await import("rehype-stringify")).default;
  const remarkGfm = (await import("remark-gfm")).default;
  const remarkParse = (await import("remark-parse")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypePrettyCode = (await import("rehype-pretty-code")).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(markdown);

  return result.value;
}

async function processProperties(properties) {
  const tasks = Object.keys(properties).map(async (key) => {
    if (properties[key].description) {
      const { html } = await render(properties[key].description);
      properties[key].description = html;
    }
    if (properties[key].properties) {
      await processProperties(properties[key].properties);
    }
  });
  return Promise.all(tasks);
}

function getPolicyFilePaths(policyDir) {
  return {
    iconSvg: path.join(policyDir, "icon.svg"),
    introMd: path.join(policyDir, "intro.md"),
    docMd: path.join(policyDir, "doc.md"),
    policyTs: path.join(policyDir, "policy.ts"),
  };
}

export async function run() {
  console.log("Generating policies");
  // await rm(docsDir, { recursive: true, force: true });
  if (!existsSync(docsDir)) {
    await mkdir(docsDir, { recursive: true });
  }
  const policyConfigJson = await readFile(
    path.join(policiesDir, "config.json"),
    "utf-8",
  );
  const policyConfig = JSON.parse(policyConfigJson);

  const matches: string[] = await glob("./{policies,temp}/**/schema.json");

  const policies: any[] = [];
  const tasks = matches.map(async (match) => {
    const policyDir = path.join(
      process.cwd(),
      match.replace(/[\\/]schema.json$/, ""),
    );
    const policyId = match.split(/[\\/]/)[1];
    const schemaPath = path.join(policyDir, "schema.json");
    const schemaJson = await readFile(schemaPath, "utf-8");
    const rawSchema = JSON.parse(schemaJson);
    // RefParser uses cwd to resolve refs
    process.chdir(policyDir);
    const schema = (await dereference(rawSchema)) as PolicySchema;

    await processProperties(schema.properties);

    const policyFilePaths = getPolicyFilePaths(policyDir);

    // Build the meta format for use in the portal
    const meta: Record<string, any> = {};
    meta.name = schema.title;
    meta.isPreview = !!schema.isPreview;
    meta.isPaidAddOn = !!schema.isPaidAddOn;
    meta.isCustom = !!schema.isCustom;
    meta.isDeprecated = !!schema.isDeprecated;
    meta.isInternal = !!schema.isInternal;
    meta.deprecationMessage = schema.deprecatedMessage;
    meta.documentationUrl = `https://zuplo.com/docs/policies/${policyId}/`;
    meta.id = policyId;

    if (policyId.endsWith("-policy")) {
      console.error(
        chalk.red(
          `ERROR: Policy ID '${policyId}' should not end with '-policy'.`,
        ),
      );
      process.exit(1);
    }

    const { examples } = schema.properties?.handler as any;
    if (schema.isCustom) {
      meta.defaultHandler = {
        export: "default",
        module: `$import(./modules/${policyId})`,
      };
    } else if (examples && examples.length > 0) {
      const example = { ...examples[0] };
      Object.keys(example).forEach((key) => {
        if (key.startsWith("x-example") || key === "_name") {
          delete example[key];
        }
      });
      meta.defaultHandler = example;
    } else {
      console.warn(
        chalk.yellow(
          `WARN: Policy ${policyId} does not have any examples in the schema.json`,
          schemaJson,
        ),
      );
      const handler = schema.properties!.handler as JSONSchema7;
      meta.defaultHandler = {
        export: (handler.properties!.export as JSONSchema7).const,
        module: (handler.properties!.module as JSONSchema7).const,
        options: {},
      };
    }

    meta.exampleHtml = await getExampleHtml(
      policyId,
      schema,
      policyFilePaths.introMd,
    );

    if (existsSync(policyFilePaths.iconSvg)) {
      const svg = await readFile(policyFilePaths.iconSvg, "utf-8");
      const src = `data:image/svg+xml;base64,${btoa(svg)}`;
      meta.icon = src;
    }

    if (schema.isCustom && existsSync(policyFilePaths.policyTs)) {
      const policyTs = await readFile(policyFilePaths.policyTs, "utf-8");
      meta.customPolicyTemplate = policyTs;
    }

    policies.push(meta);
  });

  await Promise.all(tasks);

  await copyFile(
    path.resolve(policiesDir, "index.md"),
    path.resolve(docsDir, "index.md"),
  );

  const policyDataV3 = {
    config: policyConfig,
    policies,
  };

  const policiesV3Json = await stringify(policyDataV3);
  await writeFile(policyManifestOutputPath, policiesV3Json, "utf-8");

  console.info("Policies updated");
}

async function getExampleHtml(
  policyId: string,
  schema: PolicySchema,
  introMdPath: string,
) {
  let introOrDescription: string;
  if (existsSync(introMdPath)) {
    introOrDescription = await readFile(introMdPath, "utf-8");
  } else {
    introOrDescription = schema.description!;
  }

  const introHtml = await render(introOrDescription);

  isObjectSchema(schema);
  const { handler } = schema.properties!;
  isObjectSchema(handler);
  const { properties } = handler;
  const { options } = properties!;

  let deprecatedHtml;
  if (schema.isDeprecated) {
    let deprecatedInnerHtml = "<strong>This policy is deprecated.</strong>";
    if (schema.deprecatedMessage) {
      const html = await render(schema.deprecatedMessage);
      deprecatedInnerHtml =
        "<p>" + deprecatedInnerHtml + " " + html.toString().substring(3);
    }
    deprecatedHtml = (
      <div dangerouslySetInnerHTML={{ __html: deprecatedInnerHtml }} />
    );
  }

  if (properties!.options && Object.keys(properties!.options).length === 0) {
    console.warn(
      chalk.yellow(
        `WARN: The policy ${policyId} does not have any options set in the schema.`,
      ),
    );
  }

  // TODO: Move the deprecated message into custom UI in the portal
  // and remove from here.
  const html = renderToStaticMarkup(
    <>
      {deprecatedHtml}
      <div dangerouslySetInnerHTML={{ __html: introHtml }} />
      {options && Object.keys(options).length > 0 ? (
        <>
          <h3>Options</h3>
          <p>
            The options for this policy are specified below. All properties are
            optional unless specifically marked as required.
          </p>
          <OptionProperty schema={options as JSONSchema7} />
        </>
      ) : null}
    </>,
  );

  return html;
}
