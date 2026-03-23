/**
 * Verify docs/articles/custom-domains.mdx — Settings > Custom Domains UI.
 *
 * Run: npx tsx docs/articles/custom-domains.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "custom-domains",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Navigate to a project
    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // Doc: 'click Settings, then select Custom Domains'
    console.log("=== Settings > Custom Domains ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings-page");

    const sidebar = await stagehand.extract(
      "List the sidebar sections/links in Settings",
      z.object({ sections: z.array(z.string()) }),
    );
    console.log(`  Settings sections: ${sidebar.sections.join(", ")}`);

    // Doc: "Custom Domains" (plural, not "Custom Domain")
    sidebar.sections.some((s) => /custom domains/i.test(s))
      ? pass("custom-domains", '"Custom Domains" section (plural)')
      : sidebar.sections.some((s) => /custom domain/i.test(s))
        ? fail(
            "custom-domains",
            '"Custom Domains" (plural)',
            "Found singular 'Custom Domain'",
          )
        : fail(
            "custom-domains",
            '"Custom Domains"',
            `Sections: ${sidebar.sections.join(", ")}`,
          );

    // Click into Custom Domains
    await stagehand.act('Click "Custom Domains" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-custom-domains-page");

    // Doc: "click the Add New Custom Domain button"
    const addBtn = await stagehand.observe(
      'Find "Add New Custom Domain" button',
    );
    addBtn.length > 0
      ? pass("add-domain-btn", '"Add New Custom Domain" button')
      : warn(
          "add-domain-btn",
          '"Add New Custom Domain"',
          "Not found (may require paid plan)",
        );
  },
  import.meta.filename,
);
