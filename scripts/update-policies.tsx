import { dereference } from "@apidevtools/json-schema-ref-parser";
import chalk from "chalk";
import { existsSync } from "fs";
import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import type { Heading as AstHeading } from "mdast";
import { toString } from "mdast-util-to-string";
import path from "path";
import prettier from "prettier";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Node } from "unist";
import { visit } from "unist-util-visit";

const isNext = !!process.env.IS_NEXT;

// here just to keep the react import
const version = React.version;

type SchemaRecord = {
  [key: string]: JSONSchema7;
};

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

const OptionProperty = ({ schema }: { schema: JSONSchema7 }) => {
  isObjectSchema(schema);

  if (schema.type === "object" && schema.properties) {
    return <ObjectSchema schema={schema} />;
  } else if (schema.type === "array" && schema.items) {
    return <ArraySchema schema={schema} />;
  }
};

function ObjectSchema({ schema }: { schema: JSONSchema7 }) {
  return (
    <ul>
      {Object.entries(schema.properties as SchemaRecord).map(([key, value]) => (
        <li key={key}>
          <code>{key}</code>
          <OptionType value={value} />
          {schema.required?.includes(key) && (
            <span className="required-option">{" (Required)"}</span>
          )}
          {" - "}
          {value.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: value.description,
              }}
            />
          )}
          {value.type === "string" && value.enum && (
            <span className="allow-values">
              {" "}
              Allowed values are{" "}
              {value.enum.map((v, i) => {
                const comma = i < value.enum!.length - 1 ? ", " : null;
                const and = i === value.enum!.length - 1 ? "and " : null;
                return (
                  <span key={i}>
                    {and}
                    <code>{v!.toString()}</code>
                    {comma}
                  </span>
                );
              })}
              .
            </span>
          )}
          {value.default && (
            <span className="default-value">
              {" "}
              Defaults to <code>{value.default.toString()}</code>.
            </span>
          )}
          <OptionProperty schema={value} />
        </li>
      ))}
    </ul>
  );
}

function ArraySchema({ schema }: { schema: JSONSchema7 }) {
  const items = schema.items as JSONSchema7;
  if (items.type === "object" && items.properties) {
    return <ObjectSchema schema={items} />;
  }
  return null;
}

function OptionType({ value }: { value: JSONSchema7 }) {
  let typeString: string | undefined;
  if (value.type === "array") {
    const arrayType = (value.items as JSONSchema7 | undefined)?.type;
    typeString = arrayType ? `${arrayType}[]` : "array";
  } else if (value.type) {
    typeString = value.type.toString();
  } else if (value.oneOf) {
    typeString = value.oneOf
      .map((o: any) => {
        if (o.items && o.items.type) {
          return `${o.items.type.toString()}[]`;
        }
        return o.type?.toString();
      })
      .filter((t) => t !== undefined)
      .join(" | ");
  }
  if (typeString) {
    return <span className="type-option">{` <${typeString}>`}</span>;
  }
}

function isObjectSchema(val: unknown): asserts val is object {
  if (typeof val === "boolean") {
    throw new Error("Invalid schema");
  }
}

function Heading3({ title, id }: { title: string; id: string }) {
  return (
    <h3
      className="anchor anchorWithStickyNavbar_node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module"
      id={id}
    >
      {title}
      <a
        href={`#${id}`}
        className="hash-link"
        aria-label={`Direct link to ${title}`}
        title={`Direct link to ${title}`}
      >
        ​
      </a>
    </h3>
  );
}

const PolicyOptions = ({
  schema,
  policyId,
}: {
  schema: JSONSchema7Definition;
  policyId: string;
}) => {
  isObjectSchema(schema);
  const { handler } = schema.properties!;
  isObjectSchema(handler);
  const { properties } = handler;
  const { module: handlerModule, export: handlerExport, options } = properties!;
  isObjectSchema(handlerModule);
  isObjectSchema(handlerExport);
  return (
    <div>
      <Heading3 title="Policy Configuration" id="policy-configuration" />
      <ul>
        <li>
          <code>name</code> <span className="type-option">{"<string>"}</span> -
          The name of your policy instance. This is used as a reference in your
          routes.
        </li>
        <li>
          <code>policyType</code>{" "}
          <span className="type-option">{"<string>"}</span> - The identifier of
          the policy. This is used by the Zuplo UI. Value should be{" "}
          <code>{policyId}</code>.
        </li>
        <li>
          <code>handler.export</code>{" "}
          <span className="type-option">{"<string>"}</span> - The name of the
          exported type. Value should be{" "}
          <code>{handlerExport.const!.toString()}</code>.
        </li>
        <li>
          <code>handler.module</code>{" "}
          <span className="type-option">{"<string>"}</span> - The module
          containing the policy. Value should be{" "}
          <code>{handlerModule.const!.toString()}</code>.
        </li>
        {options && Object.keys(options).length > 0 ? (
          <li>
            <code>handler.options</code>{" "}
            <span className="type-option">{"<object>"}</span> - The options for
            this policy. <a href="#policy-options">See Policy Options</a> below.
          </li>
        ) : null}
      </ul>
      {options && Object.keys(options).length > 0 ? (
        <>
          <Heading3 title="Policy Options" id="policy-options" />
          <p>
            The options for this policy are specified below. All properties are
            optional unless specifically marked as required.
          </p>
          <OptionProperty schema={options as JSONSchema7} />
        </>
      ) : null}
    </div>
  );
};

const docsDir = path.resolve(
  process.cwd(),
  isNext ? "./src/app/policies" : "./docs/policies",
);
const policiesDir = path.resolve(process.cwd(), "./policies");
const policyManifestOutputPath = path.resolve(
  process.cwd(),
  "policies.v3.json",
);

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
## Example Custom Policy

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

${
  schema.isCustom
    ? `<CustomPolicyNotice name="${schema.title}" id="${policyId}" />`
    : ""
}


${
  schema.isDeprecated
    ? `:::danger Deprecated

This policy is deprecated. ${schema.deprecatedMessage ?? ""}

:::`
    : ""
}

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

## Using the Policy
<!-- start: doc.md -->
${(docMd ?? "").replace(/!\[(.*)\]\(\.\/(.*)\)/, `![$1](./${policyId}/$2)`)}
<!-- end: doc.md -->

Read more about [how policies work](/docs/articles/policies)
`;
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

    const generatedMd = await generateMarkdown(
      policyId,
      schema,
      policyFilePaths,
    );

    const outPath = isNext
      ? path.join(docsDir, policyId, `page.md`)
      : path.join(docsDir, `${policyId}.md`);
    const outdir = path.dirname(outPath);
    await mkdir(outdir, { recursive: true });
    await writeFile(outPath, generatedMd, "utf-8");
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

  const { html: introHtml } = await render(introOrDescription);

  isObjectSchema(schema);
  const { handler } = schema.properties!;
  isObjectSchema(handler);
  const { properties } = handler;
  const { options } = properties!;

  let deprecatedHtml;
  if (schema.isDeprecated) {
    let deprecatedInnerHtml = "<strong>This policy is deprecated.</strong>";
    if (schema.deprecatedMessage) {
      const { html } = await render(schema.deprecatedMessage);
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
