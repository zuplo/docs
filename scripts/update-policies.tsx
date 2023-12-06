import { dereference } from "@apidevtools/json-schema-ref-parser";
import chalk from "chalk";
import chokidar from "chokidar";
import { existsSync } from "fs";
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import { glob } from "glob";
import { JSONSchema7 } from "json-schema";
import { Heading as AstHeading } from "mdast";
import { toString } from "mdast-util-to-string";
import path from "path";
import prettier from "prettier";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Node } from "unist";
import { visit } from "unist-util-visit";

// here just to keep the react import
const version = React.version;

type PolicySchema = JSONSchema7 & {
  isPreview?: boolean;
  isDeprecated?: boolean;
  isPaidAddOn?: boolean;
  isCustom?: boolean;
};

type PolicyProperties = Record<
  string,
  {
    default?: boolean | string | number;
    description: string;
    properties?: PolicyProperties;
  }
>;

type Heading = {
  depth: number;
  value: string;
  data?: any;
};

type RenderResult = {
  html: string | Buffer;
  headings: Array<Heading>;
};

const OptionProperties = ({ properties }: { properties: PolicyProperties }) => (
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
      {properties.options && Object.keys(properties.options).length > 0 ? (
        <li>
          <code>handler/options</code> The options for this policy:
          <OptionProperties properties={properties.options.properties} />
        </li>
      ) : null}
    </ul>
  );
};

const policiesDir = path.resolve(process.cwd(), "./policies");
const docsDir = path.resolve(process.cwd(), "./docs/policies");

const headings = (root: Node): Array<Heading> => {
  const headingList: Array<Heading> = [];

  visit(root, "heading", (node: AstHeading) => {
    const heading: Heading = {
      depth: node.depth,
      value: toString(node, { includeImageAlt: false }),
    };

    // Other remark plugins can store arbitrary data
    // inside a node's `data` property, such as a
    // custom heading id.
    const data = node?.data;
    if (data) {
      heading.data = data;
    }

    headingList.push(heading);
  });

  return headingList;
};

function remarkHeadings(): (node: Node, file: any) => void {
  return (node, file) => {
    file.data.headings = headings(node);
  };
}

function stringify(obj: any) {
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(obj);
  }
  return prettier.format(JSON.stringify(obj), {
    parser: "json",
  });
}

async function render(markdown: string): Promise<RenderResult> {
  const unified = (await import("unified")).unified;
  const rehypeSlug = (await import("rehype-slug")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;
  const remarkGfm = (await import("remark-gfm")).default;
  const remarkParse = (await import("remark-parse")).default;
  const remarkRehype = (await import("remark-rehype")).default;
  const rehypeAutolinkHeadings = (await import("rehype-autolink-headings"))
    .default;
  const rehypePrettyCode = (await import("rehype-pretty-code")).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHeadings)
    .use(remarkRehype)
    .use(rehypePrettyCode)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeStringify)
    .process(markdown);

  return {
    html: result.value,
    headings: result.data.headings as Array<Heading>,
  };
}

async function processProperties(properties: any) {
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

function getPolicyFilePaths(policyId: string) {
  return {
    iconSvg: path.join(policiesDir, policyId, "icon.svg"),
    introMd: path.join(policiesDir, policyId, "intro.md"),
    docMd: path.join(policiesDir, policyId, "doc.md"),
    policyTs: path.join(policiesDir, policyId, "policy.ts"),
  };
}

async function generateMarkdown(
  policyId: string,
  schema: PolicySchema,
  policyFilePaths: Record<string, string>,
) {
  let introMd: string | undefined;
  if (existsSync(policyFilePaths.introMd)) {
    introMd = await readFile(policyFilePaths.introMd, "utf-8");
  }

  let docMd: string | undefined;
  if (existsSync(policyFilePaths.docMd)) {
    docMd = await readFile(policyFilePaths.docMd, "utf-8");
  }

  let code: any;
  const { examples } = schema.properties?.handler as any;
  if (examples && examples.length > 0) {
    const example = { ...examples[0] };
    delete example._name;
    code = {
      name: `my-${policyId}-policy`,
      policyType: policyId,
      handler: example,
    };
  } else if (schema.isCustom) {
    code = {
      name: policyId,
      policyType: policyId.endsWith("-inbound")
        ? "custom-code-inbound"
        : "custom-code-outbound",
      handler: {
        export: "default",
        module: `$import(./modules/${policyId})`,
      },
    };
  } else {
    throw new Error(`There are no examples set for policy ${policyId}`);
  }

  let customCode = "";

  if (schema.isCustom && existsSync(policyFilePaths.policyTs)) {
    const policyTs = await readFile(policyFilePaths.policyTs, "utf-8");
    customCode = `
# Example Custom Policy

The code below is an example of how this custom policy module could be implemented.

\`\`\`ts title="modules/${policyId}.ts"
${policyTs}
\`\`\``;
  }

  const optionsHtml = renderToStaticMarkup(
    <PolicyOptions schema={schema} policyId={policyId} />,
  );
  return `---
title: ${schema.title} Policy
sidebar_label: ${schema.title}
---

<!-- WARNING: This document is generated. DO NOT EDIT BY HAND -->

# ${schema.title}

<!-- start: intro.md -->
${introMd ?? schema.description}
<!-- end: intro.md -->

<PolicyStatus isPreview={${schema.isPreview ?? false}} isPaidAddOn={${
    schema.isPaidAddOn ?? false
  }} />



${customCode}

## Configuration 

${
  schema.isCustom
    ? `The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.`
    : `The configuration shows how to configure the policy in the 'policies.json' document.`
}

\`\`\`json title="config/policies.json"
${JSON.stringify(code, null, 2)}
\`\`\`

<div className="policy-options">
${optionsHtml}
</div>

<!-- start: doc.md -->
${(docMd ?? "").replace(/!\[(.*)\]\(\.\/(.*)\)/, `![$1](./${policyId}/$2)`)}
<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
`;
}

export async function run() {
  // await rm(docsDir, { recursive: true, force: true });
  if (!existsSync(docsDir)) {
    await mkdir(docsDir, { recursive: true });
  }
  const policyConfigJson = await readFile(
    path.join(policiesDir, "config.json"),
    "utf-8",
  );
  const policyConfig = JSON.parse(policyConfigJson);

  const matches: string[] = await glob("**/schema.json", {
    cwd: policiesDir,
  });

  const policies: any = [];
  const tasks = matches.map(async (match) => {
    const policyId = match.replace(/[\\/]schema.json$/, "");
    const schemaPath = path.join(policiesDir, match);
    const schemaJson = await readFile(schemaPath, "utf-8");
    const rawSchema = JSON.parse(schemaJson);
    // RefParser uses cwd to resolve refs
    const policyDir = path.join(policiesDir, policyId);
    process.chdir(policyDir);
    const schema = (await dereference(rawSchema)) as PolicySchema;
    await processProperties(schema.properties);

    const policyFilePaths = getPolicyFilePaths(policyId);

    // Build the meta format for use in the portal
    const meta: Record<string, any> = {};
    meta.name = schema.title;
    meta.isPreview = !!schema.isPreview;
    meta.isPaidAddOn = !!schema.isPaidAddOn;
    meta.isCustom = !!schema.isCustom;
    meta.isDeprecated = !!schema.isDeprecated;
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
      delete example._name;
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
    if (schema.isCustom && existsSync(policyFilePaths.introMd)) {
      const intro = await readFile(policyFilePaths.introMd, "utf-8");
      const { html } = await render(intro);
      meta.exampleHtml = html;
    } else {
      meta.exampleHtml = await getExampleHtml(policyId, schemaPath, schema);
    }

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

    const generatedMd = await generateMarkdown(
      policyId,
      schema,
      policyFilePaths,
    );

    if (!schema.isDeprecated) {
      const policyOutDir = path.join(docsDir, policyId);
      if (!existsSync(policyOutDir)) {
        await mkdir(policyOutDir);
      }
      await writeFile(
        path.join(docsDir, `${policyId}.md`),
        generatedMd,
        "utf-8",
      );

      // Copy png files
      const assets = (await readdir(policyDir)).filter((file) => {
        return file.endsWith(".png");
      });
      for (const asset of assets) {
        const dest = path.resolve(policyOutDir, asset);
        if (existsSync(dest)) {
          await rm(dest);
        }
        await copyFile(
          path.resolve(policyDir, asset),
          path.resolve(policyOutDir, asset),
        );
      }
    }
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

  await writeFile(
    path.resolve(policiesDir, "../policies.v3.json"),
    policiesV3Json,
    "utf-8",
  );

  console.info("Policies updated");
}

async function getExampleHtml(
  policyId: string,
  policyPath: string,
  schema: PolicySchema,
) {
  if (!schema.description) {
    console.error(
      chalk.red(
        `ERROR: The policy ${policyId} does not have a description set in the schema`,
        policyPath,
      ),
    );
    throw new Error("Invalid schema");
  }

  const { html: description } = await render(schema.description);

  const properties = (schema.properties!.handler as any).properties.options
    ?.properties;
  if (!properties) {
    return;
  }
  if (properties && Object.keys(properties).length === 0) {
    console.warn(
      chalk.yellow(
        `WARN: The policy ${policyId} does not have any options set in the schema.`,
      ),
    );
  }

  const html = renderToStaticMarkup(
    <>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {Object.keys(properties).length > 0 ? (
        <>
          <h3>Options</h3>
          <OptionProperties properties={properties} />{" "}
        </>
      ) : null}
    </>,
  );

  return html;
}

export async function watch() {
  await run();
  var watcher = chokidar.watch(policiesDir, {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: true,
  });

  function changed() {
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
