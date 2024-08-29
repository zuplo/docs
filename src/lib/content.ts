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

export interface Content<Data = Record<string, any>> extends BaseContent<Data> {
  filepath: string;
  slug: string[];
}

export async function getSlugContent<Data = Record<string, any>>({
  slug,
  sourceDir,
}: {
  slug: Array<string>;
  sourceDir: string;
}): Promise<Content<Data> | undefined> {
  const fileName = `${slug.join("/")}.md`;
  const filepath = path.join(sourceDir, fileName.replaceAll("%5C", "/"));
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
  const contentFiles = await glob(`docs/**/*.md`);
  const results = await Promise.all(
    contentFiles
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .map(async (filepath) => {
        const source = await fs.readFile(filepath);

        const { data, content } = matter(source);

        const result: Content<Data> = {
          filepath,
          source: content,
          data: data as Data,
          href: filepath.substring(5).replace(".md", ""),
          // Remove the /docs
          slug: filepath.substring(5).replace(".md", "").split("/"),
        };
        return result;
      }),
  );

  if (options?.limit) {
    return results.splice(0, options.limit);
  }

  return results;
}

export async function getContentFromDir<Data = Record<string, any>>(
  dir: string,
  options?: {
    limit?: number;
  },
): Promise<Content<Data>[]> {
  const contentFiles = await glob(`docs/${dir}/**/*.md`);
  const results = await Promise.all(
    contentFiles
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .map(async (filepath) => {
        const source = await fs.readFile(filepath);

        const { data, content } = matter(source);

        const result: Content<Data> = {
          filepath,
          source: content,
          data: data as Data,
          href: filepath.substring(5).replace(".md", ""),
          // Remove the /docs
          slug: filepath.substring(5).replace(".md", "").split("/"),
        };
        return result;
      }),
  );

  if (options?.limit) {
    return results.splice(0, options.limit);
  }

  return results;
}
