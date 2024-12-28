import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  ReactFlowProps,
} from "@xyflow/react";
import React from "react";
import { CustomHandleProps, CustomNode } from "./CustomNode";
import { LabeledGroupNode } from "./LabeledGroup";
import { ZuploApiNode } from "./ZuploApiNode";
export { LabeledGroupNode } from "./LabeledGroup";

// import "@xyflow/react/dist/style.css";

type _react = typeof React;

export type DiagramNode = Node & {
  data: {
    label: string;
    handles?: CustomHandleProps[];
  };
};

export type { Edge };
export type DiagramProps = Pick<ReactFlowProps, "nodes" | "edges"> & {
  className: string;
};

const nodeTypes = {
  zuplo: ZuploApiNode,
  custom: CustomNode,
  labeledGroup: LabeledGroupNode,
};

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#b1b1b7",
  },
  reconnectable: false,
  pathOptions: { offset: 5 },
};

const proOptions = {
  account: "paid-pro",
  hideAttribution: true,
};

function Diagram({ className, nodes, edges }: DiagramProps) {
  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        proOptions={proOptions}
        zoomOnPinch={true}
        zoomOnScroll={false}
        contentEditable={false}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        attributionPosition="top-right"
        className="rounded-md"
        style={{
          backgroundColor: "#F7F9FB",
          fontWeight: 400,
          borderWidth: "1px",
        }}
      >
        <Controls showInteractive={false} />
        <Background color="#ccc" variant={BackgroundVariant.Dots} gap={10} />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
