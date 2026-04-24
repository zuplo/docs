/**
 * Verify docs/ai-gateway/managing-apps.mdx against the real portal.
 *
 * Run: npx tsx docs/ai-gateway/managing-apps.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "managing-apps",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Navigate to AI Gateway project
    const projects = await stagehand.extract(
      "List project names and types",
      z.object({
        projects: z.array(z.object({ name: z.string(), type: z.string() })),
      }),
    );
    const aiProject = projects.projects.find((p) => /ai/i.test(p.type));
    if (aiProject) await stagehand.act(`Click on "${aiProject.name}"`);
    else await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Navigate to Apps tab
    console.log("=== Apps page ===");
    await stagehand.act('Click "Apps" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-apps-page");

    // Doc: Apps have API Keys
    const appsBtns = await stagehand.observe('Find "Create App" button');
    appsBtns.length > 0
      ? pass("create-app-btn", '"Create App" button exists')
      : fail("create-app-btn", '"Create App" button', "Not found");

    // Click Create App to inspect the form
    if (appsBtns.length > 0) {
      await stagehand.act('Click "Create App"');
      await page.waitForTimeout(2000);
      await snap("02-create-app-form");

      const appForm = await stagehand.extract(
        "List ALL form fields/labels on the Create App page. Include budget fields, advanced features, semantic caching.",
        z.object({
          fields: z.array(z.string()),
          hasSemanticCaching: z.boolean(),
          sections: z
            .array(z.string())
            .describe("Section headings on the page"),
        }),
      );
      console.log(`  Fields: ${appForm.fields.join(", ")}`);
      console.log(`  Sections: ${appForm.sections.join(", ")}`);

      // Doc: Each App has its own API Key
      // Doc: Apps are owned by a team
      appForm.fields.some((f) => /team/i.test(f))
        ? pass("team-field", "Team selector in app form")
        : warn(
            "team-field",
            "Team field",
            `Fields: ${appForm.fields.join(", ")}`,
          );

      appForm.hasSemanticCaching
        ? pass("semantic-caching", "Semantic Caching toggle")
        : warn("semantic-caching", "Semantic Caching", "Not found");

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await snap("03-create-app-scrolled");
    }
  },
  import.meta.filename,
);
