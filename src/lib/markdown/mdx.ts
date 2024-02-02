import { migrateContent } from "@/build/migrate.mjs";
import { Section } from "@/lib/interfaces";
import remarkTransformLink from "@/lib/markdown/md-links";
import { CompileOptions } from "@mdx-js/mdx";
import { Element } from "hast";
import { h } from "hastscript";
import { Root } from "mdast";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings, {
  Options as RehypeAutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypeCode, { Options as CodeOptions } from "rehype-pretty-code";
import rehypeRewrite, { RehypeRewriteOptions } from "rehype-rewrite";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import components from "../../components/markdown";
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

const rehypeCodeOptions: CodeOptions = {
  theme: "github-dark",
  keepBackground: false,
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

const rehypeGetRawCode: Plugin<[], Root, Root> = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;

      if (codeEl.tagName !== "code") return;

      node.raw = codeEl.children?.[0].value;
    }
  });
};
const rehypeAddRawCode: Plugin<[], Root, Root> = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "figure") {
      if (!("data-rehype-pretty-code-figure" in node.properties)) {
        return;
      }

      for (const child of node.children) {
        if (child.tagName === "pre") {
          child.properties["raw"] = node.raw;
        }
      }
    }
  });
};

function getOptions(headings: Element[] = []): SerializeOptions {
  return {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkTransformLink as any, remarkStaticImage, remarkGfm],
      rehypePlugins: [
        rehypeGetRawCode,
        [rehypeCode as any, rehypeCodeOptions],
        rehypeAddRawCode,
        rehypeSlug,
        [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
        [rehypeRewrite as any, rehypeRewriteOptions],
        [rehypeRewrite, getHeaderRewriteOptions(headings)],
      ],
    },
  };
}

export async function compileMdxFragment(source: string) {
  const vfile = new VFile(source);
  vfile.path = "fragement.mdx";

  const options = getOptions();
  const result = await compileMDX({
    source: vfile as any,
    options,
    components,
  });
  return result.content;
}

export async function compileMdx<Frontmatter = Record<string, any>>(
  source: string,
  filepath: string,
) {
  const migrated = await migrateContent(source);

  const vfile = new VFile(migrated);
  vfile.path = filepath.replace(".md", ".mdx"); // Trick mdxjs that this is MDX

  const nodes: (Element & { tagName: "h2" | "h3" })[] = [];
  const options = getOptions(nodes);
  const result = await compileMDX<Frontmatter>({
    source: vfile as any,
    options,
    components,
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
