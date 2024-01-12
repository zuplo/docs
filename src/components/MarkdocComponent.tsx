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

export function MarkdocComponent({ markdown }: { markdown: string }) {
  const nodes: any = Markdoc.parse(markdown);
  const content = Markdoc.transform(nodes, config);

  const renderConfig = {
    components: { Callout },
  };
  return Markdoc.renderers.react(content, React, renderConfig);
}
