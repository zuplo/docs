import { migrateContent } from "@/build/migrate.mjs";
import components from "@/components/markdown/index";
import { Section } from "@/lib/interfaces";
import remarkTransformLink from "@/lib/markdown/md-links";
import { CompileOptions } from "@mdx-js/mdx";
import fs from "fs/promises";
import { Element } from "hast";
import { h } from "hastscript";
import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import rehypeAutolinkHeadings, {
  Options as RehypeAutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypeRewrite, { RehypeRewriteOptions } from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkImages from "remark-images";
import { VFile } from "vfile";
import remarkStaticImage from "./static-images";

export interface SerializeOptions {
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>;
  /**
   * These options are passed to the MDX compiler.
   * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
   */
  mdxOptions?: Omit<CompileOptions, "outputFormat" | "providerImportSource">;
  /**
   * Indicate whether or not frontmatter should be parsed out of the MDX. Defaults to false
   */
  parseFrontmatter?: boolean;
}

// Shiki loads languages and themes using "fs" instead of "import", so Next.js
// doesn't bundle them into production build. To work around, we manually copy
// them over to our source code (lib/shiki/*) and update the "paths".
//
// Note that they are only referenced on server side
// See: https://github.com/shikijs/shiki/issues/138
const getShikiPath = (): string => {
  return path.join(process.cwd(), "src/shiki");
};

const touched = { current: false };

// "Touch" the shiki assets so that Vercel will include them in the production
// bundle. This is required because shiki itself dynamically access these files,
// so Vercel doesn't know about them by default
const touchShikiPath = (): void => {
  if (touched.current) return; // only need to do once
  fs.readdir(getShikiPath()); // fire and forget
  touched.current = true;
};

const rehypeAutolinkHeadingsOptions: RehypeAutolinkHeadingsOptions = {
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
};

const rehypeRewriteOptions: RehypeRewriteOptions = {
  rewrite: (node, i, parent) => {
    if (
      node.type === "element" &&
      node.properties &&
      ["h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
    ) {
      // node.properties.className =
      //   "group scroll-mt-20 text-[26px] lg:text-[32px] md:scroll-mt-32";
      node.properties.className = "group scroll-mt-20 md:scroll-mt-32";
    }
    if (
      node.type === "element" &&
      node.properties &&
      ["p", "li"].includes(node.tagName)
    ) {
      node.properties.className = "text-xl";
    }
  },
};

function getHeaderRewriteOptions(headings: Element[]): RehypeRewriteOptions {
  return {
    rewrite: (node) => {
      if (
        node.type === "element" &&
        (node.tagName === "h2" || node.tagName === "h3")
      ) {
        headings.push(node as Element);
      }
    },
  };
}

function getOptions(headings: Element[]): SerializeOptions {
  return {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [
        remarkTransformLink as any,
        remarkImages,
        remarkStaticImage,
        remarkGfm,
      ],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
        [rehypeRewrite as any, rehypeRewriteOptions],
        [rehypeRewrite as any, getHeaderRewriteOptions(headings)],
      ],
    },
  };
}

export async function compileMdx<Frontmatter = Record<string, any>>(
  source: string,
  filepath: string,
) {
  touchShikiPath();

  const migrated = await migrateContent(source);

  const vfile = new VFile(migrated);
  vfile.path = filepath;

  const nodes: (Element & { tagName: "h2" | "h3" })[] = [];
  const options = getOptions(nodes);
  const result = await compileMDX<Frontmatter>({
    source: vfile as any,
    options,
    components: components as any,
  });
  const toc = buildTableOfContents(nodes);
  return { content: result.content, toc };
}

function buildTableOfContents(nodes: (Element & { tagName: "h2" | "h3" })[]) {
  const headings = nodes
    .map((node) => {
      // Build the TOC from h2 headers
      const id = node.properties?.id as string | undefined;
      if (id) {
        const textNode = node.children?.find(
          (node: any) => node.type === "text",
        );
        if (textNode) {
          const title = (textNode as any).value;
          if (title) {
            return {
              id,
              level: node.tagName === "h2" ? 2 : 3,
              title,
            };
          }
        }
      }
    })
    .filter((h) => typeof h !== "undefined") as {
    id: string;
    title: string;
    level: 2 | 3;
  }[];

  const toc: Section[] = [];
  let previous: Section;
  headings.forEach((heading) => {
    if (previous && previous.level < heading.level) {
      previous.children.push({
        ...heading,
        children: [],
      });
    } else {
      previous = { ...heading, children: [] };
      toc.push(previous);
    }
  });

  return toc;
}
