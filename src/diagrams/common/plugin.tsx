import React from "react";
import type { ZudokuPlugin } from "zudoku";

type _react = typeof React;

export const diagramPlugin = (): ZudokuPlugin => {
  return {
    getHead: () => {
      return <link rel="stylesheet" href="/docs/styles/diagrams.css"></link>;
    },
  };
};
