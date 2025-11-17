import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";
import { format } from "prettier";
import { collectGlob } from "./utils.js";

const projectDir = path.join(import.meta.dirname, "..");

const errorMds = await collectGlob("docs/errors/*.{md,mdx}", {
  cwd: projectDir,
});

const errorDocs: { id: string; title: string }[] = [];

for (const errorMd of errorMds) {
  const content = await readFile(path.join(projectDir, errorMd), "utf-8");
  const { data } = matter(content);

  if (!data.title) {
    throw new Error(
      `A title is required in frontmatter section for error document: ${errorMd}`,
    );
  }

  errorDocs.push({
    id: errorMd
      .split("/")
      .pop()!
      .replace(/\.[^.]+$/, ""),
    title: data.title,
  });
}

let code = `
/**
  * This file is auto-generated. Do not modify this file manually.
  */
export const errors = ${JSON.stringify(errorDocs, null, 2)};
`.trim();

code = await format(code, {
  parser: "typescript",
});

await writeFile(path.join(projectDir, "src/errors.ts"), code);
