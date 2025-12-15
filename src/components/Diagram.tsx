import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
import {
  Children,
  isValidElement,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// Fixed node dimensions for consistent layout
const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;

// Sequence diagram dimensions
const ACTOR_WIDTH = 120;
const ACTOR_HEADER_HEIGHT = 30;
const ACTOR_SPACING = 200;
const MESSAGE_HEIGHT = 80;
const MESSAGE_BOX_WIDTH = 180;
const MESSAGE_BOX_HEIGHT = 60;

// Variant colors for borders/lines
const variantColors: Record<string, string> = {
  default: "#9ca3af",
  blue: "#3b82f6",
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#eab308",
  zuplo: "#ff00bd",
};

// Node variants using solid fills with colored borders
const nodeVariants: Record<string, string> = {
  default: "bg-white border-gray-300 text-gray-700",
  blue: "bg-white border-blue-500 text-gray-700",
  green: "bg-white border-green-500 text-gray-700",
  orange: "bg-white border-orange-500 text-gray-700",
  red: "bg-white border-red-500 text-gray-700",
  yellow: "bg-white border-yellow-500 text-gray-700",
  zuplo: "bg-white border-[#ff00bd] text-gray-700",
};

// Edge variants
const edgeVariants: Record<string, { stroke: string; markerColor: string }> = {
  default: { stroke: "#9ca3af", markerColor: "#9ca3af" },
  blue: { stroke: "#3b82f6", markerColor: "#3b82f6" },
  green: { stroke: "#22c55e", markerColor: "#22c55e" },
  orange: { stroke: "#f97316", markerColor: "#f97316" },
  red: { stroke: "#ef4444", markerColor: "#ef4444" },
  yellow: { stroke: "#eab308", markerColor: "#eab308" },
  zuplo: { stroke: "#ff00bd", markerColor: "#ff00bd" },
};

// Simple node component for flow diagrams
const SimpleNode = memo(
  ({ data }: { data: { label: string; variant?: string } }) => {
    const className =
      nodeVariants[data.variant ?? "default"] ?? nodeVariants.default;

    return (
      <div
        className={`flex items-center justify-center rounded-md border shadow-sm text-sm px-3 overflow-hidden ${className}`}
        style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
      >
        {/* Left handles */}
        <Handle
          id="left-target"
          type="target"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        <Handle
          id="left-source"
          type="source"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        {/* Right handles */}
        <Handle
          id="right-target"
          type="target"
          position={Position.Right}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        <Handle
          id="right-source"
          type="source"
          position={Position.Right}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        {/* Top handles */}
        <Handle
          id="top-target"
          type="target"
          position={Position.Top}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        <Handle
          id="top-source"
          type="source"
          position={Position.Top}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        {/* Bottom handles */}
        <Handle
          id="bottom-target"
          type="target"
          position={Position.Bottom}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        <Handle
          id="bottom-source"
          type="source"
          position={Position.Bottom}
          className="!bg-transparent !w-0 !h-0 !border-0 !min-w-0 !min-h-0"
        />
        <span className="text-center line-clamp-2 leading-tight whitespace-pre-line">
          {data.label.includes("\n")
            ? data.label
            : data.label.replace(/ (\([^)]+\))$/, "\n$1")}
        </span>
      </div>
    );
  },
);
SimpleNode.displayName = "SimpleNode";

// Actor header node for sequence diagrams
const ActorNode = memo(
  ({ data }: { data: { label: string; variant?: string } }) => {
    const color =
      variantColors[data.variant ?? "default"] ?? variantColors.default;

    return (
      <div
        className="flex items-center gap-2"
        style={{ width: ACTOR_WIDTH, height: ACTOR_HEADER_HEIGHT }}
      >
        <div
          className="w-1 rounded-full"
          style={{ backgroundColor: color, height: ACTOR_HEADER_HEIGHT }}
        />
        <span className="text-sm font-medium text-gray-700">{data.label}</span>
      </div>
    );
  },
);
ActorNode.displayName = "ActorNode";

// Lifeline node (thin vertical line under actor)
const LIFELINE_WIDTH = 1;
const LifelineNode = memo(({ data }: { data: { height: number } }) => {
  return (
    <div
      className="bg-gray-300"
      style={{
        height: data.height,
        width: LIFELINE_WIDTH,
      }}
    />
  );
});
LifelineNode.displayName = "LifelineNode";

// Activation bar node (thick colored segment on lifeline - overlays the lifeline)
const ACTIVATION_WIDTH = 3;
const ActivationNode = memo(
  ({
    data,
  }: {
    data: { variant?: string; height: number; side: "left" | "right" };
  }) => {
    const color =
      variantColors[data.variant ?? "default"] ?? variantColors.default;

    // Handle position depends on which side the arrow connects from
    const handlePosition =
      data.side === "left" ? Position.Right : Position.Left;

    return (
      <div
        className="rounded-sm"
        style={{
          backgroundColor: color,
          height: data.height,
          width: ACTIVATION_WIDTH,
        }}
      >
        <Handle
          type="target"
          position={handlePosition}
          className="!bg-transparent !w-0 !h-0 !border-0"
          style={{ top: "50%" }}
        />
        <Handle
          type="source"
          position={handlePosition}
          className="!bg-transparent !w-0 !h-0 !border-0"
          style={{ top: "50%" }}
        />
      </div>
    );
  },
);
ActivationNode.displayName = "ActivationNode";

// Message box node for sequence diagrams
const MessageNode = memo(
  ({
    data,
  }: {
    data: { label: string; fromActor: string; toActor: string; width?: number };
  }) => {
    return (
      <div
        className="flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm p-3 text-sm text-gray-700 text-center overflow-hidden"
        style={{
          width: data.width ?? MESSAGE_BOX_WIDTH,
          height: MESSAGE_BOX_HEIGHT,
        }}
      >
        {/* Handles on both sides for bidirectional connections */}
        <Handle
          id="left-target"
          type="target"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0"
        />
        <Handle
          id="left-source"
          type="source"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0"
        />
        {/* Additional handles for self-messages at different vertical positions */}
        <Handle
          id="left-top-target"
          type="target"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0"
          style={{ top: "25%" }}
        />
        <Handle
          id="left-bottom-source"
          type="source"
          position={Position.Left}
          className="!bg-transparent !w-0 !h-0 !border-0"
          style={{ top: "75%" }}
        />
        <span className="line-clamp-2">{data.label}</span>
        <Handle
          id="right-target"
          type="target"
          position={Position.Right}
          className="!bg-transparent !w-0 !h-0 !border-0"
        />
        <Handle
          id="right-source"
          type="source"
          position={Position.Right}
          className="!bg-transparent !w-0 !h-0 !border-0"
        />
      </div>
    );
  },
);
MessageNode.displayName = "MessageNode";

// Invisible spacer node for balancing layout bounds
const SpacerNode = memo(
  ({ data }: { data: { width?: number; height?: number } }) => {
    return (
      <div
        style={{
          width: data.width ?? ACTOR_WIDTH,
          height: data.height ?? 1,
          pointerEvents: "none",
        }}
      />
    );
  },
);
SpacerNode.displayName = "SpacerNode";

// Group node for containing other nodes (e.g., VPC)
// Using React Flow's recommended sub-flow pattern
const GroupNode = memo(({ data }: { data: { label: string } }) => {
  return (
    <div className="absolute top-1 left-2 text-xs text-gray-500 font-medium">
      {data.label}
    </div>
  );
});
GroupNode.displayName = "GroupNode";

const nodeTypes = {
  simple: SimpleNode,
  actor: ActorNode,
  lifeline: LifelineNode,
  activation: ActivationNode,
  message: MessageNode,
  spacer: SpacerNode,
  group: GroupNode,
};

// Variant types
type NodeVariant =
  | "default"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "yellow"
  | "zuplo";
type EdgeVariant =
  | "default"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "yellow"
  | "zuplo";

// Props for child components
interface DiagramNodeProps {
  id: string;
  children: ReactNode;
  variant?: NodeVariant;
}

interface DiagramEdgeProps {
  from: string;
  to: string;
  label?: string;
  type?: "straight" | "step" | "smoothstep";
  fromArrow?: boolean;
  toArrow?: boolean;
  variant?: EdgeVariant;
  fromSide?: "left" | "right" | "top" | "bottom";
  toSide?: "left" | "right" | "top" | "bottom";
  lineStyle?: "solid" | "dashed" | "dotted";
  animated?: boolean;
}

interface DiagramActorProps {
  id: string;
  children: ReactNode;
  variant?: NodeVariant;
}

interface DiagramMessageProps {
  from: string;
  to: string;
  children: ReactNode;
}

interface DiagramGroupProps {
  id: string;
  label: string;
  children: ReactNode;
}

interface DiagramProps {
  children: ReactNode;
  height?: string;
  direction?: "horizontal" | "vertical";
  showControls?: boolean;
  type?: "flow" | "sequence";
}

// Marker components (don't render, just carry data)
export function DiagramNode(_props: DiagramNodeProps): ReactElement | null {
  return null;
}
DiagramNode.displayName = "DiagramNode";

export function DiagramEdge(_props: DiagramEdgeProps): ReactElement | null {
  return null;
}
DiagramEdge.displayName = "DiagramEdge";

export function DiagramActor(_props: DiagramActorProps): ReactElement | null {
  return null;
}
DiagramActor.displayName = "DiagramActor";

export function DiagramGroup(_props: DiagramGroupProps): ReactElement | null {
  return null;
}
DiagramGroup.displayName = "DiagramGroup";

export function DiagramMessage(
  _props: DiagramMessageProps,
): ReactElement | null {
  return null;
}
DiagramMessage.displayName = "DiagramMessage";

// Extract text from children
function getLabel(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getLabel).join("");
  if (
    isValidElement<{ children?: ReactNode }>(children) &&
    children.props.children
  ) {
    return getLabel(children.props.children);
  }
  return "";
}

// Layout function that treats groups as units and stacks nodes within groups vertically
function getLayoutedElementsWithGroups(
  nodes: Node[],
  edges: Edge[],
  groups: Array<{ id: string; label: string; nodeIds: string[] }>,
  direction: "horizontal" | "vertical",
): { nodes: Node[]; groupNodes: Node[]; edges: Edge[] } {
  const isHorizontal = direction === "horizontal";

  // Create maps for quick lookup
  const nodeToGroup: Record<string, string> = {};
  groups.forEach((group) => {
    group.nodeIds.forEach((nodeId) => {
      nodeToGroup[nodeId] = group.id;
    });
  });

  // Find standalone nodes (not in any group)
  const standaloneNodes = nodes.filter((n) => !nodeToGroup[n.id]);

  // Create a meta-graph where each group is a single node
  // This determines the horizontal positioning of groups
  const metaGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  metaGraph.setGraph({
    rankdir: isHorizontal ? "LR" : "TB",
    nodesep: 60,
    ranksep: 120,
  });

  // Calculate group sizes based on number of nodes (stacked vertically)
  const groupSizes: Record<string, { width: number; height: number }> = {};
  groups.forEach((group) => {
    const nodeCount = group.nodeIds.length;
    const height =
      nodeCount * NODE_HEIGHT +
      (nodeCount - 1) * 20 + // spacing between nodes
      GROUP_PADDING * 2 +
      GROUP_LABEL_HEIGHT;
    groupSizes[group.id] = {
      width: NODE_WIDTH + GROUP_PADDING * 2,
      height: Math.max(
        height,
        NODE_HEIGHT + GROUP_PADDING * 2 + GROUP_LABEL_HEIGHT,
      ),
    };
  });

  // Add groups as meta-nodes
  groups.forEach((group) => {
    metaGraph.setNode(group.id, groupSizes[group.id]);
  });

  // Add standalone nodes
  standaloneNodes.forEach((node) => {
    metaGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges between groups/standalone nodes (not between individual nodes within groups)
  const addedMetaEdges = new Set<string>();
  edges.forEach((edge) => {
    const sourceGroup = nodeToGroup[edge.source] || edge.source;
    const targetGroup = nodeToGroup[edge.target] || edge.target;
    const metaEdgeKey = `${sourceGroup}->${targetGroup}`;

    // Only add edge if it connects different groups/nodes and hasn't been added
    if (sourceGroup !== targetGroup && !addedMetaEdges.has(metaEdgeKey)) {
      metaGraph.setEdge(sourceGroup, targetGroup);
      addedMetaEdges.add(metaEdgeKey);
    }
  });

  dagre.layout(metaGraph);

  // Position groups and their contained nodes
  const layoutedNodes: Node[] = [];
  const groupNodes: Node[] = [];

  groups.forEach((group) => {
    const metaNode = metaGraph.node(group.id);
    const groupX = metaNode.x - groupSizes[group.id].width / 2;
    const groupY = metaNode.y - groupSizes[group.id].height / 2;

    // Create group node
    groupNodes.push({
      id: group.id,
      type: "group",
      position: { x: groupX, y: groupY },
      data: { label: group.label },
      width: groupSizes[group.id].width,
      height: groupSizes[group.id].height,
      style: {
        width: groupSizes[group.id].width,
        height: groupSizes[group.id].height,
        backgroundColor: "rgba(240, 240, 240, 0.5)",
        borderRadius: 8,
        border: "2px dashed #d1d5db",
      },
      draggable: false,
      selectable: false,
    });

    // Position nodes within group vertically (stacked)
    group.nodeIds.forEach((nodeId, index) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const relativeX = GROUP_PADDING;
      const relativeY =
        GROUP_LABEL_HEIGHT + GROUP_PADDING + index * (NODE_HEIGHT + 20);

      layoutedNodes.push({
        ...node,
        parentId: group.id,
        extent: "parent",
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x: relativeX, y: relativeY },
      });
    });
  });

  // Position standalone nodes
  standaloneNodes.forEach((node) => {
    const metaNode = metaGraph.node(node.id);
    layoutedNodes.push({
      ...node,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: metaNode.x - NODE_WIDTH / 2,
        y: metaNode.y - NODE_HEIGHT / 2,
      },
    });
  });

  // Calculate absolute positions for edge handle determination
  const absolutePositions: Record<string, { x: number; y: number }> = {};

  // Standalone nodes have absolute positions directly
  standaloneNodes.forEach((node) => {
    const metaNode = metaGraph.node(node.id);
    absolutePositions[node.id] = {
      x: metaNode.x,
      y: metaNode.y,
    };
  });

  // Nodes in groups: absolute = group position + relative position
  groups.forEach((group) => {
    const metaNode = metaGraph.node(group.id);
    const groupX = metaNode.x - groupSizes[group.id].width / 2;
    const groupY = metaNode.y - groupSizes[group.id].height / 2;

    group.nodeIds.forEach((nodeId, index) => {
      const relativeX = GROUP_PADDING + NODE_WIDTH / 2;
      const relativeY =
        GROUP_LABEL_HEIGHT +
        GROUP_PADDING +
        index * (NODE_HEIGHT + 20) +
        NODE_HEIGHT / 2;
      absolutePositions[nodeId] = {
        x: groupX + relativeX,
        y: groupY + relativeY,
      };
    });
  });

  // Default handles based on direction, can be overridden by explicit fromSide/toSide on edges
  const defaultSourceHandle = isHorizontal ? "right-source" : "bottom-source";
  const defaultTargetHandle = isHorizontal ? "left-target" : "top-target";

  // Apply default handles to edges (explicit handles set during parsing take precedence)
  const updatedEdges = edges.map((edge) => ({
    ...edge,
    sourceHandle: edge.sourceHandle || defaultSourceHandle,
    targetHandle: edge.targetHandle || defaultTargetHandle,
  }));

  return { nodes: layoutedNodes, groupNodes, edges: updatedEdges };
}

// Group padding around contained nodes
const GROUP_PADDING = 20;
const GROUP_LABEL_HEIGHT = 24;

// Helper to check if element is a DiagramNode
function isDiagramNodeElement(
  element: ReactElement,
): element is ReactElement<DiagramNodeProps> {
  const type = element.type;
  const displayName =
    typeof type === "function" ? (type as any).displayName : null;
  return type === DiagramNode || displayName === "DiagramNode";
}

// Parse flow diagram children
function parseFlowDiagram(
  children: ReactNode,
  direction: "horizontal" | "vertical",
): { nodes: Node[]; edges: Edge[] } {
  const parsedNodes: Node[] = [];
  const parsedEdges: Edge[] = [];
  const parsedGroups: Array<{ id: string; label: string; nodeIds: string[] }> =
    [];

  // First pass: collect all nodes and groups
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const type = child.type;
    const displayName =
      typeof type === "function" ? (type as any).displayName : null;

    if (type === DiagramNode || displayName === "DiagramNode") {
      const props = child.props as DiagramNodeProps;
      parsedNodes.push({
        id: props.id,
        type: "simple",
        position: { x: 0, y: 0 },
        data: {
          label: getLabel(props.children),
          variant: props.variant,
        },
      });
    } else if (type === DiagramEdge || displayName === "DiagramEdge") {
      const props = child.props as DiagramEdgeProps;
      const showToArrow = props.toArrow !== false;
      const showFromArrow = props.fromArrow === true;
      const edgeStyle =
        edgeVariants[props.variant ?? "default"] ?? edgeVariants.default;

      // Determine strokeDasharray based on lineStyle
      let strokeDasharray: string | undefined;
      if (props.lineStyle === "dashed") {
        strokeDasharray = "5,5";
      } else if (props.lineStyle === "dotted") {
        strokeDasharray = "2,2";
      }

      parsedEdges.push({
        id: `${props.from}-${props.to}`,
        source: props.from,
        target: props.to,
        sourceHandle: props.fromSide ? `${props.fromSide}-source` : undefined,
        targetHandle: props.toSide ? `${props.toSide}-target` : undefined,
        type: props.type ?? "default",
        animated: props.animated,
        markerEnd: showToArrow
          ? { type: MarkerType.ArrowClosed, color: edgeStyle.markerColor }
          : undefined,
        markerStart: showFromArrow
          ? { type: MarkerType.ArrowClosed, color: edgeStyle.markerColor }
          : undefined,
        style: {
          stroke: edgeStyle.stroke,
          strokeWidth: 1.5,
          strokeDasharray,
        },
        label: props.label,
        labelStyle: { fontSize: 10, fill: "#6b7280", fontWeight: 400 },
        labelBgStyle: {
          fill: "#F7F9FB",
          fillOpacity: 0.9,
        },
        labelBgPadding: [2, 4] as [number, number],
      });
    } else if (type === DiagramGroup || displayName === "DiagramGroup") {
      const props = child.props as DiagramGroupProps;
      const groupNodeIds: string[] = [];

      // Extract nested DiagramNode elements
      Children.forEach(props.children, (groupChild) => {
        if (!isValidElement(groupChild)) return;
        if (isDiagramNodeElement(groupChild)) {
          const nodeProps = groupChild.props;
          groupNodeIds.push(nodeProps.id);
          parsedNodes.push({
            id: nodeProps.id,
            type: "simple",
            position: { x: 0, y: 0 },
            data: {
              label: getLabel(nodeProps.children),
              variant: nodeProps.variant,
            },
          });
        }
      });

      parsedGroups.push({
        id: props.id,
        label: props.label,
        nodeIds: groupNodeIds,
      });
    }
  });

  // Use compound graph layout when there are groups
  if (parsedGroups.length > 0) {
    const {
      nodes: layoutedNodes,
      groupNodes,
      edges,
    } = getLayoutedElementsWithGroups(
      parsedNodes,
      parsedEdges,
      parsedGroups,
      direction,
    );
    // Group nodes must come before their children in the array
    return { nodes: [...groupNodes, ...layoutedNodes], edges };
  }

  // Simple layout for diagrams without groups
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === "horizontal";
  const rankdir = isHorizontal ? "LR" : "TB";

  dagreGraph.setGraph({
    rankdir,
    nodesep: 50,
    ranksep: 80,
  });

  parsedNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  parsedEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = parsedNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  // Default handles based on direction, can be overridden by explicit fromSide/toSide on edges
  const defaultSourceHandle = isHorizontal ? "right-source" : "bottom-source";
  const defaultTargetHandle = isHorizontal ? "left-target" : "top-target";

  // Apply default handles to edges (explicit handles set during parsing take precedence)
  const updatedEdges = parsedEdges.map((edge) => ({
    ...edge,
    sourceHandle: edge.sourceHandle || defaultSourceHandle,
    targetHandle: edge.targetHandle || defaultTargetHandle,
  }));

  return { nodes: layoutedNodes, edges: updatedEdges };
}

// Parse sequence diagram children
function parseSequenceDiagram(children: ReactNode): {
  nodes: Node[];
  edges: Edge[];
} {
  const actors: Array<{ id: string; label: string; variant?: string }> = [];
  const messages: Array<{ from: string; to: string; label: string }> = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const type = child.type;
    const displayName =
      typeof type === "function" ? (type as any).displayName : null;

    if (type === DiagramActor || displayName === "DiagramActor") {
      const props = child.props as DiagramActorProps;
      actors.push({
        id: props.id,
        label: getLabel(props.children),
        variant: props.variant,
      });
    } else if (type === DiagramMessage || displayName === "DiagramMessage") {
      const props = child.props as DiagramMessageProps;
      messages.push({
        from: props.from,
        to: props.to,
        label: getLabel(props.children),
      });
    }
  });

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Calculate total height needed for lifelines
  const totalMessagesHeight = messages.length * MESSAGE_HEIGHT + 40;

  // Create actor positions map and variant map
  // Start at x=0 and let fitView handle centering (like Stripe does)
  const startX = 0;

  const actorPositions: Record<string, number> = {};
  const actorVariants: Record<string, string | undefined> = {};
  actors.forEach((actor, index) => {
    actorPositions[actor.id] = startX + index * ACTOR_SPACING;
    actorVariants[actor.id] = actor.variant;
  });

  // Add actor header nodes and thin lifelines
  // The actor header has a 4px wide colored bar, lifeline is 2px
  // Center them on the same axis
  const actorBarWidth = 4; // w-1 = 4px
  const lifelineOffset = (actorBarWidth - LIFELINE_WIDTH) / 2; // Center lifeline under actor bar

  actors.forEach((actor, index) => {
    const xPos = startX + index * ACTOR_SPACING;

    // Actor header
    nodes.push({
      id: `actor-${actor.id}`,
      type: "actor",
      position: { x: xPos, y: 10 },
      data: { label: actor.label, variant: actor.variant },
      width: ACTOR_WIDTH,
      height: ACTOR_HEADER_HEIGHT,
      draggable: false,
      selectable: false,
    });

    // Thin lifeline (gray, no variant color) - starts right below actor header, centered under the colored bar
    nodes.push({
      id: `lifeline-${actor.id}`,
      type: "lifeline",
      position: { x: xPos + lifelineOffset, y: 10 + ACTOR_HEADER_HEIGHT },
      data: { height: totalMessagesHeight },
      draggable: false,
      selectable: false,
    });
  });

  // Add invisible spacer node on the left to balance actor labels on the right
  // This ensures fitView centers the diagram properly
  nodes.push({
    id: "spacer-left",
    type: "spacer",
    position: { x: startX - ACTOR_WIDTH, y: 10 },
    data: { width: ACTOR_WIDTH, height: 1 },
    width: ACTOR_WIDTH,
    height: 1,
    draggable: false,
    selectable: false,
  });

  // Activation bar height (same as message box height)
  const ACTIVATION_HEIGHT = MESSAGE_BOX_HEIGHT;

  // Add message nodes with activation bars
  messages.forEach((message, index) => {
    const fromX = actorPositions[message.from];
    const toX = actorPositions[message.to];
    const fromVariant = actorVariants[message.from];
    const toVariant = actorVariants[message.to];
    const yPos = ACTOR_HEADER_HEIGHT + 50 + index * MESSAGE_HEIGHT;

    const isSelfMessage = message.from === message.to;
    const isLeftToRight = fromX < toX;

    // Position message box between the two lifelines
    const minX = Math.min(fromX, toX);
    const maxX = Math.max(fromX, toX);

    // Leave space for activation bars on each side
    const gap = 20; // Gap between activation bar and message box

    // Calculate standard message width (same for all messages including self-messages)
    // Use ACTOR_SPACING as the reference width for consistent sizing
    const standardMessageWidth = ACTOR_SPACING - ACTIVATION_WIDTH * 2 - gap * 2;

    // For self-messages, position to the right of the actor with same width as normal messages
    const messageX = isSelfMessage
      ? fromX + ACTIVATION_WIDTH + gap
      : minX + ACTIVATION_WIDTH + gap;
    const messageWidth = isSelfMessage
      ? standardMessageWidth
      : maxX - minX - ACTIVATION_WIDTH * 2 - gap * 2;

    const messageId = `message-${index}`;

    const finalMessageWidth = Math.max(messageWidth, 100);

    // Message box node
    nodes.push({
      id: messageId,
      type: "message",
      position: { x: messageX, y: yPos },
      data: {
        label: message.label,
        fromActor: message.from,
        toActor: message.to,
        width: finalMessageWidth,
      },
      width: finalMessageWidth,
      height: MESSAGE_BOX_HEIGHT,
      draggable: false,
      selectable: false,
    });

    // Create activation bars on the 'from' and 'to' lifelines
    const fromActivationId = `activation-${index}-from`;
    const toActivationId = `activation-${index}-to`;

    // Center activation bar on lifeline (lifeline is offset by lifelineOffset and has width LIFELINE_WIDTH)
    // Lifeline center is at xPos + lifelineOffset + LIFELINE_WIDTH/2
    // For activation bar to be centered: xPos + lifelineOffset + LIFELINE_WIDTH/2 - ACTIVATION_WIDTH/2
    const actorBarWidthLocal = 4; // w-1 = 4px
    const lifelineOffsetLocal = (actorBarWidthLocal - LIFELINE_WIDTH) / 2;
    const fromActivationX =
      fromX + lifelineOffsetLocal + LIFELINE_WIDTH / 2 - ACTIVATION_WIDTH / 2;
    const toActivationX =
      toX + lifelineOffsetLocal + LIFELINE_WIDTH / 2 - ACTIVATION_WIDTH / 2;

    // Determine which side is "from" and which is "to" for handle placement
    // For self-messages, the message box is to the right, so use "left" to put handle on right side
    const fromIsLeft = isSelfMessage ? true : fromX < toX;

    // From activation bar (on the source actor's lifeline)
    nodes.push({
      id: fromActivationId,
      type: "activation",
      position: { x: fromActivationX, y: yPos },
      data: {
        variant: fromVariant,
        height: ACTIVATION_HEIGHT,
        side: fromIsLeft ? "left" : "right",
      },
      draggable: false,
      selectable: false,
    });

    if (isSelfMessage) {
      // Self-message: single arrow pointing to the message box
      edges.push({
        id: `edge-${index}-self`,
        source: fromActivationId,
        target: messageId,
        targetHandle: "left-target",
        type: "straight",
        style: { stroke: "#9ca3af", strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9ca3af",
        },
      });
    } else {
      // To activation bar (on the target actor's lifeline)
      nodes.push({
        id: toActivationId,
        type: "activation",
        position: { x: toActivationX, y: yPos },
        data: {
          variant: toVariant,
          height: ACTIVATION_HEIGHT,
          side: fromIsLeft ? "right" : "left",
        },
        draggable: false,
        selectable: false,
      });

      // Draw edges: from activation → message → to activation
      // Arrow on each side of the message box
      // Handle IDs depend on direction
      const incomingHandle = isLeftToRight ? "left-target" : "right-target";
      const outgoingHandle = isLeftToRight ? "right-source" : "left-source";

      edges.push({
        id: `edge-${index}-from`,
        source: fromActivationId,
        target: messageId,
        targetHandle: incomingHandle,
        type: "straight",
        style: { stroke: "#9ca3af", strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9ca3af",
        },
      });
      edges.push({
        id: `edge-${index}-to`,
        source: messageId,
        sourceHandle: outgoingHandle,
        target: toActivationId,
        type: "straight",
        style: { stroke: "#9ca3af", strokeWidth: 1.5 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#9ca3af",
        },
      });
    }
  });

  return { nodes, edges };
}

// Main Diagram component
export function Diagram({
  children,
  height = "h-64",
  direction = "horizontal",
  showControls = false,
  type = "flow",
}: DiagramProps) {
  const { nodes, edges } = useMemo(() => {
    if (type === "sequence") {
      return parseSequenceDiagram(children);
    }
    return parseFlowDiagram(children, direction);
  }, [children, direction, type]);

  // Use onInit to call fitView after React Flow is fully initialized
  // This ensures proper centering on page load
  const onInit = useCallback((instance: ReactFlowInstance) => {
    // Small delay to ensure nodes are measured (especially group nodes)
    setTimeout(() => {
      instance.fitView({ padding: 0.2, minZoom: 0.5, maxZoom: 1.5 });
    }, 50);
  }, []);

  if (nodes.length === 0) {
    return <div className={height} />;
  }

  return (
    <div className={`${height} rounded-md overflow-hidden my-4`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onInit={onInit}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={showControls}
        zoomOnPinch={showControls}
        zoomOnDoubleClick={showControls}
        panOnScroll={showControls}
        panOnDrag={showControls}
        preventScrolling={false}
        style={{ backgroundColor: "#F7F9FB", borderWidth: "1px" }}
        className="rounded-md"
      >
        <Background color="#ccc" variant={BackgroundVariant.Dots} gap={15} />
        {showControls && <Controls showInteractive={false} />}
      </ReactFlow>
    </div>
  );
}

export default Diagram;
