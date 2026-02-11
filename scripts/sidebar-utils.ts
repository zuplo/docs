import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Navigation } from "zudoku";

export const projectDir = path.join(import.meta.dirname, "..");

/**
 * Recursively extracts all document paths from a Navigation structure
 */
export function extractDocsFromNavigation(
  items: Navigation | undefined,
): string[] {
  const docs: string[] = [];

  if (!items) return docs;

  for (const item of items) {
    if (typeof item === "string") {
      // Simple string reference
      docs.push(item);
    } else if (typeof item === "object" && item !== null) {
      // Use type assertion to work with the object
      const navItem = item as any;

      // Check the type
      if ("type" in navItem) {
        switch (navItem.type) {
          case "doc":
            // Doc with explicit file property
            if ("file" in navItem && typeof navItem.file === "string") {
              docs.push(navItem.file);
            }
            break;
          case "category":
            // Category with nested items
            if ("items" in navItem && Array.isArray(navItem.items)) {
              docs.push(...extractDocsFromNavigation(navItem.items));
            }
            break;
          case "link":
          case "custom-page":
            // External links and custom pages - ignore
            break;
        }
      }

      // Also check for legacy link property (from old structure)
      if ("link" in navItem) {
        if (typeof navItem.link === "string") {
          docs.push(navItem.link);
        } else if (
          typeof navItem.link === "object" &&
          navItem.link !== null &&
          "type" in navItem.link &&
          navItem.link.type === "doc" &&
          "id" in navItem.link &&
          typeof navItem.link.id === "string"
        ) {
          docs.push(navItem.link.id);
        }
      }

      // Check for items property even if no type specified
      if (
        "items" in navItem &&
        Array.isArray(navItem.items) &&
        !("type" in navItem)
      ) {
        docs.push(...extractDocsFromNavigation(navItem.items));
      }
    }
  }

  return docs;
}

/**
 * Attempts to find a markdown file by trying both .md and .mdx extensions
 * Returns the file content and actual path if found, or null if not found
 */
export async function findMarkdownFile(
  docPath: string,
  baseDir: string = projectDir,
): Promise<{ content: string; path: string } | null> {
  const possiblePaths = [
    path.join(baseDir, "docs", `${docPath}.md`),
    path.join(baseDir, "docs", `${docPath}.mdx`),
  ];

  for (const filePath of possiblePaths) {
    try {
      const content = await readFile(filePath, "utf-8");
      return { content, path: filePath };
    } catch (error) {
      // File doesn't exist, try next extension
      continue;
    }
  }

  return null;
}
