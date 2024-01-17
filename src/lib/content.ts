import { existsSync } from "fs";
import fs from "fs/promises";
import { glob } from "glob";
import matter from "gray-matter";
import path from "path";
export interface BaseContent<Data = Record<string, any>> {
  source: string;
  data: Data;
  href: string;
  slug: string | string[];
}

export interface Content<Data = Record<string, any>> {
  source: string;
  filepath: string;
  data: Data;
  href: string;
  slug: string[];
}

export async function getSlugContent<Data = Record<string, any>>({
  slug,
  sourceDir,
}: {
  slug: Array<string>;
  sourceDir: string;
}): Promise<Content<Data> | undefined> {
  const fileName = `${slug.join("/")}.mdx`;
  const filepath = path.join(
    process.cwd(),
    sourceDir,
    fileName.replace("%5C", "/"),
  );
  if (!existsSync(filepath)) {
    return undefined;
  }

  const source = await fs.readFile(filepath);

  const { content, data } = matter(source);

  const result: Content<Data> = {
    filepath,
    source: content,
    data: data as Data,
    href: `/${slug}`,
    slug,
  };
  return result;
}

export async function getAllContent<Data = Record<string, any>>(options?: {
  limit?: number;
}): Promise<Content<Data>[]> {
  const contentFiles = await glob(`docs/**/*.mdx`);
  const results = await Promise.all(
    contentFiles
      .filter((f) => f.endsWith(".mdx"))
      .sort()
      .reverse()
      .map(async (file) => {
        const filepath = path.join(process.cwd(), file);
        const source = await fs.readFile(filepath);

        const { data, content } = matter(source);

        const result: Content<Data> = {
          filepath,
          source: content,
          data: data as Data,
          href: file.substring(5).replace(".mdx", ""),
          // Remove the /docs
          slug: file.substring(5).replace(".mdx", "").split("/"),
        };
        return result;
      }),
  );

  if (options?.limit) {
    return results.splice(0, options.limit);
  }

  return results;
}
