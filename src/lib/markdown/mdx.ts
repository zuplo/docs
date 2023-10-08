import components from "@/components/mdx";
import remarkTransformLink from "@/lib/markdown/md-link";
import { h } from "hastscript";
import { SerializeOptions } from "next-mdx-remote/dist/types";
import { compileMDX } from "next-mdx-remote/rsc";
import { serialize } from "next-mdx-remote/serialize";
import rehypeAutolinkHeadings, {
  Options as RehypeAutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypePrettyCode, {
  Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeRewrite, { RehypeRewriteOptions } from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { VFileCompatible } from "vfile";
import remarkCallout from "./callout";

function getOptions(toc: Record<string, string>): SerializeOptions {
  return {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [
        remarkTransformLink,
        remarkGfm,
        remarkDirective,
        remarkCallout,
      ],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            onVisitTitle(element) {
              const hast = h(
                "div",
                {
                  class:
                    "p-1 text-syntax-gray text-sm font-mono pl-6 border-b border-syntax-dark",
                },
                element.children as any,
              );

              element.properties = {
                class: `not-prose mb-[-2em] pb-[0.2em] bg-syntax rounded-t-md `,
              };
              element.children = [hast as any];
            },
          } as PrettyCodeOptions,
        ],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              class:
                "no-underline pl-1 mb-3 cursor-pointer opacity-0 hover:!opacity-100 group-hover:!opacity-100",
            },
            // group(node) {
            //   return h("a");
            // },
            content(node) {
              return h("span", "#");
            },
          } as RehypeAutolinkHeadingsOptions,
        ],
        [
          rehypeRewrite,
          {
            rewrite: (node, i, parent) => {
              if (
                node.type === "element" &&
                node.properties &&
                ["h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
              ) {
                node.properties.className =
                  "group scroll-mt-20 text-[26px] lg:text-[32px] md:scroll-mt-32";
              }
              if (
                node.type === "element" &&
                node.properties &&
                ["p", "li"].includes(node.tagName)
              ) {
                node.properties.className = "text-xl";
              }
            },
          } as RehypeRewriteOptions,
        ],
        [
          rehypeRewrite,
          {
            rewrite: (node) => {
              if (node.type === "element" && node.tagName === "h2") {
                // Build the TOC from h2 headers
                const id = node.properties?.id as string | undefined;
                if (id) {
                  const textNode = node.children?.find(
                    (node: any) => node.type === "text",
                  );
                  if (textNode) {
                    const title = (textNode as any).value;
                    if (title) {
                      toc[id] = title;
                    }
                  }
                }
              }
            },
          } as RehypeRewriteOptions,
        ],
      ],
    },
  };
}

export async function serializeMdx(content: VFileCompatible) {
  const toc: Record<string, string> = {};
  const options = getOptions(toc);
  const result = await serialize(content, options);
  return { ...result, toc };
}

export async function compileMdx<Frontmatter = Record<string, any>>(
  source: VFileCompatible,
) {
  const toc: Record<string, string> = {};
  const options = getOptions(toc);
  const result = await compileMDX<Frontmatter>({ source, options, components });
  return { content: result.content, toc };
}
