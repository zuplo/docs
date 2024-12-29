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
  useEdgesState,
  useNodesState,
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

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const defaultOptions = {
  "elk.algorithm": "layered",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

export default function DiagramInner({
  className,
  nodes: initialNodes,
  edges: initialEdges,
  layout,
}: DiagramProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const layoutElements = useCallback(
    (instance: ReactFlowInstance<Node, Edge>, options: LayoutOptions) => {
      const layoutOptions = { ...defaultOptions, ...options };
      const graph: ElkNode = {
        id: "root",
        layoutOptions: layoutOptions,
        children: instance.getNodes().map((node) => ({
          ...node,
          width: node.measured?.width ?? node.width ?? 100,
          height: node.measured?.height ?? node.height ?? 100,
        })),
        edges: instance.getEdges() as unknown as ElkExtendedEdge[],
      };

      elk.layout(graph).then(({ children }) => {
        children!.forEach((node: any) => {
          node.position = { x: node.x, y: node.y };
        });

        instance.setNodes(children as Node[]);
        window.requestAnimationFrame(() => {
          instance.fitView();
        });
      });
    },
    [],
  );

  const fitViewOptions = useMemo(
    () => ({ padding: 0.3 }) satisfies FitViewOptions,
    [],
  );

  const onInit = useCallback((instance: ReactFlowInstance<Node, Edge>) => {
    if (layout) {
      layoutElements(instance, layout);
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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
