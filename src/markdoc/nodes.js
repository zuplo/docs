import { nodes as defaultNodes, Tag } from "@markdoc/markdoc";
import slugify, { slugifyWithCounter } from "@sindresorhus/slugify";
import yaml from "js-yaml";

import { DocsLayout } from "@/components/DocsLayout";
import { Fence } from "@/components/Fence";

let documentSlugifyMap = new Map();

/** @type {import("@markdoc/markdoc").ConfigType["nodes"]} */
export const commonNodes = {
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: "col",
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
};

/** @type {import("@markdoc/markdoc").ConfigType["nodes"]} */
const nodes = {
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(node, config) {
      documentSlugifyMap.set(config, slugifyWithCounter());

      return new Tag(
        this.render,
        {
          frontmatter: yaml.load(node.attributes.frontmatter),
          nodes: node.children,
        },
        node.transformChildren(config),
      );
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node, config) {
      let slug = documentSlugifyMap.get(config) ?? slugify;
      let attributes = node.transformAttributes(config);
      let children = node.transformChildren(config);
      let text = children
        .filter((child) => typeof child === "string")
        .join(" ");
      if (!slugify) {
        console.log(node);
      }
      let id = attributes.id ?? slug(text);

      return new Tag(
        `h${node.attributes.level}`,
        { ...attributes, id },
        children,
      );
    },
  },
  ...commonNodes,
};

export default nodes;
