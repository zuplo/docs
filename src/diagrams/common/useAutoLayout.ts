import {
  type Edge,
  type Node,
  useNodesInitialized,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import React, { useEffect } from "react";
type _react = typeof React;

import layoutAlgorithms, { type LayoutAlgorithmOptions } from "./algorithms";
import { getSourceHandlePosition, getTargetHandlePosition } from "./utils.js";

export type LayoutOptions = {
  algorithm: keyof typeof layoutAlgorithms;
} & LayoutAlgorithmOptions;

function useAutoLayout(options: LayoutOptions) {
  const { setNodes, setEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  // Here we are storing a map of the nodes and edges in the flow. By using a
  // custom equality function as the second argument to `useStore`, we can make
  // sure the layout algorithm only runs when something has changed that should
  // actually trigger a layout change.
  const elements = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
    }),
    // The compare elements function will only update `elements` if something has
    // changed that should trigger a layout. This includes changes to a node's
    // dimensions, the number of nodes, or changes to edge sources/targets.
    compareElements,
  );

  useEffect(() => {
    // Only run the layout if there are nodes and they have been initialized with
    // their dimensions
    if (!nodesInitialized || elements.nodes.length === 0) {
      return;
    }

    // The callback passed to `useEffect` cannot be `async` itself, so instead we
    // create an async function here and call it immediately afterwards.
    const runLayout = async () => {
      const layoutAlgorithm = layoutAlgorithms[options.algorithm];
      // Pass in a clone of the nodes and edges so that we don't mutate the
      // original elements.
      const nodes = elements.nodes.map((node) => ({ ...node }));
      const edges = elements.edges.map((edge) => ({ ...edge }));

      const { nodes: nextNodes, edges: nextEdges } = await layoutAlgorithm(
        nodes,
        edges,
        options,
      );

      for (const node of nextNodes) {
        node.style = { ...node.style, opacity: 1 };
        node.sourcePosition = getSourceHandlePosition(options.direction);
        node.targetPosition = getTargetHandlePosition(options.direction);
      }

      for (const edge of edges) {
        edge.style = { ...edge.style, opacity: 1 };
      }

      setNodes(nextNodes);
      setEdges(nextEdges);
    };

    runLayout();
  }, [nodesInitialized, elements, options, setNodes, setEdges]);
}

export default useAutoLayout;

type Elements = {
  nodes: Array<Node>;
  edges: Array<Edge>;
};

function compareElements(xs: Elements, ys: Elements) {
  return compareNodes(xs.nodes, ys.nodes) && compareEdges(xs.edges, ys.edges);
}

function compareNodes(xs: Array<Node>, ys: Array<Node>) {
  // the number of nodes changed, so we already know that the nodes are not equal
  if (xs.length !== ys.length) return false;

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    // the node doesn't exist in the next state so it just got added
    if (!y) return false;
    // We don't want to force a layout change while a user might be resizing a
    // node, so we only compare the dimensions if the node is not currently
    // being resized.
    //
    // We early return here instead of using a `continue` because there's no
    // scenario where we'd want nodes to start moving around *while* a user is
    // trying to resize a node or move it around.
    if (x.resizing || x.dragging) return true;
    if (
      x.measured?.width !== y.measured?.width ||
      x.measured?.height !== y.measured?.height
    ) {
      return false;
    }
  }

  return true;
}

function compareEdges(xs: Array<Edge>, ys: Array<Edge>) {
  // the number of edges changed, so we already know that the edges are not equal
  if (xs.length !== ys.length) return false;

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    if (x.source !== y.source || x.target !== y.target) return false;
    if (x?.sourceHandle !== y?.sourceHandle) return false;
    if (x?.targetHandle !== y?.targetHandle) return false;
  }

  return true;
}
