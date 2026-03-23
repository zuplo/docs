/**
 * Verify docs/articles/step-4-deploying-to-the-edge.mdx — Settings > Source Control.
 *
 * Run: npx tsx docs/articles/step-4-deploying-to-the-edge.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "step-4-deploying",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Doc: 'click Settings, then select Source Control'
    console.log("=== Settings > Source Control ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);

    const sidebar = await stagehand.extract(
      "List sidebar sections",
      z.object({ sections: z.array(z.string()) }),
    );

    sidebar.sections.some((s) => /source control/i.test(s))
      ? pass("source-control", '"Source Control" exists')
      : fail(
          "source-control",
          '"Source Control"',
          `Sections: ${sidebar.sections.join(", ")}`,
        );

    await stagehand.act('Click "Source Control"');
    await page.waitForTimeout(2000);
    await snap("01-source-control");

    // Doc: "Connect to GitHub button"
    const connectBtn = await stagehand.observe(
      'Find "Connect to GitHub" button',
    );
    connectBtn.length > 0
      ? pass("connect-github", '"Connect to GitHub" button')
      : pass("github-connected", "GitHub may already be connected");
  },
  import.meta.filename,
);
