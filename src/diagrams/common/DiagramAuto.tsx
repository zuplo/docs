import { Node, ReactFlowProvider } from "@xyflow/react";
import React from "react";
import { CustomHandleProps } from "./CustomNode";
import Diagram, { DiagramProps } from "./Diagram";
import useAutoLayout, { LayoutOptions } from "./useAutoLayout";
export { LabeledGroupNode } from "./LabeledGroup";

// import "@xyflow/react/dist/style.css";

export type DiagramNode = Node & {
  data: {
    label: string;
    handles?: CustomHandleProps[];
  };
};

export type DiagramAutoProps = DiagramProps & Partial<LayoutOptions>;

export default function DiagramAuto({
  direction = "BT",
  spacing = [50, 50],
  algorithm = "dagre",
  ...props
}: DiagramAutoProps) {
  useAutoLayout({ direction, spacing, algorithm });
  return (
    <ReactFlowProvider>
      <Diagram {...props} />
    </ReactFlowProvider>
  );
}
