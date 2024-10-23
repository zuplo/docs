import { glob } from "glob";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import matter from "gray-matter";

const projectDir = path.join(import.meta.dirname, "..");
const errorMds = await glob("docs/errors/*.{md,mdx}", {
  cwd: projectDir,
});

const errorDocs = [];

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

await writeFile(
  path.join(projectDir, "generated/errors.ts"),
  `
/**
  * This file is auto-generated. Do not modify this file manually.
  */
export const errors = ${JSON.stringify(errorDocs, null, 2)};
`.trim(),
);
