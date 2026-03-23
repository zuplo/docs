/**
 * Verify docs/articles/step-1-setup-basic-gateway.mdx — project creation + env vars.
 *
 * Run: npx tsx docs/articles/step-1-setup-basic-gateway.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "step-1-setup-basic-gateway",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Doc: "Sign in to portal.zuplo.com and create a new empty project"
    console.log("=== Project creation ===");
    await snap("01-home");

    const newProjBtns = await stagehand.observe('Find "New Project" button');
    newProjBtns.length > 0
      ? pass("new-project", '"New Project" button exists')
      : fail("new-project", '"New Project" button', "Not found");

    // Doc: "Navigate to your project's Settings via the navigation bar.
    //       Next, click Environment Variables under Project Settings."
    console.log("\n=== Settings > Environment Variables ===");
    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    const nav = await stagehand.extract(
      "Extract the project navigation tabs",
      z.object({ tabs: z.array(z.string()) }),
    );

    // Doc says "Settings" (not "Settings tab")
    nav.tabs.some((t) => /settings/i.test(t))
      ? pass("settings-nav", '"Settings" in project nav')
      : fail("settings-nav", '"Settings"', `Tabs: ${nav.tabs.join(", ")}`);

    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("02-settings");

    const sidebar = await stagehand.extract(
      "List sidebar sections",
      z.object({ sections: z.array(z.string()) }),
    );
    sidebar.sections.some((s) => /environment variables/i.test(s))
      ? pass("env-vars", '"Environment Variables" in sidebar')
      : fail(
          "env-vars",
          '"Environment Variables"',
          `Sections: ${sidebar.sections.join(", ")}`,
        );
  },
  import.meta.filename,
);
