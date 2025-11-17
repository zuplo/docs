import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { collectGlob } from "./utils.js";

const projectDir = path.join(import.meta.dirname, "..");
const checkMode = process.argv.includes("--check");

async function main() {
  // Find all guide files in docs/guides
  const guideFiles = await collectGlob("docs/guides/**/*.{md,mdx}", {
    cwd: projectDir,
  });

  // Convert to the format used in sidebar (without docs/ prefix and without extension)
  const guidePaths = guideFiles
    .map((file) => file.replace(/^docs\//, "").replace(/\.mdx?$/, ""))
    .sort();

  console.log(`Found ${guidePaths.length} guide(s) in docs/guides/\n`);

  // Read the current sidebar.guides.ts file
  const sidebarPath = path.join(projectDir, "sidebar.guides.ts");
  const sidebarContent = await readFile(sidebarPath, "utf-8");

  // Extract the guides array from the file
  const guidesArrayMatch = sidebarContent.match(
    /export const guides: Navigation = \[([\s\S]*?)\];/,
  );

  if (!guidesArrayMatch) {
    throw new Error("Could not find guides array in sidebar.guides.ts");
  }

  // Parse the current guides list
  const currentGuidesText = guidesArrayMatch[1];
  const currentGuides = currentGuidesText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith('"'))
    .map((line) => line.replace(/^"(.*)",?$/, "$1"));

  // Find guides that are in docs/guides but not in sidebar
  const missingInSidebar = guidePaths.filter(
    (guide) => !currentGuides.includes(guide),
  );

  // Find guides that are in sidebar but don't exist in docs/guides
  const guidesInSidebar = currentGuides.filter((guide) =>
    guide.startsWith("guides/"),
  );
  const missingFiles = guidesInSidebar.filter(
    (guide) => !guidePaths.includes(guide),
  );

  if (checkMode) {
    // Check mode: verify and report issues
    let hasErrors = false;

    if (missingInSidebar.length > 0) {
      console.error(
        "❌ The following guides exist but are not in sidebar.guides.ts:",
      );
      missingInSidebar.forEach((guide) => console.error(`   - ${guide}`));
      hasErrors = true;
    }

    if (missingFiles.length > 0) {
      console.error(
        "\n❌ The following guides are in sidebar but don't exist:",
      );
      missingFiles.forEach((guide) => console.error(`   - ${guide}`));
      hasErrors = true;
    }

    if (hasErrors) {
      console.error(
        "\n💡 Run 'npm run guides:sync' to automatically sync the guides.",
      );
      process.exit(1);
    }

    console.log("✅ All guides in docs/guides/ are properly listed in sidebar");
    return;
  }

  // Normal mode: add missing guides
  if (missingInSidebar.length === 0) {
    console.log("✅ All guides are already in sidebar.guides.ts");
    return;
  }

  console.log(`Adding ${missingInSidebar.length} guide(s) to sidebar:\n`);
  missingInSidebar.forEach((guide) => console.log(`   + ${guide}`));

  // Create the updated guides array
  const allGuides = [...currentGuides, ...missingInSidebar].sort();

  // Generate the new sidebar content
  const guidesArrayContent = allGuides
    .map((guide) => `  "${guide}",`)
    .join("\n");

  const newSidebarContent = sidebarContent.replace(
    /export const guides: Navigation = \[([\s\S]*?)\];/,
    `export const guides: Navigation = [\n${guidesArrayContent}\n];`,
  );

  // Format with prettier
  const formatted = await format(newSidebarContent, {
    parser: "typescript",
  });

  // Write back to file
  await writeFile(sidebarPath, formatted);

  console.log("\n✅ Updated sidebar.guides.ts");
}

main().catch(console.error);
