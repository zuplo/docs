import { Edge, Node, Position, XYPosition } from "@xyflow/react";
import { CustomHandleProps } from "./CustomNode";
import { NodeType } from "./Diagram";

interface CustomNode extends Pick<Node, "id" | "position" | "style"> {
  label: string;
  type: NodeType;
  variant?: string;
  handles: CustomHandleProps[];
}

export interface DiagramNode {
  label: string;
  type?: NodeType;
  position: XYPosition;
  width?: number;
  height?: number;
  variant?: string;
}

export class DiagramBuilder {
  edges: Edge[] = [];
  nodes: CustomNode[];

  constructor(nodes: DiagramNode[]) {
    this.nodes = nodes.map(
      (node): CustomNode => ({
        id: node.label,
        type: node.type ?? "custom",
        position: node.position,
        handles: [],
        label: node.label,
        variant: node.variant,
        style: {
          width: node.width,
          height: node.height,
          ...(node.type === "labeledGroup" ? { zIndex: -1 } : { zIndex: 0 }),
        },
      }),
    );
  }

  connect(
    source: { label: string; position: Position },
    target: { label: string; position: Position },
    options?: { animate?: boolean; icon?: string; duration?: number },
  ) {
    const sourceNode = this.nodes.find((n) => n.label === source.label);
    if (!sourceNode) {
      throw new Error(
        `Could not find source node with label '${source.label}'.`,
      );
    }
    const targetNode = this.nodes.find((n) => n.label === target.label);
    if (!targetNode) {
      throw new Error(
        `Could not find target node with label '${target.label}'.`,
      );
    }

    let targetHandle = targetNode.handles.find(
      (h) => h.type === "target" && h.position == target.position,
    );
    if (!targetHandle) {
      targetHandle = {
        id: `target: ${target.label} (${target.position})`,
        type: "target",
        position: target.position,
      };
      targetNode.handles.push(targetHandle);
    }
    let sourceHandle = sourceNode.handles.find(
      (h) => h.type === "source" && h.position == target.position,
    );
    if (!sourceHandle) {
      sourceHandle = {
        id: `source: ${source.label} (${source.position})`,
        type: "source",
        position: source.position,
      };
      sourceNode.handles.push(sourceHandle);
    }

    const edge: Edge = {
      id: `${sourceNode.id} -> ${targetNode.id}`,
      type: options?.icon ? "animatedSvg" : "smoothstep",
      source: sourceNode.id,
      target: targetNode.id,
      targetHandle: targetHandle.id,
      sourceHandle: sourceHandle.id,
      // Never animate if an icon is provided it looks ugly and causes
      // elements in side of the icon to animate also
      animated: options?.icon
        ? false
        : typeof options?.animate === "boolean"
          ? options.animate
          : true,
      data: { icon: options?.icon, duration: options?.duration },
    };

    this.edges.push(edge);
  }

  getProps() {
    return {
      nodes: this.nodes.map(
        ({
          label,
          handles,
          variant,
          ...node
        }): Node<{
          label: string;
          handles: CustomHandleProps[];
          variant?: string;
        }> => ({
          ...node,
          data: {
            label,
            handles,
            variant,
          },
        }),
      ),
      edges: this.edges,
    };
  }
}
