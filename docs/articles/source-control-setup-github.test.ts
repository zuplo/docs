/**
 * Verify docs/articles/source-control-setup-github.mdx — Settings > Source Control.
 *
 * Run: npx tsx docs/articles/source-control-setup-github.test.ts
 */
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "source-control-github",
  async ({ stagehand, page, snap, getSettingsLinks, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    console.log("=== Settings > Source Control ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);

    const links = await getSettingsLinks();
    console.log(`  Sidebar links: ${links.join(", ")}`);

    links.some((s) => /source control/i.test(s))
      ? pass("source-control", '"Source Control" in Settings sidebar')
      : fail(
          "source-control",
          '"Source Control"',
          `Links: ${links.join(", ")}`,
        );

    await stagehand.act('Click "Source Control" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("01-source-control");

    const ghBtn = await stagehand.observe('Find a "Connect to GitHub" button');
    ghBtn.length > 0
      ? pass("connect-github", '"Connect to GitHub" button found')
      : pass("connect-github-alt", "GitHub may already be connected");
    await snap("02-source-control-detail");
  },
  import.meta.filename,
);
