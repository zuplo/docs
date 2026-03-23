/**
 * Verify docs/handlers/openapi.mdx — "Code tab" and Route Designer references.
 *
 * Run: npx tsx docs/handlers/openapi.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "openapi-handler",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail } = report;

    // Navigate to an API Gateway project
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

    // Doc: "navigating to the Code tab then click routes.oas.json"
    console.log("=== Verify Code tab and Route Designer ===");
    const nav = await stagehand.extract(
      "Extract the project navigation tabs in the header",
      z.object({ tabs: z.array(z.string()) }),
    );
    console.log(`  Nav tabs: ${nav.tabs.join(", ")}`);

    nav.tabs.some((t) => /^code$/i.test(t))
      ? pass("code-tab", '"Code" tab exists in project nav')
      : fail("code-tab", '"Code" tab', `Tabs: ${nav.tabs.join(", ")}`);

    await stagehand.act('Click "Code" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-code-tab");

    // Check for routes.oas.json in the file tree
    const filesVisible = await stagehand.observe(
      'Find "routes.oas.json" in the file tree or sidebar',
    );
    filesVisible.length > 0
      ? pass("routes-file", "routes.oas.json visible in Code tab")
      : fail("routes-file", "routes.oas.json", "Not found in file tree");

    if (filesVisible.length > 0) {
      await stagehand.act('Click "routes.oas.json"');
      await page.waitForTimeout(2000);
      await snap("02-route-designer");

      // Click on a route to see handler options
      await stagehand.act("Click on the first route in the route list");
      await page.waitForTimeout(1000);
      await snap("03-route-selected");

      // The handler is shown as a dropdown labeled "Handler" with a value
      // like "URL Rewrite". We need to click the dropdown to open it.
      // Use Playwright to find and click the actual select/dropdown element
      // since Stagehand may not reliably open custom dropdowns.
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
        await snap("04-handler-dropdown-open");

        // Extract all visible options
        const options = await page
          .locator(
            '[role="option"], option, [role="menuitem"], [data-slot="select-item"]',
          )
          .allTextContents();
        const handlerOptions = options.map((t) => t.trim()).filter(Boolean);
        console.log(
          `  Handler options (Playwright): ${handlerOptions.join(", ")}`,
        );

        if (handlerOptions.length === 0) {
          // Fallback: try Stagehand extract on the open dropdown
          const extracted = await stagehand.extract(
            "List ALL options visible in the currently open dropdown menu for the Request Handler",
            z.object({ handlers: z.array(z.string()) }),
          );
          console.log(
            `  Handler options (Stagehand): ${extracted.handlers.join(", ")}`,
          );
          handlerOptions.push(...extracted.handlers);
        }

        for (const handler of [
          "OpenAPI Spec",
          "URL Forward",
          "URL Rewrite",
          "Redirect",
          "AWS Lambda",
        ]) {
          const found = handlerOptions.some((h) =>
            new RegExp(handler.replace(/\s+/g, "."), "i").test(h),
          );
          found
            ? pass(`handler-${handler}`, `"${handler}" in dropdown`)
            : fail(
                `handler-${handler}`,
                `"${handler}"`,
                `Not in: ${handlerOptions.join(", ")}`,
              );
        }

        // Close dropdown
        await page.keyboard.press("Escape");
      } else {
        // Try Stagehand as fallback
        await stagehand.act(
          'Click on the Handler dropdown that currently shows "URL Rewrite" or "URL Forward" to open the list of handler options',
        );
        await page.waitForTimeout(1000);
        await snap("04-handler-dropdown-open");

        const handlerOptions = await stagehand.extract(
          "List ALL handler options visible in the open dropdown",
          z.object({ handlers: z.array(z.string()) }),
        );
        console.log(`  Handlers: ${handlerOptions.handlers.join(", ")}`);

        handlerOptions.handlers.some((h) => /openapi|open.api/i.test(h))
          ? pass("openapi-handler", '"OpenAPI Spec" in handler dropdown')
          : fail(
              "openapi-handler",
              '"OpenAPI Spec"',
              `Handlers: ${handlerOptions.handlers.join(", ")}`,
            );
      }

      await snap("05-handlers-verified");
    }
  },
  import.meta.filename,
);
