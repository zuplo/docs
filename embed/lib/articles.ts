import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import env from "./env";
import { Article } from "./interfaces";
import { getFiles } from "./markdown";

export async function getArticleSlugs() {
  const slugs: string[][] = [];
  const basePath = env.QUICKSTARTS_LOCATION;
  for await (const file of getFiles(basePath)) {
    if (file.endsWith(".md")) {
      const slug = file
        .replace(basePath, "")
        .replace(/\/index\.md$/, "")
        .replace(/\.md$/, "")
        .split("/");
      slugs.push(slug);
    }
  }
  return slugs;
}

export async function getArticleBySlug(slug: string[]): Promise<Article> {
  const slug1 = [...slug];
  const slug2 = [...slug];
  const indexPath = join(env.QUICKSTARTS_LOCATION, ...slug1, `index.md`);
  const fileName = `${slug2.pop()}.md`;
  const filePath = join(env.QUICKSTARTS_LOCATION, ...slug2, fileName);

  let fileContents: string;
  if (fs.existsSync(filePath)) {
    fileContents = fs.readFileSync(filePath, "utf8");
  } else if (fs.existsSync(indexPath)) {
    fileContents = fs.readFileSync(indexPath, "utf8");
  } else {
    throw new Error(`Could not locate article with slug '${slug}`);
  }

  const { data, content } = matter(fileContents);

  if (!data.title) {
    throw new Error(`Article missing title: ${filePath}`);
  }

  return {
    content,
    frontmatter: data,
    slug,
    title: data.title,
    subtitle: data.subtitle ?? null,
    lead: data.lead ?? null,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = await getArticleSlugs();
  const tasks = slugs.map((slug) => getArticleBySlug(slug));
  return Promise.all(tasks);
}
