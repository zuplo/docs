/**
 * Verify docs/articles/environment-variables.mdx — Settings > Environment Variables.
 *
 * Run: npx tsx docs/articles/environment-variables.test.ts
 */
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "environment-variables",
  async ({ stagehand, page, snap, getSettingsLinks, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    console.log("=== Settings > Environment Variables ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings");

    const links = await getSettingsLinks();
    console.log(`  Sidebar links: ${links.join(", ")}`);

    links.some((s) => /environment variables/i.test(s))
      ? pass("env-vars-section", '"Environment Variables" in Settings sidebar')
      : fail(
          "env-vars-section",
          '"Environment Variables"',
          `Links: ${links.join(", ")}`,
        );

    await stagehand.act('Click "Environment Variables" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-env-vars-page");

    const addBtn = await stagehand.observe('Find "Add new variable" button');
    addBtn.length > 0
      ? pass("add-var-btn", '"Add new variable" button')
      : fail("add-var-btn", '"Add new variable"', "Not found");
  },
  import.meta.filename,
);
