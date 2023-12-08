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
    icon: h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "currentColor",
        viewbox: "0 0 24 24",
        class: "w-5 h-5 text-gray-600",
        style: "	stroke-width: 0.5;",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
          "clip-rule": "evenodd",
        }),
      ],
    ),
    // color: text-gray-600
    borderColor: "border-gray-600",
    backgroundColor: "bg-gray-50",
    headerColor: "text-gray-800",
    textColor: "text-gray-700",
  },
  tip: {
    defaultTitle: "Tip",
    icon: h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewbox: "0 0 24 24",
        class: "w-5 h-5 stroke-success stroke-2",
      },
      [
        h("path", {
          d: "M19.661 7.27444C18.0754 4.70921 15.2373 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 11.7344 20.9885 11.4715 20.966 11.2118",
        }),
        h("path", {
          d: "M22.375 4.625L12.7071 14.2929C12.3166 14.6834 11.6834 14.6834 11.2929 14.2929L7.46875 10.4688",
        }),
      ],
    ),
    // color: "text-green-400",
    borderColor: "border-success-300",
    backgroundColor: "bg-success-100",
    headerColor: "text-green-800",
    textColor: "text-green-700",
  },
  info: {
    defaultTitle: "Info",
    icon: h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewbox: "0 0 24 24",
        class: "w-5 h-5",
      },
      [
        h("circle", {
          cx: "12",
          cy: "12",
          r: "9",
          transform: "rotate(-90 12 12)",
          class: "stroke-2 stroke-info",
        }),
        h("path", {
          d: "M12 17V11",
          class: "stroke-2 stroke-info",
        }),
        h("circle", {
          cx: "12",
          cy: "8",
          r: "1.5",
          class: "fill-info",
        }),
      ],
    ),
    //color: text-blue-400
    borderColor: "border-info-300",
    backgroundColor: "bg-info-100",
    headerColor: "text-blue-700",
    textColor: "text-blue-600",
  },
  caution: {
    defaultTitle: "Caution",
    icon: h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewbox: "0 0 24 24",
        class: "w-5 h-5",
      },
      [
        h("path", {
          d: "M12 7L12 13",
          class: "stroke-warning stroke-2",
        }),
        h("circle", {
          cx: "12",
          cy: "15.5",
          r: "1.5",
          transform: "rotate(-180 12 15.5)",
          class: "fill-warning",
        }),
        h("path", {
          d: "M9.41956 3.48067C10.5664 1.50644 13.4336 1.50644 14.5804 3.48068L21.5964 15.558C22.7432 17.5322 21.3096 20 19.0159 20H4.98408C2.69035 20 1.25678 17.5322 2.40364 15.558L9.41956 3.48067Z",
          class: "stroke-warning stroke-2",
        }),
      ],
    ),
    // color: text-yellow-400
    borderColor: "border-warning-300",
    backgroundColor: "bg-warning-100",
    headerColor: "text-yellow-800",
    textColor: "text-yellow-700",
  },
  danger: {
    defaultTitle: "Danger",
    icon: h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewbox: "0 0 24 24",
        class: "w-5 h-5 stroke-error stroke-2",
      },
      [
        h("circle", {
          cx: "12",
          cy: "12",
          r: "9",
          transform: "rotate(-90 12 12)",
        }),
        h("path", {
          d: "M8 8L12 12M16 16L14.5 14.5",
        }),
        h("path", {
          d: "M16 8L8 16",
        }),
      ],
    ),
    // color: "text-red-400",
    borderColor: "border-error-300",
    backgroundColor: "bg-error-100",
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
              h(`span.text-sm.leading-6.font-medium.text-black`, {
                type: "text",
                value: title,
              }),
              // @ts-ignore
              h(`div.text-sm.leading-6.mt-2.text-black`, [...node.children]),
            ]),
          ]),
        );

        data.tagName = hast.tagName;
        data.hProperties = hast.properties;
        (node as any).children = hast.children;
        (node as any).properties = {
          class: `callout not-prose mb-4 mt-4 rounded-xl border-[1px] ${config.borderColor}  ${config.backgroundColor} px-4 py-3.5`,
        };

        decorateHast(node);
      }
    });
  };
};

export default remarkCallout;
