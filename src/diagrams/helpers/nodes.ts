import { Position, XYPosition } from "@xyflow/react";
import { CustomHandleProps } from "../common/CustomNode.js";
import { DiagramNode } from "../common/Diagram.js";

export const createClient = ({
  position,
}: {
  position: XYPosition;
}): DiagramNode => ({
  id: "client",
  type: "custom",
  position,
  data: {
    label: "Client",
    handles: [
      {
        id: "egress",
        type: "source",
        position: Position.Right,
      },
    ],
  },
});

export const createBackend = ({
  position,
  ingress,
}: {
  position: XYPosition;
  ingress: Position;
}): DiagramNode => ({
  id: "backend",
  type: "custom",
  position,
  data: {
    label: "Backend",
    handles: [
      {
        id: "ingress",
        type: "target",
        position: ingress,
      },
    ],
  },
});

export const createCustomNode = ({
  position,
  egress,
  ingress,
  label,
}: {
  position: XYPosition;
  egress?: Position;
  ingress?: Position;
  label: string;
}): DiagramNode => ({
  id: `node-${label.toLowerCase().replaceAll(" ", "-")}`,
  type: "custom",
  position,
  data: {
    label,
    handles: [
      ...(ingress
        ? [
            {
              id: "ingress",
              type: "target",
              position: ingress,
            } satisfies CustomHandleProps,
          ]
        : []),
      ...(egress
        ? [
            {
              id: "egress",
              type: "source",
              position: egress,
            } satisfies CustomHandleProps,
          ]
        : []),
    ],
  },
});

export const createZuploApiNode = ({
  position,
  egress,
  ingress,
}: {
  position: XYPosition;
  egress: Position;
  ingress: Position;
}): DiagramNode => ({
  id: "zuplo-api",
  type: "zuplo",
  position,
  style: { zIndex: 20 },
  data: {
    label: "Hello",
    handles: [
      {
        id: "ingress",
        type: "target",
        position: ingress,
      },
      {
        id: "egress",
        type: "source",
        position: egress,
      },
    ],
  },
});

export const createVpcGroupNode = ({
  position,
  label,
  width,
  height,
}: {
  position: XYPosition;
  label: string;
  width: number;
  height: number;
}) => ({
  id: `vpc-group-${label.toLowerCase().replaceAll(" ", "-")}`,
  data: { label },
  position,
  style: { width, height, zIndex: -1 },
  type: "labeledGroup",
});
