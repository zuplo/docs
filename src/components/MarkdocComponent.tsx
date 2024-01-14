import { commonNodes } from "@/markdoc/nodes";
import tags from "@/markdoc/tags";
import Markdoc, { Config } from "@markdoc/markdoc";
import React from "react";
import { Callout } from "./Callout";

const config: Config = {
  tags: tags as any,
  nodes: commonNodes as any,
  variables: {},
};

const renderConfig = {
  components: { Callout },
};

export function MarkdocComponent({ markdown }: { markdown: string }) {
  const nodes = Markdoc.parse(markdown);

  const content = Markdoc.transform(nodes, config);

  return Markdoc.renderers.react(content, React, renderConfig);
}

export function MarkdocInline({ markdown }: { markdown: string }) {
  const nodes = Markdoc.parse(markdown);
  nodes.children[0].attributes["class"] = "inline";
  const content = Markdoc.transform(nodes.children, config);

  return Markdoc.renderers.react(content, React, renderConfig);
}
