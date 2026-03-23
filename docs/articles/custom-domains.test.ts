/**
 * Verify docs/articles/custom-domains.mdx — Settings > Custom Domains.
 *
 * Run: npx tsx docs/articles/custom-domains.test.ts
 */
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "custom-domains",
  async ({ stagehand, page, snap, getSettingsLinks, report }) => {
    const { pass, fail, warn } = report;

    await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    console.log("=== Settings > Custom Domains ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-settings-page");

    const links = await getSettingsLinks();
    console.log(`  Sidebar links: ${links.join(", ")}`);

    links.some((s) => /custom domains/i.test(s))
      ? pass("custom-domains", '"Custom Domains" section (plural)')
      : links.some((s) => /custom domain$/i.test(s))
        ? fail(
            "custom-domains",
            '"Custom Domains" (plural)',
            "Found singular 'Custom Domain'",
          )
        : fail(
            "custom-domains",
            '"Custom Domains"',
            `Links: ${links.join(", ")}`,
          );

    await stagehand.act('Click "Custom Domains" in the sidebar');
    await page.waitForTimeout(2000);
    await snap("02-custom-domains-page");

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
