import { render } from "@/lib/markdown/mdx";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { glob } from "glob";
import { JSONSchema7Definition } from "json-schema";
import path from "path";
import { PolicyMeta, PolicySchema, Section } from "./interfaces";

const policiesDir = path.resolve(process.cwd(), "./policies");

export async function getAllPolicies() {
  const matches: string[] = await glob("**/schema.json", {
    cwd: policiesDir,
  });

  const policies = await Promise.all(
    matches.map(async (match) => {
      const policyId = match.replace("/schema.json", "");
      return getPolicy(policyId);
    }),
  );

  return policies;
}

export async function getPolicy(policyId: string) {
  const schemaPath = path.join(policiesDir, policyId, "schema.json");
  const schemaJson = await readFile(schemaPath, "utf-8");
  const schema = JSON.parse(schemaJson) as PolicySchema;
  await processProperties(schema.properties);

  // const policyFilePaths = getPolicyFilePaths(policyId);

  const iconSvg = await readFile(
    path.join(policiesDir, policyId, "icon.svg"),
    "utf-8",
  );
  const icon = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

  const sections: Section[] = [];

  let introHtml: string | undefined;
  const introMdPath = path.join(policiesDir, policyId, "intro.md");
  if (existsSync(introMdPath)) {
    const introMd = await readFile(introMdPath, "utf-8");
    const { content, toc } = await render(introMd);
    introHtml = content as string;
    sections.push(...toc);
  }

  let docHtml: string | undefined;
  const docMdPath = path.join(policiesDir, policyId, "doc.md");
  if (existsSync(docMdPath)) {
    const docMd = await readFile(docMdPath, "utf-8");
    const { content, toc } = await render(docMd);
    docHtml = content as string;
    sections.push(...toc);
  }

  // Build the meta format for use in the portal
  const meta: PolicyMeta = {
    name: schema.title!,
    isPreview: !!schema.isPreview,
    isPaidAddOn: !!schema.isPaidAddOn,
    isDeprecated: !!schema.isDeprecated,
    fakePolicyUrl: schema.fakePolicyUrl,
    href: `/docs/policies/${policyId}/`,
    id: policyId,
    icon,
  };

  if (policyId.endsWith("-policy")) {
    throw new Error(
      `ERROR: Policy ID '${policyId}' should not end with '-policy'.`,
    );
  }

  const { content: description } = await render(schema.description!);

  return { meta, schema, description, introHtml, docHtml, sections };
}

/**
 * Converts properties with markdown to HTML
 * @param properties
 * @returns
 */
async function processProperties(
  properties:
    | {
        [key: string]: JSONSchema7Definition;
      }
    | undefined,
) {
  if (!properties) {
    return;
  }
  const tasks = Object.keys(properties).map(async (key) => {
    const prop = properties[key];
    if (typeof prop === "boolean") {
      return;
    }
    if (prop.description) {
      const { content } = await render(prop.description);
      prop.description = content as string;
    }
    if (prop.properties) {
      await processProperties(prop.properties);
    }
  });
  return Promise.all(tasks);
}
