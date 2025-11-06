import path from "node:path";
import { readFile, writeFile, access } from "node:fs/promises";
import { format } from "prettier";
import matter from "gray-matter";
import { collectGlob } from "./utils.js";

interface CliOption {
  name: string;
  type: string;
  default?: string | number | boolean;
  required: boolean;
  deprecated: boolean | string;
  hidden: boolean;
  description?: string;
  alias?: string[];
  normalize?: boolean;
  choices?: string[];
  envVar?: string;
  conflicts?: string[];
}

interface CliPositional {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  normalize?: boolean;
}

interface CliCommand {
  command: string;
  description: string;
  aliases?: string[];
  options: CliOption[];
  examples?: [string, string][];
  subcommands?: CliCommand[];
  deprecated?: boolean | string;
  hidden?: boolean;
  positionals?: CliPositional[];
  epilogue?: string;
  usage?: string;
}

// Helper to flatten all commands/subcommands recursively
function flattenCommands(
  command: CliCommand,
  results: CliCommand[] = [],
): CliCommand[] {
  // Skip hidden or deprecated commands
  if (command.hidden || command.deprecated) {
    return results;
  }

  const hasSubcommands = command.subcommands && command.subcommands.length > 0;

  if (hasSubcommands) {
    // For commands with subcommands, recursively process each subcommand
    for (const subcommand of command.subcommands!) {
      flattenCommands(subcommand, results);
    }
  } else {
    // Leaf command - add to results
    results.push(command);
  }

  return results;
}

interface CliJson {
  commands: CliCommand[];
  generatedAt: string;
}

const projectDir = path.join(import.meta.dirname, "..");
const cliJsonPath = path.join(projectDir, "cli.json");
const docsDir = path.join(projectDir, "docs/cli");
const sidebarPath = path.join(projectDir, "sidebar.cli.json");

// Download cli.json from CDN
console.log("📥 Downloading cli.json from CDN...");
const cliJsonUrl = `https://cdn.zuplo.com/cli/cli.json?t=${Date.now()}`;
const response = await fetch(cliJsonUrl);

if (!response.ok) {
  throw new Error(
    `Failed to download cli.json: ${response.status} ${response.statusText}`,
  );
}

const cliJsonData = await response.text();
await writeFile(cliJsonPath, cliJsonData);
console.log("✅ Downloaded cli.json successfully\n");

// Read the cli.json file
const cliJson: CliJson = JSON.parse(cliJsonData) as CliJson;

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

// Helper to wrap long CLI commands for better readability
function wrapCliCommand(command: string, maxLength = 80): string {
  // If command is short enough, return as-is
  if (command.length <= maxLength) {
    return command;
  }

  // Split the command into base command and arguments
  const parts = command.split(/\s+/);
  if (parts.length <= 2) {
    // Very simple command, no wrapping needed
    return command;
  }

  // Find the base command (everything before the first --)
  let baseCommandEnd = 0;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith("--")) {
      baseCommandEnd = i;
      break;
    }
  }

  // If no -- arguments found, return as-is
  if (baseCommandEnd === 0) {
    return command;
  }

  const baseCommand = parts.slice(0, baseCommandEnd).join(" ");
  const lines: string[] = [baseCommand];
  let currentLine = "";

  // Process arguments
  for (let i = baseCommandEnd; i < parts.length; i++) {
    const part = parts[i];

    if (part.startsWith("--")) {
      // This is a flag, potentially start a new line
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }
      currentLine = `  ${part}`;
    } else {
      // This is a value or continuation of the previous token
      currentLine += ` ${part}`;
    }
  }

  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }

  // Join with backslashes (except the last line)
  return lines
    .map((line, i) => (i < lines.length - 1 ? `${line} \\` : line))
    .join("\n");
}

// Read all partial files
const partialFiles = await collectGlob("docs/cli/*.partial.mdx", {
  cwd: projectDir,
});
const partialContent: Record<string, string> = {};
const partialAdditionalResources: Record<
  string,
  Array<{ name: string; href: string }>
> = {};

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

  // Extract additional-resources from frontmatter
  if (parsed.data["additional-resources"]) {
    partialAdditionalResources[commandName] =
      parsed.data["additional-resources"];
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

  // Filter out global options from the detailed display
  const globalOptionNames = ["help", "api-key"];
  const nonGlobalOptions = command.options.filter(
    (opt) => !globalOptionNames.includes(opt.name),
  );

  // Build component props
  const props: string[] = [
    formatJsxProp("command", command.command),
    formatJsxProp("description", command.description),
  ];

  if (command.aliases && command.aliases.length > 0) {
    props.push(formatJsxProp("aliases", command.aliases));
  }

  if (nonGlobalOptions.length > 0) {
    props.push(formatJsxProp("options", nonGlobalOptions));
  }

  if (command.examples && command.examples.length > 0) {
    // Wrap long commands for better readability
    const wrappedExamples = command.examples.map(([cmd, desc]) => [
      wrapCliCommand(cmd),
      desc,
    ]);
    props.push(formatJsxProp("examples", wrappedExamples));
  }

  if (command.usage) {
    // Wrap long usage commands for better readability
    props.push(formatJsxProp("usage", wrapCliCommand(command.usage)));
  }

  // Get custom content from partial files
  const partialContentMd = partialContent[fileKey] || "";

  // Add global options section
  const globalOptions = ["help", "api-key"];
  const globalOptionsSection = `
## Global options

The following global options are available for all commands:

${globalOptions.map((opt) => `- [\`--${opt}\`](./global-options.mdx#${opt})`).join("\n")}
`;

  // Add additional resources section if available
  const additionalResources = partialAdditionalResources[fileKey];
  const additionalResourcesSection = additionalResources
    ? `
## Additional resources

${additionalResources.map((resource) => `- [${resource.name}](${resource.href})`).join("\n")}
`
    : "";

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
${additionalResourcesSection}
`;

  // Format with prettier
  const formatted = await format(mdxContent, { parser: "mdx" });

  // Write the file
  await writeFile(filePath, formatted);

  // Track this command for the sidebar
  generatedCommands.push(`cli/${fileKey}`);
}

// Process each top-level command, recursively flattening all subcommands
for (const command of cliJson.commands) {
  const leafCommands = flattenCommands(command);

  for (const leafCommand of leafCommands) {
    const fileKey = commandToFileKey(leafCommand.command);
    const sidebarLabel = leafCommand.command;
    await createCommandPage(leafCommand, fileKey, sidebarLabel);
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
