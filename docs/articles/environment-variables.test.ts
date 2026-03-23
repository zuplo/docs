/**
 * Verify docs/articles/environment-variables.mdx — Settings > Environment Variables.
 *
 * Run: npx tsx docs/articles/environment-variables.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "environment-variables",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Doc: 'click Settings and then select Environment Variables'
    console.log("=== Settings > Environment Variables ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings");

    const sidebar = await stagehand.extract(
      "List every individual sidebar link/item in the Settings page (not just the section headings). Include items like General, API Key Consumers, Environment Variables, Members & Access, Source Control, Custom Domains, Billing, Environments, Zuplo API Keys.",
      z.object({ items: z.array(z.string()) }),
    );
    console.log(`  Sidebar items: ${sidebar.items.join(", ")}`);
    sidebar.items.some((s) => /environment variables/i.test(s))
      ? pass("env-vars-section", '"Environment Variables" in Settings sidebar')
      : fail(
          "env-vars-section",
          '"Environment Variables"',
          `Items: ${sidebar.items.join(", ")}`,
        );

    await stagehand.act('Click "Environment Variables" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-env-vars-page");

    // Doc: 'click Add new variable'
    const addBtn = await stagehand.observe('Find "Add new variable" button');
    addBtn.length > 0
      ? pass("add-var-btn", '"Add new variable" button')
      : fail("add-var-btn", '"Add new variable"', "Not found");
  },
  import.meta.filename,
);
