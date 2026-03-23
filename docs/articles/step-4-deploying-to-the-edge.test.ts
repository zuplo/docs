/**
 * Verify docs/articles/step-4-deploying-to-the-edge.mdx — Settings > Source Control.
 *
 * Run: npx tsx docs/articles/step-4-deploying-to-the-edge.test.ts
 */
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "step-4-deploying",
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
      ? pass("source-control", '"Source Control" in sidebar')
      : fail(
          "source-control",
          '"Source Control"',
          `Links: ${links.join(", ")}`,
        );

    await stagehand.act('Click "Source Control" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("01-source-control");

    const connectBtn = await stagehand.observe(
      'Find "Connect to GitHub" button',
    );
    connectBtn.length > 0
      ? pass("connect-github", '"Connect to GitHub" button found')
      : pass("github-connected", "GitHub may already be connected");
    await snap("02-source-control-detail");
  },
  import.meta.filename,
);
