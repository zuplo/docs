import { Position } from "@xyflow/react";
import Diagram, { DiagramNode, Edge } from "./common/Diagram.js";

import React from "react";
type _react = typeof React;

const initialNodes: DiagramNode[] = [
  {
    id: "end-user",
    type: "custom",
    position: { x: 10, y: 90 },
    data: {
      label: "End User",
      handles: [
        {
          id: "egress",
          type: "source",
          position: Position.Right,
        },
      ],
    },
  },
  {
    id: "waf",
    type: "custom",
    position: { x: 210, y: 90 },
    data: {
      label: "WAF",
      handles: [
        {
          id: "ingress",
          type: "target",
          position: Position.Left,
        },
        {
          id: "egress",
          type: "source",
          position: Position.Right,
        },
      ],
    },
  },
  {
    id: "backend",
    type: "custom",
    position: { x: 200, y: 150 },
    data: {
      label: "Backend",
      handles: [
        {
          id: "ingress",
          type: "target",
          position: Position.Right,
        },
      ],
    },
  },
  {
    id: "zuplo-api",
    type: "zuplo",
    position: { x: 425, y: 90 },
    style: { zIndex: 20 },
    data: {
      label: "Hello",
      handles: [
        {
          id: "ingress",
          type: "target",
          position: Position.Left,
        },
        {
          id: "egress",
          type: "source",
          position: Position.Bottom,
        },
      ],
    },
  },
  {
    id: "4",
    data: { label: "Zuplo VPC" },
    position: { x: 400, y: 50 },
    style: { width: 180, height: 100, zIndex: -1 },
    type: "labeled-group",
  },
  {
    id: "5",
    data: { label: "Customer VPC" },
    position: { x: 150, y: 50 },
    style: { width: 180, height: 150, zIndex: -1 },
    type: "labeled-group",
  },
];

const initialEdges: Edge[] = [
  {
    id: "user-to-waf",
    source: "end-user",
    target: "waf",
    targetHandle: "ingress",
    sourceHandle: "egress",
  },
  {
    id: "zuplo-to-backend",
    source: "zuplo-api",
    target: "backend",
    targetHandle: "ingress",
    sourceHandle: "egress",
  },
  {
    id: "waf-to-zuplo",
    source: "waf",
    target: "zuplo-api",
    targetHandle: "ingress",
    sourceHandle: "egress",
  },
];

export default function ZuploIngressWithManagedDedicated() {
  return (
    <Diagram
      nodes={initialNodes}
      edges={initialEdges}
      className="w-full h-[300px]"
      direction="BT"
      algorithm="d3-hierarchy"
    />
  );
}
