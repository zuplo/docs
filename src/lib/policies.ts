import { render } from "@zuplo/md-tools";
import { readFile } from "fs/promises";
import { glob } from "glob";
import { JSONSchema7Definition } from "json-schema";
import path from "path";
import { PolicyMeta, PolicySchema } from "./interfaces";

const policiesDir = path.resolve(process.cwd(), "./policies");

export async function getAllPolicies() {
  const matches: string[] = await glob("**/schema.json", {
    cwd: policiesDir,
  });

  const policies = await Promise.all(
    matches.map(async (match) => {
      const policyId = match.replace("/schema.json", "");
      const schemaPath = path.join(policiesDir, match);
      const schemaJson = await readFile(schemaPath, "utf-8");
      const schema = JSON.parse(schemaJson) as PolicySchema;
      // RefParser uses cwd to resolve refs
      // await processProperties(schema.properties);

      // const policyFilePaths = getPolicyFilePaths(policyId);

      const iconSvg = await readFile(
        path.join(policiesDir, policyId, "icon.svg"),
        "utf-8",
      );
      const icon = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

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
        introMd: path.join(policiesDir, policyId, "intro.md"),
        docMd: path.join(policiesDir, policyId, "doc.md"),
      };

      if (policyId.endsWith("-policy")) {
        throw new Error(
          `ERROR: Policy ID '${policyId}' should not end with '-policy'.`,
        );
      }

      return { meta };
    }),
  );

  return policies;
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
      const { html } = await render(prop.description);
      prop.description = html as string;
    }
    if (prop.properties) {
      await processProperties(prop.properties);
    }
  });
  return Promise.all(tasks);
}
