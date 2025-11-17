import { readFile, writeFile } from "node:fs/promises";
import { collectGlob } from "./utils.js";

const projectDir = import.meta.dirname + "/..";

// Contractions to fix
const contractions: Array<[RegExp, string]> = [
  [/\bIt is\b/g, "It's"],
  [/\bit is\b/g, "it's"],
  [/\bWe are\b/g, "We're"],
  [/\bwe are\b/g, "we're"],
  [/\bThey are\b/g, "They're"],
  [/\bthey are\b/g, "they're"],
  [/\bWe have\b/g, "We've"],
  [/\bwe have\b/g, "we've"],
  [/\bWhat is\b/g, "What's"],
  [/\bwhat is\b/g, "what's"],
  [/\bThat is\b/g, "That's"],
  [/\bthat is\b/g, "that's"],
  [/\bis not\b/g, "isn't"],
  [/\bis NOT\b/g, "isn't"],
  [/\bare not\b/g, "aren't"],
  [/\bwas not\b/g, "wasn't"],
  [/\bwere not\b/g, "weren't"],
  [/\bdoes not\b/g, "doesn't"],
  [/\bdoes NOT\b/g, "doesn't"],
  [/\bdo not\b/g, "don't"],
  [/\bwill not\b/g, "won't"],
  [/\bcannot\b/g, "can't"],
  [/\bCould not\b/g, "Couldn't"],
  [/\bcould not\b/g, "couldn't"],
  [/\bshould not\b/g, "shouldn't"],
];

// Latin abbreviations to fix
const latinAbbreviations: Array<[RegExp, string]> = [
  [/\be\.g\.,\s*/g, "for example, "],
  [/\be\.g\.\s+/g, "for example "],
  [/\bi\.e\.,\s*/g, "that is, "],
  [/\bi\.e\.\s+/g, "that is "],
];

async function fixFile(filePath: string): Promise<number> {
  let content = await readFile(filePath, "utf-8");
  let changeCount = 0;

  // Apply contractions
  for (const [pattern, replacement] of contractions) {
    const matches = content.match(pattern);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  }

  // Apply latin abbreviations
  for (const [pattern, replacement] of latinAbbreviations) {
    const matches = content.match(pattern);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(pattern, replacement);
    }
  }

  if (changeCount > 0) {
    await writeFile(filePath, content);
  }

  return changeCount;
}

async function main() {
  const patterns = [
    "docs/articles/**/*.{md,mdx}",
    "docs/ai-gateway/**/*.{md,mdx}",
    "docs/cli/**/*.{md,mdx}",
    "docs/dedicated/**/*.{md,mdx}",
    "docs/handlers/**/*.{md,mdx}",
    "docs/mcp-server/**/*.{md,mdx}",
    "docs/programmable-api/**/*.{md,mdx}",
    "docs/guides/**/*.{md,mdx}",
  ];

  let totalFiles = 0;
  let totalChanges = 0;

  for (const pattern of patterns) {
    const files = await collectGlob(pattern, { cwd: projectDir });

    for (const file of files) {
      const changes = await fixFile(`${projectDir}/${file}`);
      if (changes > 0) {
        totalFiles++;
        totalChanges += changes;
        console.log(`✓ ${file}: ${changes} fixes`);
      }
    }
  }

  console.log(`\n✅ Fixed ${totalChanges} issues across ${totalFiles} files`);
}

main().catch(console.error);
