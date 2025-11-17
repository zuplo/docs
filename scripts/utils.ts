import { glob } from "node:fs/promises";

/**
 * Helper to collect async iterator results from Node.js glob into an array
 */
export async function collectGlob(
  pattern: string,
  options: { cwd?: string } = {},
): Promise<string[]> {
  const results: string[] = [];
  for await (const file of glob(pattern, options)) {
    results.push(file);
  }
  return results;
}
