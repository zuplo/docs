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

      // Doc: 'select "OpenAPI Spec" from the Request Handlers drop-down'
      // Click on a route to see handler options
      await stagehand.act("Click on the first route in the route list");
      await page.waitForTimeout(1000);

      const handlerDropdown = await stagehand.extract(
        "Is there a Request Handler dropdown? What handler options are available?",
        z.object({
          hasDropdown: z.boolean(),
          handlers: z.array(z.string()),
        }),
      );
      console.log(`  Handler dropdown: ${handlerDropdown.hasDropdown}`);
      console.log(`  Handlers: ${handlerDropdown.handlers.join(", ")}`);

      handlerDropdown.handlers.some((h) => /openapi.spec/i.test(h))
        ? pass("openapi-handler", '"OpenAPI Spec" in handler dropdown')
        : fail(
            "openapi-handler",
            '"OpenAPI Spec" handler',
            `Handlers: ${handlerDropdown.handlers.join(", ")}`,
          );
      await snap("03-handler-dropdown");
    }
  },
  import.meta.filename,
);
