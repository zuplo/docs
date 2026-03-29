/**
 * Verify docs/articles/step-1-setup-basic-gateway.mdx — project creation + env vars.
 *
 * Run: npx tsx docs/articles/step-1-setup-basic-gateway.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "step-1-setup-basic-gateway",
  async ({ stagehand, page, snap, getSettingsLinks, report }) => {
    const { pass, fail } = report;

    console.log("=== Project creation ===");
    await snap("01-home");

    const newProjBtns = await stagehand.observe('Find "New Project" button');
    newProjBtns.length > 0
      ? pass("new-project", '"New Project" button exists')
      : fail("new-project", '"New Project" button', "Not found");

    console.log("\n=== Settings > Environment Variables ===");
    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    const nav = await stagehand.extract(
      "Extract the project navigation tabs",
      z.object({ tabs: z.array(z.string()) }),
    );
    nav.tabs.some((t) => /settings/i.test(t))
      ? pass("settings-nav", '"Settings" in project nav')
      : fail("settings-nav", '"Settings"', `Tabs: ${nav.tabs.join(", ")}`);

    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("02-settings");

    const links = await getSettingsLinks();
    console.log(`  Sidebar links: ${links.join(", ")}`);

    links.some((s) => /environment variables/i.test(s))
      ? pass("env-vars", '"Environment Variables" in sidebar')
      : fail(
          "env-vars",
          '"Environment Variables"',
          `Links: ${links.join(", ")}`,
        );
  },
  import.meta.filename,
);
