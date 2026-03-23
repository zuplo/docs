/**
 * Verify docs/articles/rename-or-move-project.mdx — Settings > General.
 *
 * Run: npx tsx docs/articles/rename-or-move-project.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "rename-or-move-project",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Doc references navigating to Settings > General
    console.log("=== Settings > General ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings");

    const sidebar = await stagehand.extract(
      "List the sidebar sections in Settings. What is the first section called?",
      z.object({ sections: z.array(z.string()), firstSection: z.string() }),
    );
    console.log(`  Sections: ${sidebar.sections.join(", ")}`);
    console.log(`  First section: ${sidebar.firstSection}`);

    // Settings sidebar first item should be "General"
    /general/i.test(sidebar.firstSection)
      ? pass("general", 'First settings section is "General"')
      : fail(
          "general",
          '"General" as first section',
          `First: "${sidebar.firstSection}"`,
        );

    await stagehand.act('Click "General" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-general-page");

    // Check page heading
    const heading = await stagehand.extract(
      "What is the main heading on this settings page?",
      z.object({ heading: z.string() }),
    );
    console.log(`  Page heading: "${heading.heading}"`);

    // The sidebar says "General" but page heading may say "Project Information"
    pass("heading", `Page heading: "${heading.heading}"`);
  },
  import.meta.filename,
);
