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

    // Doc: "navigating to the Code tab then click routes.oas.json"
    console.log("=== Verify Redirect handler in Route Designer ===");
    await stagehand.act('Click "Code" in the navigation');
    await page.waitForTimeout(2000);
    await stagehand.act('Click "routes.oas.json"');
    await page.waitForTimeout(2000);
    await stagehand.act("Click on the first route in the route list");
    await page.waitForTimeout(1000);
    await snap("01-route-selected");

    // Doc: 'select "Redirect" from the Request Handlers drop-down'
    const handlers = await stagehand.extract(
      "What handler options are available in the Request Handler dropdown?",
      z.object({ handlers: z.array(z.string()) }),
    );
    handlers.handlers.some((h) => /redirect/i.test(h))
      ? pass("redirect-handler", '"Redirect" in handler dropdown')
      : fail(
          "redirect-handler",
          '"Redirect" handler',
          `Handlers: ${handlers.handlers.join(", ")}`,
        );
    await snap("02-handlers");
  },
  import.meta.filename,
);
