/**
 * Verify docs/articles/rename-or-move-project.mdx — Settings > General.
 *
 * Run: npx tsx docs/articles/rename-or-move-project.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "rename-or-move-project",
  async ({ stagehand, page, snap, getSettingsLinks, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    console.log("=== Settings > General ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings");

    const links = await getSettingsLinks();
    console.log(`  Sidebar links: ${links.join(", ")}`);

    links.some((l) => /^general$/i.test(l))
      ? pass("general", '"General" found in Settings sidebar')
      : fail("general", '"General" in sidebar', `Links: ${links.join(", ")}`);

    await stagehand.act('Click "General" in the Settings sidebar');
    await page.waitForTimeout(2000);
    await snap("02-general-page");

    const heading = await stagehand.extract(
      "What is the main content heading on this page?",
      z.object({ heading: z.string() }),
    );
    console.log(`  Page heading: "${heading.heading}"`);
    pass("heading", `Page heading: "${heading.heading}"`);
  },
  import.meta.filename,
);
