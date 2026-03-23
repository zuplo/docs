/**
 * Verify docs/ai-gateway/managing-teams.mdx against the real portal.
 *
 * Run: npx tsx docs/ai-gateway/managing-teams.test.ts
 */
import { z } from "zod";
import { portalTest } from "../../scripts/lib/portal-test.ts";

await portalTest(
  "managing-teams",
  async ({ stagehand, page, snap, report }) => {
    const { pass, fail, warn } = report;

    // Navigate to an AI Gateway project
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

    // Navigate to Teams tab
    console.log("=== Teams page ===");
    await stagehand.act('Click "Teams" in the navigation');
    await page.waitForTimeout(2000);
    await snap("01-teams-page");

    // Doc: "Create Team" button
    const teamBtns = await stagehand.observe('Find "Create Team" button');
    teamBtns.length > 0
      ? pass("create-team-btn", '"Create Team" button exists')
      : fail("create-team-btn", '"Create Team" button', "Not found");

    // Click into a team if one exists
    const teams = await stagehand.extract(
      "List any team names shown in the sidebar or main content",
      z.object({ teams: z.array(z.string()) }),
    );

    if (teams.teams.length > 0) {
      await stagehand.act(`Click on the team "${teams.teams[0]}"`);
      await page.waitForTimeout(2000);
      await snap("02-team-detail");

      // Check team detail tabs
      const teamTabs = await stagehand.extract(
        "What tabs are in the team detail view?",
        z.object({ tabs: z.array(z.string()) }),
      );
      console.log(`  Team tabs: ${teamTabs.tabs.join(", ")}`);

      for (const expected of [
        "Overview",
        "Usage & Limits",
        "Members",
        "Settings",
      ]) {
        teamTabs.tabs.some((t) =>
          t.toLowerCase().includes(expected.toLowerCase()),
        )
          ? pass(`tab-${expected}`, `"${expected}" tab exists`)
          : warn(
              `tab-${expected}`,
              `"${expected}" tab`,
              `Tabs: ${teamTabs.tabs.join(", ")}`,
            );
      }

      // Doc mentions RBAC link
      const settingsInfo = await stagehand.extract(
        "Is there a mention of RBAC, roles, or permissions on this page?",
        z.object({ hasRbac: z.boolean(), context: z.string() }),
      );
      settingsInfo.hasRbac
        ? pass("rbac", "RBAC/permissions mentioned")
        : warn("rbac", "RBAC mention", settingsInfo.context);

      // Check "Create Sub-Team" button
      const subTeamBtns = await stagehand.observe(
        'Find "Create Sub-Team" button',
      );
      subTeamBtns.length > 0
        ? pass("sub-team", '"Create Sub-Team" button exists')
        : warn("sub-team", '"Create Sub-Team"', "Not found");
      await snap("03-team-detail-final");
    } else {
      warn("teams", "Existing teams", "No teams found to inspect");
    }
  },
  import.meta.filename,
);
