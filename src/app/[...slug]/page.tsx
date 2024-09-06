import { DocsLayout } from "@/components/DocsLayout";
import { getAllContent, getSlugContent } from "@/lib/content";
import { compileMdx } from "@/lib/markdown/mdx";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticleFrontMatter {
  title: string;
}

const sourceDir = "docs";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const result = await getSlugContent<ArticleFrontMatter>({
    slug: params.slug,
    sourceDir,
  });
  if (!result) {
    return {};
  }

  const { data, source } = result;
  return {
    title: data.title,
    // Take the first sentence as description, its typically the summary or
    // introduction
    description: source
      .replace(/(?<=\[.+\])\(.+\)/, "") // Remove [link](url) from description
      .replace("[", "") // Remove [ from start
      .replace("]", "") // Remove ] from end
      .split(".")[0], // Grab the first sentence
    alternates: {
      canonical: `/${params.slug.join("/")}`,
    },
  };
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const result = await getSlugContent<ArticleFrontMatter>({
    slug: params.slug,
    sourceDir,
  });
  if (!result) {
    return notFound();
  }

  const { data, source, filepath } = result;
  const { content, toc } = await compileMdx(source, filepath);

  return (
    <DocsLayout
      frontmatter={{ title: data.title }}
      sections={toc}
      filepath={filepath}
    >
      {content}
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  const posts = await getAllContent();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
