import Diagram, { DiagramNode, Edge } from "./common/Diagram.js";

import { Position } from "@xyflow/react";
import React from "react";
import { createIngressEdgressEdge } from "./helpers/edges.js";
import {
  createBackend,
  createClient,
  createVpcGroupNode,
  createZuploApiNode,
} from "./helpers/nodes.js";
type _react = typeof React;

const clientNode = createClient({ position: { x: 10, y: 90 } });
const backendNode = createBackend({
  position: { x: 450, y: 90 },
  ingress: Position.Left,
});
const zuploApiNode = createZuploApiNode({
  position: { x: 170, y: 90 },
  ingress: Position.Left,
  egress: Position.Right,
});
const zuploVpcNode = createVpcGroupNode({
  position: { x: 150, y: 40 },
  label: "Zuplo VPC",
  width: 180,
  height: 100,
});
const customerVpcNode = createVpcGroupNode({
  position: { x: 400, y: 40 },
  label: "Customer VPC",
  width: 180,
  height: 100,
});

const initialNodes: DiagramNode[] = [
  clientNode,
  backendNode,
  zuploApiNode,
  zuploVpcNode,
  customerVpcNode,
];

const initialEdges: Edge[] = [
  createIngressEdgressEdge({ egress: clientNode, ingress: zuploApiNode }),
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
