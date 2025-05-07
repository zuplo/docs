import React from "react";
import type { JSX } from "react/jsx-runtime";

type NodeModuleIssue = {
  name: string;
  notes: JSX.Element;
};

/**
 * This file contains the configuration for known issues with bundled modules.

 */
export const nodeModuleIssues: NodeModuleIssue[] = [
  {
    name: "@aws-sdk/client-lambda",
    notes: (
      <>
        This module does not function correctly. It cannot be used to call
        Lambda functions from a Zuplo function. It is here for utility purposes
        only. Consider the{" "}
        <a href="/docs/handlers/aws-lambda">AWS Lambda handler</a> instead.
      </>
    ),
  },
];
