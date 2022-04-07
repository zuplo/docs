import fs from "fs";
import { join } from "path";
import env from "./env";
import { ReferencePageContent } from "./interfaces";

export async function getReferenceSlugs() {
  return fs.readdirSync(env.REFERENCE_CONTENT_LOCATION);
}

export async function getReferenceBySlug(
  slug: string
): Promise<ReferencePageContent> {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(env.REFERENCE_CONTENT_LOCATION, `${realSlug}.md`);
  const content = fs.readFileSync(fullPath, "utf8");

  return {
    content,
    slug: realSlug,
  };
}

export async function getAllReferences(): Promise<ReferencePageContent[]> {
  const slugs = await getReferenceSlugs();
  const tasks = slugs.map((slug) => getReferenceBySlug(slug));
  const posts = await Promise.all(tasks);
  return posts;
}
