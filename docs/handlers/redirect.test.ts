/**
 * Verify docs/handlers/redirect.mdx — Code tab and Redirect handler in dropdown.
 *
 * Run: npx tsx docs/handlers/redirect.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "redirect-handler",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    const projects = await stagehand.extract(
      "List project names and types",
      z.object({
        projects: z.array(z.object({ name: z.string(), type: z.string() })),
      }),
    );
    const apiProject = projects.projects.find((p) =>
      /api.gateway/i.test(p.type),
    );
    if (apiProject) await stagehand.act(`Click on "${apiProject.name}"`);
    else await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    console.log("=== Verify Redirect handler in Route Designer ===");
    await stagehand.act('Click "Code" in the navigation');
    await page.waitForTimeout(2000);
    await stagehand.act('Click "routes.oas.json"');
    await page.waitForTimeout(2000);
    await stagehand.act("Click on the first route in the route list");
    await page.waitForTimeout(1000);
    await snap("01-route-selected");

    // Open handler dropdown using Playwright for reliability
    const handlerSelect = page.locator(
      'select:near(:text("Handler")), [role="combobox"]:near(:text("Handler")), [data-slot="select-trigger"]:near(:text("Handler"))',
    );

    if (
      await handlerSelect
        .first()
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await handlerSelect.first().click();
      await page.waitForTimeout(1000);
      await snap("02-handler-dropdown-open");

      const options = await page
        .locator(
          '[role="option"], option, [role="menuitem"], [data-slot="select-item"]',
        )
        .allTextContents();
      const handlerOptions = options.map((t) => t.trim()).filter(Boolean);
      console.log(`  Handler options: ${handlerOptions.join(", ")}`);

      handlerOptions.some((h) => /redirect/i.test(h))
        ? pass("redirect-handler", '"Redirect" in handler dropdown')
        : fail(
            "redirect-handler",
            '"Redirect"',
            `Options: ${handlerOptions.join(", ")}`,
          );

      await page.keyboard.press("Escape");
    } else {
      // Fallback: use stagehand
      await stagehand.act("Click on the Handler dropdown to open it");
      await page.waitForTimeout(1000);
      await snap("02-handler-dropdown-open");

      const handlers = await stagehand.extract(
        "List ALL handler options in the open dropdown",
        z.object({ handlers: z.array(z.string()) }),
      );
      handlers.handlers.some((h) => /redirect/i.test(h))
        ? pass("redirect-handler", '"Redirect" in dropdown')
        : fail(
            "redirect-handler",
            '"Redirect"',
            `Options: ${handlers.handlers.join(", ")}`,
          );
    }

    await snap("03-verified");
  },
  import.meta.filename,
);
