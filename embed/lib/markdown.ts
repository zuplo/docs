import rehypeTwoslash from "@zuplo/rehype-twoslash";
import { readdir } from "fs/promises";
import {
  Element as HastElement,
  Root,
  RootContent,
  Text as HastText,
} from "hast";
import { serialize } from "next-mdx-remote/serialize";
import { resolve } from "path";
import addClasses from "rehype-add-classes";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRemoveComments from "rehype-remove-comments";
import rehypeRewrite, { RehypeRewriteOptions } from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkPrettier from "remark-prettier";
import remarkRehype from "remark-rehype";
import { getHighlighter } from "shiki";
import { unified } from "unified";
import { ArticleScope } from "./interfaces";

export async function* getFiles(
  dir: string
): AsyncGenerator<string, void, void> {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

const codeHighlightOptions = { theme: "dracula" };

export async function reference(markdown: string) {
  const toc: Record<string, string> = {};
  let title: string | undefined;
  const file = await unified()
    .use(remarkParse)
    .use(rehypeRemoveComments)
    .use(remarkPrettier, { report: false })
    .use(remarkGfm)
    .use(remarkRehype)
    // The order of these matters, leave the rewrite one
    // as the first rehype plugin unless you really know
    // what you are doing
    .use(rehypeRewrite, {
      rewrite: (node) => {
        fixReferenceBreadcrumbs(node);
        title = extractReferenceTitle(node);
        rewriteReferenceLinks(node);
        buildToc(node, toc);
        rewriteImgPaths(node);
      },
    } as RehypeRewriteOptions)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeTwoslash, {
      highlighter: await getHighlighter(codeHighlightOptions),
    })
    .use(rehypeStringify)
    .process(markdown);

  return {
    toc,
    title,
    content: file.toString(),
  };
}

export async function article(markdown: string, scope: ArticleScope) {
  const toc: Record<string, string> = {};
  const { compiledSource } = await serialize(markdown, {
    scope,
    mdxOptions: {
      remarkPlugins: [[remarkPrettier, { report: false }]],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeRemoveComments,
        [
          rehypeRewrite,
          {
            rewrite: (node) => {
              rewriteArticleLinks(node, scope?.embed ?? false);
              buildToc(node, toc);
              rewriteImgPaths(node);
            },
          } as RehypeRewriteOptions,
        ],
        [
          rehypeTwoslash,
          {
            highlighter: await getHighlighter(codeHighlightOptions),
          },
        ],
        [
          addClasses,
          {
            pre: "not-prose",
          },
        ],
      ],
    },
    parseFrontmatter: false,
  });
  return {
    toc,
    content: compiledSource,
  };
}

/**
 * Builds the table of contents from h2 tags
 * @param node
 * @param toc
 */
function buildToc(node: Root | RootContent, toc: Record<string, string>) {
  if (node.type === "element" && node.tagName === "h2") {
    // Build the TOC from h2 headers
    const id = node.properties?.id as string | undefined;
    if (id) {
      const textNode = node.children?.find((node) => node.type === "text");
      if (textNode) {
        const title = (textNode as HastText).value;
        if (title) {
          toc[id] = title;
        }
      }
    }
  }
}

function rewriteImgPaths(node: Root | RootContent) {
  if (process.env.CDN_URL) {
    if (node.type === "element" && node.tagName === "img") {
      const { src } = node.properties as { src: string };
      node.properties.loading = "lazy";
      if (src && src.endsWith(".gif")) {
        // Don't resize gifs, doesn't work well
        node.properties.src = `${process.env.CDN_URL}/docs${src}`;
      } else if (src) {
        node.properties.src = `${process.env.CDN_URL}/cdn-cgi/image/fit=contain,format=auto,width=778/docs${src}`;
        node.properties.srcset = [
          `${process.env.CDN_URL}/cdn-cgi/image/fit=contain,format=auto,width=384/docs${src} 384w,`,
          `${process.env.CDN_URL}/cdn-cgi/image/fit=contain,format=auto,width=768/docs${src} 768w,`,
          `${process.env.CDN_URL}/cdn-cgi/image/fit=contain,format=auto,width=778/docs${src} 778w,`,
          `${process.env.CDN_URL}/cdn-cgi/image/fit=contain,format=auto,width=1556/docs${src} 1556w`,
        ].join("\n");
      }
    }
  }
}

/**
 * Adds the correct prefix to article hrefs
 * @param node
 * @param embed
 */
function rewriteArticleLinks(node: Root | RootContent, embed: boolean) {
  if (node.type === "element" && node.tagName === "a") {
    const href = node.properties?.href as string | undefined;
    if (href && href.startsWith("/")) {
      node.properties.href = "/articles" + href;
    }
    if (embed) {
      node.properties.target = "_blank";
      node.properties.rel = "noreferrer";
    }
  }
}

/**
 * Rewrites the links in the reference docs to correct absolutes
 * @param node
 */
function rewriteReferenceLinks(node: Root | RootContent) {
  if (node.type === "element" && node.tagName === "a") {
    const href = node.properties?.href as string | undefined;
    if (href && href.endsWith(".md")) {
      node.properties.href = `/reference${href.substring(1, href.length - 3)}`;
    }
    if (href === "./index.md") {
      node.properties.href = "/reference";
    }
  }
}

/**
 * Changes the breadcrumbs character in the reference docs
 * @param node
 */
function fixReferenceBreadcrumbs(node: Root | RootContent) {
  if (node.type === "text" && node.value == " > ") {
    // Cleanup the breadcrumbs
    node.value = "»";
  }
}

/**
 * Extracts the first h2 elements as the title
 * @param node
 * @returns
 */
function extractReferenceTitle(node: Root | RootContent): string | undefined {
  if (node.type === "root") {
    const firstH2 = node.children.find(
      (n) => n.type === "element" && n.tagName === "h2"
    ) as HastElement;
    if (firstH2) {
      firstH2.tagName = "h1";
      const textChild = firstH2.children.find(
        (child) => child.type === "text"
      ) as HastText | undefined;
      if (textChild) {
        return textChild.value.trim();
      }
    }
  }
}
