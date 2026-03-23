/**
 * Verify docs/ai-gateway/getting-started.mdx against the real portal.
 *
 * Run: npx tsx docs/ai-gateway/getting-started.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "getting-started",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // === Step 1: Create AI Gateway Project ===
    console.log("=== Step 1: Create AI Gateway Project ===");
    await snap("01-home");

    // Doc: "Navigate to Projects" → "Click New Project"
    const nav = await stagehand.extract(
      "Extract the top-level navigation tab labels in the header",
      z.object({ tabs: z.array(z.string()) }),
    );
    nav.tabs.some((t) => /projects/i.test(t))
      ? pass("1.2", 'Navigate to "Projects"')
      : fail("1.2", 'Navigate to "Projects"', `Tabs: ${nav.tabs.join(", ")}`);

    await stagehand.act('Click the "New Project" button');
    await page.waitForTimeout(2000);
    await page.keyboard.press("Escape"); // dismiss notification overlay
    await page.waitForTimeout(300);
    if (
      !(await page
        .locator('[role="dialog"]')
        .isVisible()
        .catch(() => false))
    ) {
      await stagehand.act('Click "New Project"');
      await page.waitForTimeout(2000);
    }
    await snap("02-new-project-dialog");

    // Doc: "Click AI or MCP Gateway at the bottom of the dialog"
    // Use observe to find the link — it's more reliable for clickable elements
    const aiMcpLinks = await stagehand.observe(
      'Find a link or button that mentions "AI", "MCP", or "Gateway" at the bottom of the New Project dialog. It might say "AI or MCP Gateway" or similar.',
    );
    console.log(
      `  AI/MCP links found: ${aiMcpLinks.map((l) => l.description).join(", ") || "none"}`,
    );

    // Also extract the full dialog content for context
    const dialog = await stagehand.extract(
      "List the template options and any links at the bottom of the New Project dialog",
      z.object({
        templates: z.array(z.string()),
        bottomLinks: z.array(z.string()),
      }),
    );
    console.log(`  Templates: ${dialog.templates.join(", ")}`);
    console.log(`  Bottom links: ${dialog.bottomLinks.join(", ")}`);

    const allLinks = [
      ...aiMcpLinks.map((l) => l.description),
      ...dialog.bottomLinks,
    ];
    allLinks.some((l) => /ai|mcp/i.test(l))
      ? pass("1.4", '"AI or MCP Gateway" link found')
      : fail(
          "1.4",
          '"AI or MCP Gateway" link',
          `Links found: ${allLinks.join(", ")}`,
        );

    await stagehand.act(
      'Click "AI or MCP Gateway" at the bottom of the dialog',
    );
    await page.waitForTimeout(5000);
    await snap("03-ai-gateway-flow");

    // Doc: "Give your project a name" → "Click Create Project"
    const testName = `verify-${Date.now().toString(36)}`;
    await stagehand.act(`Type "${testName}" into the project name field`);
    pass("1.5", "Name the project");
    await stagehand.act('Click "Create Project"');
    await page.waitForTimeout(8000);
    await snap("04-project-created");

    // Verify nav tabs: Project | Apps | Teams | Settings
    const projectNav = await stagehand.extract(
      "Extract the project navigation tabs in the header",
      z.object({ tabs: z.array(z.string()) }),
    );
    console.log(`  AI Gateway tabs: ${projectNav.tabs.join(", ")}`);
    projectNav.tabs.some((t) => /^apps$/i.test(t)) &&
    projectNav.tabs.some((t) => /^teams$/i.test(t))
      ? pass("nav", "Has Apps and Teams tabs")
      : fail(
          "nav",
          "Apps and Teams tabs",
          `Tabs: ${projectNav.tabs.join(", ")}`,
        );
    await snap("05-nav-tabs");

    // === Step 2: Configure Providers ===
    console.log("\n=== Step 2: Configure Providers ===");
    let providerBtns = await stagehand.observe('Find "Add Provider" button');
    if (providerBtns.length === 0) {
      await stagehand.act('Click "Settings" in the navigation');
      await page.waitForTimeout(2000);
      await stagehand.act('Click "AI Providers"');
      await page.waitForTimeout(2000);
      providerBtns = await stagehand.observe('Find "Add Provider" button');
    }
    providerBtns.length > 0
      ? pass("2.1", '"Add Provider" button found')
      : fail("2.1", '"Add Provider" button', "Not found");

    if (providerBtns.length > 0) {
      await stagehand.act('Click "Add Provider"');
      await page.waitForTimeout(2000);
      await snap("06-add-provider");

      const prov = await stagehand.extract(
        "What provider options are shown? What form fields exist?",
        z.object({
          providers: z.array(z.string()),
          fields: z.array(z.string()),
        }),
      );
      prov.providers.some((p) => /openai/i.test(p))
        ? pass("2.2", "OpenAI provider option")
        : warn(
            "2.2",
            "OpenAI option",
            `Providers: ${prov.providers.join(", ")}`,
          );

      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    // === Step 3: Create a Team ===
    console.log("\n=== Step 3: Create a Team ===");
    await stagehand.act('Click "Teams" in the navigation');
    await page.waitForTimeout(2000);
    await snap("07-teams-page");

    await stagehand.act('Click "Create Team"');
    await page.waitForTimeout(2000);
    await snap("08-create-team-dialog");

    const teamForm = await stagehand.extract(
      "Describe the Create Team form. Fields? Icon picker? Submit button text?",
      z.object({
        fields: z.array(z.string()),
        hasIconPicker: z.boolean(),
        submitButton: z.string(),
      }),
    );
    teamForm.hasIconPicker
      ? pass("3.3", "Icon picker present")
      : warn("3.3", "Icon picker", "Not detected");
    /create team/i.test(teamForm.submitButton)
      ? pass("3.5", `Submit button: "${teamForm.submitButton}"`)
      : warn(
          "3.5",
          'Click "Create Team"',
          `Button: "${teamForm.submitButton}"`,
        );

    await stagehand.act('Type "Docs Verify Team" into the team name field');
    await stagehand.act("Click the submit button to create the team");
    await page.waitForTimeout(3000);
    await snap("09-team-created");

    // Check team detail tabs
    const teamTabs = await stagehand.extract(
      "What tabs are in the team detail view? (Overview, Usage & Limits, etc.)",
      z.object({ tabs: z.array(z.string()) }),
    );
    teamTabs.tabs.some((t) => /usage.*limits/i.test(t))
      ? pass("3.limits", "Usage & Limits tab exists")
      : fail(
          "3.limits",
          "Usage & Limits tab",
          `Tabs: ${teamTabs.tabs.join(", ")}`,
        );
    await snap("10-team-detail");

    // === Step 4: Create an App ===
    console.log("\n=== Step 4: Create an App ===");
    await stagehand.act('Click "Apps" in the navigation');
    await page.waitForTimeout(2000);
    await stagehand.act('Click "Create App"');
    await page.waitForTimeout(2000);
    await snap("11-create-app");

    const appForm = await stagehand.extract(
      "List ALL form field labels. Look for Name, Team, Provider, Completions, Embeddings, Budget, Semantic Caching.",
      z.object({
        fields: z.array(z.string()),
        hasSemanticCaching: z.boolean(),
        hasBudgetFields: z.boolean(),
      }),
    );
    console.log(`  App fields: ${appForm.fields.join(", ")}`);

    for (const name of ["Name", "Team", "Provider"]) {
      appForm.fields.some((f) => new RegExp(name, "i").test(f))
        ? pass(`4.${name}`, `"${name}" field`)
        : fail(
            `4.${name}`,
            `"${name}" field`,
            `Not in: ${appForm.fields.join(", ")}`,
          );
    }
    // Doc says Completions/Embeddings (not "Model")
    appForm.fields.some((f) => /completions/i.test(f))
      ? pass("4.completions", "Completions model selector")
      : warn(
          "4.completions",
          "Completions field",
          `Fields: ${appForm.fields.join(", ")}`,
        );
    appForm.hasBudgetFields
      ? pass("4.budgets", "Budget fields present")
      : warn("4.budgets", "Budget fields", "Not detected");
    appForm.hasSemanticCaching
      ? pass("4.caching", "Semantic Caching toggle")
      : fail("4.caching", "Semantic Caching", "Not found");
    await snap("12-app-form");
  },
  import.meta.filename,
);
