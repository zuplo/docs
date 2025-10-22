import { glob } from "glob";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import fs from "node:fs/promises";
import path from "node:path";
import prettier from "prettier";
import { createMarkdown } from "safe-marked";
import { fixMarkdown } from "./fix-markdown.js";

const EXCLUDED_POLICIES = ["api-key-auth-inbound"];

const renderMd = createMarkdown();
const projectDir = path.join(import.meta.dirname, "..");
const policyDir = path.join(projectDir, "docs/policies");

// Check for environment variable or command line flag to use local core policies
const useLocalCore =
  process.env.USE_LOCAL_CORE_POLICIES === "true" ||
  process.argv.includes("--local-core");

if (useLocalCore) {
  console.log(
    "📂 Using local core policies from:",
    path.join(projectDir, "../core/packages/runtime/src/policies"),
  );
} else {
  console.log("📂 Using policies from: policies/ and temp/");
}

const policySchemas = useLocalCore
  ? await glob("*/schema.json", {
      cwd: path.join(projectDir, "../core/packages/runtime/src/policies"),
    })
  : await glob("{policies,temp}/*/schema.json", {
      cwd: projectDir,
    });

const printIf = (condition: unknown, render?: string) =>
  condition ? (render ?? condition) : "";
// Function to escape curly braces in MDX content
// We specifically target {value} patterns that would be interpreted as JSX
const escapeMdxCurlyBraces = (content: string) => {
  // Only escape {value} and similar patterns that aren't already in code blocks
  // First, split by code blocks (triple backticks)
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = content.split(codeBlockRegex);

  return parts
    .map((part, index) => {
      // Odd indices are code blocks - don't touch them
      if (index % 2 === 1) {
        return part;
      }

      // For non-code-block parts, split by inline code (single backticks)
      const inlineCodeRegex = /(`[^`]*`)/g;
      const subParts = part.split(inlineCodeRegex);

      return subParts
        .map((subPart, subIndex) => {
          // Odd indices are inline code - don't touch them
          if (subIndex % 2 === 1) {
            return subPart;
          }

          // For regular text, escape {value} patterns by wrapping in backticks
          // This regex matches {word} patterns that could be mistaken for JSX
          return subPart.replace(/\{(\w+)\}/g, "`{$1}`");
        })
        .join("");
    })
    .join("");
};

function invariant(condition: unknown, message: string): asserts condition {
  if (condition) return;

  throw new Error(message);
}

type PolicyProduct = "ai-gateway" | "api-gateway" | "mcp-gateway";
type PolicySchema = JSONSchema7 & {
  isBeta?: boolean;
  isCustom?: boolean;
  isDeprecated?: boolean;
  isPaidAddOn?: boolean;
  isEnterprise?: boolean;
  isHidden?: boolean;
  products: PolicyProduct[];
  isInternal?: boolean;
  deprecatedMessage?: string;
  properties?: {
    handler?: {
      properties?: {
        export?: {
          const: string;
          description?: string;
        };
        module?: {
          const: string;
          description?: string;
        };
        options?: JSONSchema7;
      };
      examples?: object[];
    };
  };
};

const policyFiles = ["intro.md", "doc.md", "icon.svg", "policy.ts"] as const;

const uiPolicies: {
  id: string;
  name: string | undefined;
  isDeprecated?: boolean;
  isHidden?: boolean;
  icon: string | undefined;
  products: PolicyProduct[];
}[] = [];

const getExampleHtml = async (
  policyId: string,
  schema: PolicySchema,
  intro?: string,
) => {
  const introOrDescription = intro ?? schema.description;

  invariant(
    introOrDescription,
    `No intro or description found for policy ${policyId}`,
  );

  const introHtml = renderMd(introOrDescription);

  invariant(
    schema.properties?.handler,
    `No handler found for policy ${policyId}`,
  );

  const { properties } = schema.properties.handler;
  const options = properties?.options;

  invariant(properties, `No handler properties found for policy ${policyId}`);

  let deprecatedHtml = "";

  if (schema.isDeprecated) {
    const deprecatedInnerHtml = "**This policy is deprecated.**";
    if (schema.deprecatedMessage) {
      const html = renderMd(schema.deprecatedMessage);
      deprecatedHtml = `<p>${deprecatedInnerHtml} ${html}</p>`;
    }
  }

  if (options && Object.keys(options).length === 0) {
    console.warn(
      `The policy ${policyId} doesn't have any options set in the schema.`,
    );
  }

  // TODO: Move the deprecated message into custom UI in the portal
  const html = `${deprecatedHtml.trim()}
<div>${introHtml.trim()}</div>
${
  options && Object.keys(options).length > 0
    ? `<h3>Options</h3>
<p>
  The options for this policy are specified below. All properties are
  optional unless specifically marked as required.
</p>
${renderMd(generateOptions(options))}`
    : ""
}
  `.trim();

  return html;
};

const policyData: any = {
  config: await import(path.join(projectDir, "policies/config.json")).then(
    (m) => m.default,
  ),
  policies: [],
};

for (const schemaPath of policySchemas) {
  const schemaDirName = path.dirname(schemaPath);
  const policyId = useLocalCore
    ? schemaDirName
    : schemaDirName.split("/").pop()!;
  const currentDir = useLocalCore
    ? path.join(projectDir, "../core/packages/runtime/src/policies", policyId)
    : path.join(projectDir, schemaDirName);

  if (EXCLUDED_POLICIES.includes(policyId)) continue;

  const schema = (await import(
    path.join(currentDir, "schema.json")
  )) as PolicySchema;

  // NOTE: We don't skip 'hidden' policies because they are just hidden in the
  // navigation, but they are still accessible via direct link.
  // For 'deprecated' policies, there's no point surfacing them in the
  // navigation - but they are still accessible via direct link for people still
  // using them.
  // 'internal' policies are skipped entirely as they aren't ready for the
  // public.
  if (schema.isInternal) continue;

  const [intro, doc, icon, tsPolicy] = await Promise.all(
    policyFiles.map(async (file) => {
      try {
        return await fs.readFile(path.join(currentDir, file), "utf-8");
      } catch (e) {
        return;
      }
    }),
  );

  uiPolicies.push({
    id: policyId,
    name: schema.title,
    icon,
    isDeprecated: schema.isDeprecated,
    isHidden: schema.isHidden,
    products: schema.products,
  });

  const handler = schema.properties?.handler;

  if (!handler?.properties?.module || !handler?.properties?.export) {
    throw new Error("Handler module and export are required");
  }

  const meta: any = {
    name: schema.title,
    description: schema.description,
    isBeta: Boolean(schema.isBeta),
    isPaidAddOn: Boolean(schema.isPaidAddOn),
    isEnterprise: Boolean(schema.isEnterprise),
    isCustom: Boolean(schema.isCustom),
    isDeprecated: Boolean(schema.isDeprecated),
    isInternal: Boolean(schema.isInternal),
    deprecationMessage: schema.deprecatedMessage,
    products: schema.products,
    documentationUrl: `https://zuplo.com/docs/policies/${policyId}`,
    id: policyId,
  };

  const { examples } = handler;
  if (schema.isCustom) {
    meta.defaultHandler = {
      export: "default",
      module: `$import(./modules/${policyId})`,
    };
  } else if (examples && examples.length > 0) {
    const example = { ...examples[0] };
    delete (example as any)._name;
    meta.defaultHandler = example;
  } else {
    meta.defaultHandler = {
      export: (handler.properties.export as JSONSchema7).const,
      module: (handler.properties.module as JSONSchema7).const,
      options: {},
    };
  }

  meta.exampleHtml = await getExampleHtml(policyId, schema, intro);

  if (icon) {
    meta.icon = `data:image/svg+xml;base64,${btoa(icon)}`;
  }

  if (schema.isCustom && tsPolicy) {
    meta.customPolicyTemplate = tsPolicy;
  }

  policyData.policies.push(meta);

  let code: { name: string; policyType: string; handler: object };

  if (examples && examples.length > 0) {
    code = {
      name: `my-${policyId}-policy`,
      policyType: policyId,
      handler: examples[0],
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

  const hasOptions =
    handler?.properties?.options &&
    Object.keys(handler.properties.options).length > 0;

  const mdx = `
# ${schema.title} Policy

${printIf(
  schema.isCustom,
  `
:::tip{title="Custom Policy Example"}

Zuplo is extensible, so we don't have a built-in policy for ${schema.title}, instead we've a template here that shows you how you can use your superpower (code) to achieve your goals. To learn more about custom policies [see the documentation](/policies/custom-code-${policyId.endsWith("-inbound") ? "inbound" : "outbound"}).

:::`,
)}

${printIf(schema.isDeprecated, `<pre>This policy is deprecated. ${printIf(schema.deprecatedMessage)}</pre>`)}
${printIf(escapeMdxCurlyBraces(fixMarkdown(intro ?? schema.description ?? "")))}
${printIf(
  schema.isBeta,
  `
:::caution{title="Beta"}

This policy is in beta. You can use it today, but it may change in non-backward compatible ways before the final release.

:::`,
)}
${printIf(
  schema.isEnterprise,
  `
:::info{title="Enterprise Feature"}

This policy is only available as part of our enterprise plans. It's free to try only any plan for development only purposes. If you would like to use this in production reach out to us: [sales@zuplo.com](mailto:sales@zuplo.com)

:::`,
)}
${printIf(
  schema.isPaidAddOn,
  `
:::info{title="Enterprise Feature"}

This policy is only available as part of our enterprise plans. If you would like to use this in production reach out to us: [sales@zuplo.com](mailto:sales@zuplo.com)

:::`,
)}

${printIf(schema.isCustom && tsPolicy, ["```ts", tsPolicy, "```"].join("\n"))}

## Configuration

${
  schema.isCustom
    ? `The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.`
    : `The configuration shows how to configure the policy in the 'policies.json' document.`
}

\`\`\`json
${JSON.stringify(code, null, 2)}
\`\`\`

### Policy Configuration

- \`name\` <code className="text-green-600">&lt;string&gt;</code> - The name of your policy instance. This is used as a reference in your routes.
- \`policyType\` <code className="text-green-600">&lt;string&gt;</code> - The identifier of the policy. This is used by the Zuplo UI. Value should be \`${policyId}\`.
- \`handler.export\` <code className="text-green-600">&lt;string&gt;</code> - The name of the exported type. Value should be \`${handler.properties.export.const}\`.
- \`handler.module\` <code className="text-green-600">&lt;string&gt;</code> - The module containing the policy. Value should be \`${handler.properties.module.const}\`.
${
  hasOptions
    ? `- \`handler.options\` <code className="text-green-600">&lt;object&gt;</code> - The options for this policy. [See Policy Options](#policy-options) below.`
    : ""
}

${generateOptions(handler.properties.options)}

## Using the Policy

${printIf(escapeMdxCurlyBraces(fixMarkdown(doc ?? "")))}

Read more about [how policies work](/articles/policies)
`;

  await fs.writeFile(
    path.join(policyDir, `${policyId}.mdx`),
    await prettier.format(mdx, { parser: "mdx" }),
  );

  if (icon) {
    const iconDir = path.join(projectDir, "public/policies");

    await fs.mkdir(iconDir, { recursive: true });
    await fs.writeFile(path.join(iconDir, `${policyId}.svg`), icon);
  }
}

await fs.writeFile(
  path.join(projectDir, "policies.ui.json"),
  JSON.stringify(uiPolicies, null, 2),
);

await fs.writeFile(
  path.join(projectDir, "policies.v4.json"),
  JSON.stringify(policyData, null, 2),
);

await fs.writeFile(
  path.join(projectDir, "policies.v5.json"),
  JSON.stringify(policyData, null, 2),
);

function generateOptions(schema?: JSONSchema7) {
  if (!schema) return "";

  const renderProperties = (
    properties: { [key: string]: JSONSchema7Definition },
    required: string[] = [],
    depth = 0,
  ) => {
    const indent = "  ".repeat(depth);
    return Object.entries(properties)
      .map(([key, value]) => {
        if (typeof value === "boolean") return "";
        const isRequired = required.includes(key) ? " **(required)**" : "";
        const propertyType = getMarkdownType(value);
        const description = value.description ?? "No description available.";
        const defaultValue =
          value.default !== undefined
            ? ` Defaults to \`${JSON.stringify(value.default)}\`.`
            : "";
        const enumValues = value.enum
          ? ` Allowed values are ${value.enum.map((v) => `\`${v}\``).join(", ")}.`
          : "";

        // Escape curly braces in description to prevent React from interpreting them as variables
        const escapedDescription = escapeMdxCurlyBraces(description);

        return `${indent}- \`${key}\`${isRequired} <code className="text-green-600">&lt;${propertyType}&gt;</code> - ${escapedDescription}${enumValues}${defaultValue}${renderOption(value, depth + 1)}`;
      })
      .join("\n");
  };

  const renderOption = (
    schema: JSONSchema7Definition,
    depth: number,
  ): string => {
    if (typeof schema === "boolean") return "";
    if (schema.type === "object" && schema.properties) {
      return `\n${renderProperties(schema.properties, schema.required, depth)}`;
    } else if (
      schema.type === "array" &&
      schema.items &&
      typeof schema.items !== "boolean"
    ) {
      return Array.isArray(schema.items)
        ? schema.items.map((item) => renderOption(item, depth)).join("\n")
        : renderOption(schema.items, depth);
    }
    return "";
  };

  const getMarkdownType = (schema: JSONSchema7Definition): string => {
    if (typeof schema === "boolean") return "boolean";
    if (
      schema.type === "array" &&
      schema.items &&
      typeof schema.items !== "boolean"
    ) {
      const itemsType = Array.isArray(schema.items)
        ? schema.items.map((item) => getMarkdownType(item)).join(" | ")
        : getMarkdownType(schema.items);
      return `${itemsType}[]`;
    }
    return String(schema.type);
  };

  if (schema.type === "object" && schema.properties) {
    return `
### Policy Options

The options for this policy are specified below. All properties are optional unless specifically marked as required.

${renderProperties(schema.properties, schema.required)}`;
  }

  return "";
}
