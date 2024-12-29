import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Edge,
  FitViewOptions,
  MarkerType,
  Node,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProps,
} from "@xyflow/react";
import ELK, {
  ElkExtendedEdge,
  ElkNode,
  LayoutOptions,
} from "elkjs/lib/elk.bundled.js";
import React, { useCallback, useMemo } from "react";
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
export type DiagramProps = Required<Pick<ReactFlowProps, "nodes" | "edges">> & {
  className: string;
  layout?: LayoutOptions;
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

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
  // "elk.direction": direction,
};

const elk = new ELK();

export default function Diagram({
  className,
  nodes: initialNodes,
  edges: initialEdges,
  layout,
}: DiagramProps) {
  const fitViewOptions = useMemo(
    () => ({ padding: 0.3 }) satisfies FitViewOptions,
    [],
  );

  const onInit = useCallback((instance: ReactFlowInstance<Node, Edge>) => {
    if (layout) {
      const options: LayoutOptions = { ...elkOptions };

      const isHorizontal = options["elk.direction"] === "RIGHT";
      const graph: ElkNode = {
        id: "root",
        layoutOptions: options,
        children: initialNodes.map((node) => ({
          ...node,
          // Adjust the target and source handle positions based on the layout
          // direction.
          targetPosition: isHorizontal ? "left" : "top",
          sourcePosition: isHorizontal ? "right" : "bottom",

          // Hardcode a width and height for elk to use when layouting.
          width: 150,
          height: 50,
        })),
        edges: initialEdges as unknown as ElkExtendedEdge[],
      };

      elk
        .layout(graph)
        .then((layoutedGraph) => {
          const nodes = layoutedGraph.children?.map((node) => ({
            ...node,
            // React Flow expects a position property on the node instead of `x`
            // and `y` fields.
            position: { x: node.x, y: node.y },
          }));
          instance.setNodes(nodes as unknown as Node[]);
          instance.setEdges(layoutedGraph.edges as unknown as Edge[]);
        })
        .catch(console.error);

      window.requestAnimationFrame(() => instance.fitView(fitViewOptions));
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => instance.fitView(fitViewOptions));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={className}>
      <ReactFlow
        onInit={onInit}
        autoFocus={true}
        nodeTypes={nodeTypes}
        nodes={initialNodes}
        edges={initialEdges}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        proOptions={proOptions}
        zoomOnPinch={true}
        zoomOnScroll={false}
        contentEditable={false}
        fitView
        fitViewOptions={fitViewOptions}
        attributionPosition="top-right"
        className="rounded-md"
        style={{
          backgroundColor: "#F7F9FB",
          fontWeight: 400,
          borderWidth: "1px",
        }}
      >
        <Controls showInteractive={false} fitViewOptions={fitViewOptions} />
        <Background color="#ccc" variant={BackgroundVariant.Dots} gap={10} />
      </ReactFlow>
    </div>
  );
}
