import { DiagramNode, Edge } from "../common/Diagram.js";

export const createIngressEdgressEdge = ({
  egress,
  ingress,
  animated = true,
}: {
  egress: DiagramNode;
  ingress: DiagramNode;
  animated?: boolean;
}): Edge => ({
  id: `edge-${egress.id}-${ingress.id}`,
  source: egress.id,
  target: ingress.id,
  targetHandle: "ingress",
  sourceHandle: "egress",
  animated,
});
