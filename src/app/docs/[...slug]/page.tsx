import { DocsLayout } from "@/components/DocsLayout";
import { getAllContent, getContentBySlug } from "@/lib/content";
import { compileMdx } from "@/lib/markdown/mdx";
import { notFound } from "next/navigation";

interface ArticleFrontMatter {
  title: string;
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const result = await getContentBySlug<ArticleFrontMatter>({
    dir: "docs",
    baseUrlPath: "/docs",
    slug: params.slug,
  });
  if (!result) {
    return notFound();
  }
  const { data, source } = result;
  const { content, toc } = await compileMdx(source);

  return (
    <DocsLayout frontmatter={data} nodes={[]}>
      {content}
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  const posts = await getAllContent({
    dir: "docs",
    baseUrlPath: "/docs",
  });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
