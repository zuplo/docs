import { Position } from "@xyflow/react";
import React from "react";
import Diagram, { DiagramNode, Edge } from "./common/Diagram.js";
import { createIngressEdgressEdge } from "./edges.js";
import {
  createBackend,
  createClient,
  createCustomNode,
  createVpcGroupNode,
  createZuploApiNode,
} from "./nodes.js";

type _react = typeof React;

const clientNode = createClient({ position: { x: 10, y: 90 } });
const backendNode = createBackend({
  position: { x: 200, y: 150 },
  ingress: Position.Right,
});
const zuploApiNode = createZuploApiNode({
  position: { x: 425, y: 90 },
  ingress: Position.Left,
  egress: Position.Bottom,
});
const wafNode = createCustomNode({
  position: { x: 210, y: 90 },
  label: "WAF",
  ingress: Position.Left,
  egress: Position.Right,
});
const zuploVpcNode = createVpcGroupNode({
  position: { x: 400, y: 40 },
  label: "Zuplo VPC",
  width: 180,
  height: 100,
});
const customerVpcNode = createVpcGroupNode({
  position: { x: 150, y: 40 },
  label: "Customer VPC",
  width: 180,
  height: 160,
});

const initialNodes: DiagramNode[] = [
  clientNode,
  wafNode,
  backendNode,
  zuploApiNode,
  zuploVpcNode,
  customerVpcNode,
];

const initialEdges: Edge[] = [
  createIngressEdgressEdge({ egress: clientNode, ingress: wafNode }),
  createIngressEdgressEdge({ egress: wafNode, ingress: zuploApiNode }),
  createIngressEdgressEdge({ egress: zuploApiNode, ingress: backendNode }),
];

export default function ZuploIngressWithManagedDedicated() {
  return (
    <Diagram
      nodes={initialNodes}
      edges={initialEdges}
      className="w-full h-[300px]"
    />
  );
}
