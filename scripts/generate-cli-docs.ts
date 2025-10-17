import path from "node:path";
import { readFile, writeFile, access } from "node:fs/promises";
import { format } from "prettier";
import { glob } from "glob";
import matter from "gray-matter";

interface CliOption {
  name: string;
  type: string;
  default?: string | number | boolean;
  required: boolean;
  deprecated: boolean;
  hidden: boolean;
}

interface CliCommand {
  command: string;
  description: string;
  aliases?: string[];
  options: CliOption[];
  examples?: [string, string][];
  subcommands?: CliCommand[];
  deprecated?: boolean;
  hidden?: boolean;
}

interface CliJson {
  commands: CliCommand[];
  generatedAt: string;
}

const projectDir = path.join(import.meta.dirname, "..");
const cliJsonPath = path.join(projectDir, "cli.json");
const docsDir = path.join(projectDir, "docs/cli");
const sidebarPath = path.join(projectDir, "sidebar.cli.json");

// Read the cli.json file
const cliJson: CliJson = JSON.parse(
  await readFile(cliJsonPath, "utf-8"),
) as CliJson;

console.log(
  `📚 Generating CLI documentation for ${cliJson.commands.length} commands...`,
);

// Helper to format JSX props
function formatJsxProp(key: string, value: unknown): string {
  if (typeof value === "string") {
    return `${key}="${value}"`;
  }
  return `${key}={${JSON.stringify(value, null, 2)}}`;
}

// Read all partial files
const partialFiles = await glob("docs/cli/*.partial.mdx", { cwd: projectDir });
const partialContent: Record<string, string> = {};

for (const partialFile of partialFiles) {
  const fullContent = await readFile(
    path.join(projectDir, partialFile),
    "utf-8",
  );
  const commandName = path.basename(partialFile, ".partial.mdx");

  // Parse frontmatter and get content
  const parsed = matter(fullContent);
  const content = parsed.content.trim();

  if (content) {
    partialContent[commandName] = content;
  }
}

// Track generated command files for sidebar
const generatedCommands: string[] = [];

// Helper to convert command name to file key (replace spaces with hyphens)
function commandToFileKey(commandName: string): string {
  return commandName.replace(/\s+/g, "-");
}

// Helper to generate title from command name
function generateTitle(commandName: string): string {
  return commandName
    .split(/[\s-]+/)
    .map((word) => {
      // Special case for OpenAPI
      if (word.toLowerCase() === "openapi") {
        return "OpenAPI";
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Helper to create a single command page
async function createCommandPage(
  command: CliCommand,
  fileKey: string,
  sidebarLabel: string,
) {
  const filePath = path.join(docsDir, `${fileKey}.mdx`);

  // Check if file exists
  try {
    await access(filePath);
    console.log(`  ✏️  Updating ${fileKey}.mdx`);
  } catch {
    console.log(`  ✨ Creating ${fileKey}.mdx`);
  }

  const title = generateTitle(command.command);

  // Build component props
  const props: string[] = [
    formatJsxProp("command", command.command),
    formatJsxProp("description", command.description),
  ];

  if (command.aliases && command.aliases.length > 0) {
    props.push(formatJsxProp("aliases", command.aliases));
  }

  if (command.options && command.options.length > 0) {
    props.push(formatJsxProp("options", command.options));
  }

  // Get custom content from partial files
  const partialContentMd = partialContent[fileKey] || "";

  // Add global options section
  const globalOptions = ["help", "api-key"];
  const globalOptionsSection = `
## Global Options

The following global options are available for all commands:

${globalOptions.map((opt) => `- [\`--${opt}\`](./global-options.mdx#${opt})`).join("\n")}
`;

  // Build the MDX content
  const mdxContent = `---
title: "Zuplo CLI: ${title}"
sidebar_label: ${sidebarLabel}
---

<CliCommand
  ${props.join("\n  ")}
>
${partialContentMd ? `\n${partialContentMd}\n` : ""}
</CliCommand>

${globalOptionsSection}
`;

  // Format with prettier
  const formatted = await format(mdxContent, { parser: "mdx" });

  // Write the file
  await writeFile(filePath, formatted);

  // Track this command for the sidebar
  generatedCommands.push(`cli/${fileKey}`);
}

// Process each top-level command
for (const command of cliJson.commands) {
  // Skip hidden or deprecated commands
  if (command.hidden || command.deprecated) {
    continue;
  }

  const hasSubcommands = command.subcommands && command.subcommands.length > 0;

  if (hasSubcommands) {
    // For commands with subcommands, create a page for each subcommand only
    // Filter out hidden and deprecated subcommands
    const visibleSubcommands = command.subcommands!.filter(
      (sub) => !sub.hidden && !sub.deprecated,
    );

    for (const subcommand of visibleSubcommands) {
      const fileKey = commandToFileKey(subcommand.command);
      const sidebarLabel = subcommand.command; // Use full command with space
      await createCommandPage(subcommand, fileKey, sidebarLabel);
    }
  } else {
    // For commands without subcommands, create a single page
    const fileKey = command.command;
    const sidebarLabel = command.command;
    await createCommandPage(command, fileKey, sidebarLabel);
  }
}

// Update sidebar.cli.json with alphabetically sorted commands
const sortedCommands = generatedCommands.sort();
const sidebarContent = JSON.stringify(sortedCommands, null, 2) + "\n";
await writeFile(sidebarPath, sidebarContent);
console.log(
  "\n📋 Updated sidebar.cli.json with",
  sortedCommands.length,
  "commands",
);

console.log("\n✅ CLI documentation generation complete!");
console.log(
  "\n💡 Tip: Add custom content in .partial.mdx files (e.g., deploy.partial.mdx for the deploy command).",
);
