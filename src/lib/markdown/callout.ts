import { h } from "hastscript";
import type { Root } from "remark-directive";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { decorateHast } from "./utils";

interface Callout {
  defaultTitle: string;
  icon: any;
  borderColor: string;
  backgroundColor: string;
  headerColor: string;
  textColor: string;
}

// -----------------------------------------------------------
// IMPORTANT: YOU MUST KEEP THE STYLES OF THIS FILE IN SYNC
// WITH THE STYLES IN components/mdx/Callout.tsx
// -----------------------------------------------------------

const callouts: Record<string, Callout> = {
  note: {
    defaultTitle: "Note",
    icon: "", // color: text-gray-600
    // icon: h(
    //   "svg",
    //   {
    //     xmlns: "http://www.w3.org/2000/svg",
    //     fill: "currentColor",
    //     viewbox: "0 0 24 24",
    //     class: "w-5 h-5 text-gray-600",
    //     style: "	stroke-width: 0.5;",
    //   },
    //   [
    //     h("path", {
    //       "fill-rule": "evenodd",
    //       d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    //       "clip-rule": "evenodd",
    //     }),
    //   ]
    // ),
    borderColor: "border-gray-600",
    backgroundColor: "bg-gray-50",
    headerColor: "text-gray-800",
    textColor: "text-gray-700",
  },
  tip: {
    defaultTitle: "Tip",
    icon: "", // color: "text-green-400",
    borderColor: "border-green-400",
    backgroundColor: "bg-green-50",
    headerColor: "text-green-800",
    textColor: "text-green-700",
  },
  info: {
    defaultTitle: "Info",
    icon: "", //color: text-blue-400
    borderColor: "border-blue-400",
    backgroundColor: "bg-blue-50",
    headerColor: "text-blue-700",
    textColor: "text-blue-600",
  },
  caution: {
    defaultTitle: "Caution",
    icon: "", // color: text-yellow-400
    borderColor: "border-yellow-400",
    backgroundColor: "bg-yellow-50",
    headerColor: "text-yellow-800",
    textColor: "text-yellow-700",
  },
  danger: {
    defaultTitle: "Danger",
    icon: "", // color: "text-red-400",
    borderColor: "border-red-400",
    backgroundColor: "bg-red-50",
    headerColor: "text-red-800",
    textColor: "text-red-700",
  },
};

const remarkCallout: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if ("name" in node && !Object.keys(callouts).includes(node.name))
          return;

        const config = callouts[node.name];
        const { title = config.defaultTitle } = node.attributes ?? {};

        const data = node.data || (node.data = {});
        const hast = h(
          "div",
          h("div.flex", [
            h("div.flex-shrink-0.pt-[6px]", config.icon),
            h("div.ml-3", [
              h(`span.text-md.font-medium.${config.headerColor}`, {
                type: "text",
                value: title,
              }),
              // @ts-ignore
              h(`div.text-md.mt-2.${config.textColor}`, [...node.children]),
            ]),
          ]),
        );

        data.tagName = hast.tagName;
        data.hProperties = hast.properties;
        (node as any).children = hast.children;
        (node as any).properties = {
          class: `callout not-prose mb-4 mt-4 rounded-md border-l-4 ${config.borderColor}  ${config.backgroundColor} p-4`,
        };

        decorateHast(node);
      }
    });
  };
};

export default remarkCallout;
