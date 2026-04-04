/**
 * Verify docs/ai-gateway/usage-limits.mdx against the real portal.
 *
 * Run: npx tsx docs/ai-gateway/usage-limits.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "usage-limits",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Navigate to AI Gateway project
    const projects = await stagehand.extract(
      "List project names and types",
      z.object({
        projects: z.array(z.object({ name: z.string(), type: z.string() })),
      }),
    );
    const aiProject = projects.projects.find((p) => /ai/i.test(p.type));
    if (aiProject) await stagehand.act(`Click on "${aiProject.name}"`);
    else await stagehand.act("Click on the first project");
    await page.waitForTimeout(3000);

    // === Verify Teams/Apps tabs exist ===
    console.log("=== Verify navigation ===");
    const nav = await stagehand.extract(
      "Extract the project navigation tabs",
      z.object({ tabs: z.array(z.string()) }),
    );
    nav.tabs.some((t) => /teams/i.test(t))
      ? pass("nav-teams", '"Teams" tab exists')
      : fail("nav-teams", '"Teams" tab', `Tabs: ${nav.tabs.join(", ")}`);
    nav.tabs.some((t) => /apps/i.test(t))
      ? pass("nav-apps", '"Apps" tab exists')
      : fail("nav-apps", '"Apps" tab', `Tabs: ${nav.tabs.join(", ")}`);

    // === Check team Usage & Limits ===
    console.log("\n=== Team Usage & Limits ===");
    await stagehand.act('Click "Teams" in the navigation');
    await page.waitForTimeout(2000);

    const teams = await stagehand.extract(
      "List any team names shown",
      z.object({ teams: z.array(z.string()) }),
    );

    if (teams.teams.length > 0) {
      await stagehand.act(`Click on the team "${teams.teams[0]}"`);
      await page.waitForTimeout(2000);

      // Doc: "Select the Usage & Limits tab and configure the Daily Budget"
      const usageLimits = await stagehand.observe(
        'Find a tab or link that says "Usage & Limits"',
      );
      usageLimits.length > 0
        ? pass("team-ul-tab", '"Usage & Limits" tab in team detail')
        : fail("team-ul-tab", '"Usage & Limits" tab', "Not found");

      if (usageLimits.length > 0) {
        await stagehand.act('Click "Usage & Limits"');
        await page.waitForTimeout(1000);
        await snap("01-team-usage-limits");

        const ulFields = await stagehand.extract(
          "What budget/limit fields are shown? Look for Budget Limit, Tokens Limit, Requests Limit, daily/monthly, enforce/warn.",
          z.object({
            fields: z.array(z.string()),
            hasDaily: z.boolean(),
            hasMonthly: z.boolean(),
          }),
        );
        console.log(`  Usage & Limits fields: ${ulFields.fields.join(", ")}`);
        ulFields.hasDaily
          ? pass("daily-budget", "Daily budget configurable")
          : warn(
              "daily-budget",
              "Daily budget",
              `Fields: ${ulFields.fields.join(", ")}`,
            );
      }
    } else {
      warn("teams", "No teams exist", "Cannot verify team usage limits");
    }

    // === Check project-level Usage Limits (Settings) ===
    console.log("\n=== Project-level Usage Limits ===");
    await stagehand.act('Click "Settings" in the navigation');
    await page.waitForTimeout(2000);
    await snap("02-settings-page");

    const settingsSections = await stagehand.extract(
      "List the sidebar sections in Settings",
      z.object({ sections: z.array(z.string()) }),
    );
    console.log(`  Settings sections: ${settingsSections.sections.join(", ")}`);

    settingsSections.sections.some((s) =>
      /usage.*limits|limits.*thresholds/i.test(s),
    )
      ? pass("settings-ul", "Usage Limits section in Settings")
      : warn(
          "settings-ul",
          "Usage Limits in Settings",
          `Sections: ${settingsSections.sections.join(", ")}`,
        );

    // Click into Usage Limits & Thresholds
    const ulLink = await stagehand.observe(
      'Find "Usage Limits" or "Usage Limits & Thresholds" in sidebar',
    );
    if (ulLink.length > 0) {
      await stagehand.act('Click "Usage Limits & Thresholds" in the sidebar');
      await page.waitForTimeout(1000);
      await snap("03-project-usage-limits");
    }
  },
  import.meta.filename,
);
