import { DiagramNode, Edge } from "./common/Diagram.js";

export const createIngressEdgressEdge = ({
  egress,
  ingress,
}: {
  egress: DiagramNode;
  ingress: DiagramNode;
}): Edge => ({
  id: `edge-${egress.id}-${ingress.id}`,
  source: egress.id,
  target: ingress.id,
  targetHandle: "ingress",
  sourceHandle: "egress",
});
