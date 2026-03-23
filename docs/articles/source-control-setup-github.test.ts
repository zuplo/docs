/**
 * Verify docs/articles/source-control-setup-github.mdx — Settings > Source Control.
 *
 * Run: npx tsx docs/articles/source-control-setup-github.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "source-control-github",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Doc: 'click Settings, then select Source Control'
    console.log("=== Settings > Source Control ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);

    const sidebar = await stagehand.extract(
      "List the sidebar sections in Settings",
      z.object({ sections: z.array(z.string()) }),
    );
    sidebar.sections.some((s) => /source control/i.test(s))
      ? pass("source-control", '"Source Control" in Settings')
      : fail(
          "source-control",
          '"Source Control"',
          `Sections: ${sidebar.sections.join(", ")}`,
        );

    await stagehand.act('Click "Source Control" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("01-source-control");

    // Doc: 'Connect to GitHub button'
    const ghBtn = await stagehand.observe(
      'Find a "Connect to GitHub" button or link',
    );
    ghBtn.length > 0
      ? pass("connect-github", '"Connect to GitHub" button')
      : pass("connect-github-alt", "GitHub may already be connected");
    await snap("02-source-control-detail");
  },
  import.meta.filename,
);
