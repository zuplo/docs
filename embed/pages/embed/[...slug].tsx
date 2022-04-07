import ErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ArticleBody from "../../components/article-body";
import { getAllArticles, getArticleBySlug } from "../../lib/articles";
import { Article, ArticleScope } from "../../lib/interfaces";
import { article as markdown } from "../../lib/markdown";

type Props = {
  article: Article;
  scope: ArticleScope;
};

const EmbedPage = ({ article, scope }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !article?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        <title>{article.title} | Zuplo Docs</title>
        <link
          rel="canonical"
          href={`https://zuplo.com/docs/${article.slug
            .join("/")
            .replace("/embed/", "/")}`}
        />
      </Head>

      <div className="flex flex-col w-full bg-white">
        <div
          className="
                w-full
                xl:w-4/5
                p-8
                mt-6
                xl:mt-0
                text-gray-900
                leading-normal
              "
        >
          <h1 className="font-fancy break-normal text-black font-bold pt-6 pb-2 text-4xl xl:text-5xl">
            {article.title}
          </h1>
          <ArticleBody
            content={article.content}
            frontmatter={article.frontmatter}
            scope={scope}
            isMdx={true}
          />
        </div>
      </div>
    </>
  );
};

export default EmbedPage;

type Params = {
  params: {
    slug: string[];
  };
};

export async function getStaticProps({ params }: Params) {
  const scope: ArticleScope = { embed: true };
  const article = await getArticleBySlug(params.slug);
  const { content } = await markdown(article.content, scope);
  article.content = content;

  return {
    props: {
      scope,
      article,
    },
  };
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  return {
    paths: articles
      .filter((article) => article.frontmatter.publish !== false)
      .filter((article) => article.frontmatter.embed === true)
      .map((article) => {
        return {
          params: {
            slug: article.slug,
          },
        };
      }),
    fallback: false,
  };
}
