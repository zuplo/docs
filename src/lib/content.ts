import { existsSync } from "fs";
import fs from "fs/promises";
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
  data: Data;
  href: string;
  slug: string[];
}

export async function getContentBySlug<Data = Record<string, any>>({
  dir,
  baseUrlPath,
  slug,
}: {
  dir: string;
  baseUrlPath: string;
  slug: string[];
}): Promise<Content<Data> | undefined> {
  const fileName = `${slug.join("/")}.md`;
  console.log(fileName);
  const directory = path.join(process.cwd(), dir);
  const filepath = path.join(directory, fileName);
  if (!existsSync(filepath)) {
    return undefined;
  }

  const source = await fs.readFile(filepath);

  const { content, data } = matter(source);

  const result: Content<Data> = {
    source: content,
    data: data as Data,
    href: `${baseUrlPath}/${slug}`,
    slug,
  };
  return result;
}

export async function getAllContent<Data = Record<string, any>>({
  dir,
  baseUrlPath,
  limit,
}: {
  dir: string;
  baseUrlPath: string;
  limit?: number;
}): Promise<Content<Data>[]> {
  const directory = path.join(process.cwd(), dir);
  const contentFiles = await fs.readdir(directory);

  const results = await Promise.all(
    contentFiles
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .map(async (file) => {
        const filepath = path.join(directory, file);
        const source = await fs.readFile(filepath);

        const { data, content } = matter(source);

        const result: Content<Data> = {
          source: content,
          data: data as Data,
          href: `${baseUrlPath}/${file}`,
          slug: file.replace(".md", "").split("/"),
        };
        return result;
      }),
  );

  if (limit) {
    return results.splice(0, limit);
  }

  return results;
}
