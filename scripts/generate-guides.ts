import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";
import { format } from "prettier";
import { guides, categories } from "../sidebar.guides.js";

interface Guide {
  id: string;
  title: string;
  description: string;
  categories: string[]; // Array of category slugs
  page: string;
}

const projectDir = path.join(import.meta.dirname, "..");
const generatedGuides: Guide[] = [];

// Create slug set for validation
const validSlugs = new Set(categories.map((cat) => cat.slug));

// Process each guide from the sidebar
for (const guidePath of guides) {
  // Skip non-string items (in case there are category objects)
  if (typeof guidePath !== "string") {
    continue;
  }

  // Try both .md and .mdx extensions
  const possiblePaths = [
    path.join(projectDir, "docs", `${guidePath}.md`),
    path.join(projectDir, "docs", `${guidePath}.mdx`),
  ];

  let content: string | null = null;
  let actualPath: string | null = null;

  for (const filePath of possiblePaths) {
    try {
      content = await readFile(filePath, "utf-8");
      actualPath = filePath;
      break;
    } catch (error) {
      // File doesn't exist, try next extension
      continue;
    }
  }

  if (!content || !actualPath) {
    throw new Error(
      `Could not find markdown file for guide: ${guidePath} (tried .md and .mdx)`,
    );
  }

  const { data } = matter(content);

  // Validate required frontmatter fields
  if (!data.title) {
    throw new Error(
      `Missing required frontmatter field 'title' in guide: ${guidePath}`,
    );
  }

  if (!data.description) {
    throw new Error(
      `Missing required frontmatter field 'description' in guide: ${guidePath}`,
    );
  }

  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    throw new Error(
      `Missing or invalid required frontmatter field 'tags' in guide: ${guidePath}. Tags must be a non-empty array.`,
    );
  }

  // Validate that all tags are valid slugs
  const invalidTags = data.tags.filter((tag: string) => !validSlugs.has(tag));
  if (invalidTags.length > 0) {
    throw new Error(
      `Invalid tags in guide: ${guidePath}\n` +
        `  Invalid: ${invalidTags.join(", ")}\n` +
        `  Valid slugs: ${Array.from(validSlugs).join(", ")}\n` +
        `  Note: Tags must use slugs (lowercase, hyphens), not labels.`,
    );
  }

  // Generate a unique ID from the path
  const id = guidePath.split("/").pop() || guidePath;

  generatedGuides.push({
    id,
    title: data.title,
    description: data.description,
    categories: data.tags, // These are now validated slugs
    page: guidePath,
  });
}

// Generate the TypeScript code
let code = `
/**
 * This file is auto-generated. Do not modify this file manually.
 * Generated from sidebar.ts guides array and markdown frontmatter.
 */

export interface Guide {
  id: string;
  title: string;
  description: string;
  categories: string[];
  page: string;
}

export const guides: Guide[] = ${JSON.stringify(generatedGuides, null, 2)};
`.trim();

// Format with prettier
code = await format(code, {
  parser: "typescript",
});

// Write the output file
await writeFile(path.join(projectDir, "src/guides.ts"), code);

console.log(`✅ Generated ${generatedGuides.length} guides to src/guides.ts`);
