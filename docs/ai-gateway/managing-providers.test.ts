/**
 * Verify docs/ai-gateway/managing-providers.mdx against the real portal.
 *
 * Run: npx tsx docs/ai-gateway/managing-providers.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "managing-providers",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Navigate to an AI Gateway project
    console.log("=== Navigate to AI Gateway project ===");
    await snap("01-home");

    // Find an AI Gateway project or create one
    const projects = await stagehand.extract(
      "List the projects shown. Include their names and types (API Gateway, AI Gateway, etc.)",
      z.object({
        projects: z.array(z.object({ name: z.string(), type: z.string() })),
      }),
    );
    const aiProject = projects.projects.find((p) => /ai/i.test(p.type));

    if (aiProject) {
      await stagehand.act(`Click on the project "${aiProject.name}"`);
    } else {
      warn(
        "setup",
        "AI Gateway project",
        "No AI Gateway project found — using first project",
      );
      await stagehand.act("Click on the first project");
    }
    await page.waitForTimeout(3000);

    // Navigate to Settings > AI Providers
    console.log("\n=== AI Providers page ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await stagehand.act('Click "AI Providers" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-ai-providers");

    // Doc: "Click Add Provider"
    const addBtn = await stagehand.observe('Find "Add Provider" button');
    addBtn.length > 0
      ? pass("add-provider", '"Add Provider" button exists')
      : fail("add-provider", '"Add Provider" button', "Not found");

    if (addBtn.length > 0) {
      await stagehand.act('Click "Add Provider"');
      await page.waitForTimeout(2000);
      await snap("03-add-provider-dialog");

      // Extract provider form structure
      const form = await stagehand.extract(
        "Describe the Add Provider form. What provider options are available (OpenAI, Anthropic, Gemini, etc.)? What fields exist (name, API key, URL, models)?",
        z.object({
          providers: z.array(z.string()),
          fields: z.array(z.string()),
        }),
      );
      console.log(`  Providers: ${form.providers.join(", ")}`);
      console.log(`  Fields: ${form.fields.join(", ")}`);

      // Doc mentions: OpenAI, Google Gemini
      form.providers.some((p) => /openai/i.test(p))
        ? pass("provider-openai", "OpenAI available")
        : warn(
            "provider-openai",
            "OpenAI",
            `Providers: ${form.providers.join(", ")}`,
          );

      // Doc: "Enter a name", "paste API key", "select models", "Click Create"
      form.fields.some((f) => /name/i.test(f))
        ? pass("field-name", "Name field")
        : warn("field-name", "Name field", `Fields: ${form.fields.join(", ")}`);
      form.fields.some((f) => /api.key|key/i.test(f))
        ? pass("field-key", "API Key field")
        : warn(
            "field-key",
            "API Key field",
            `Fields: ${form.fields.join(", ")}`,
          );

      await page.keyboard.press("Escape");
    }
  },
  import.meta.filename,
);
