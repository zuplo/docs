import React from "react";
import { Diagram, DiagramBuilder, Position } from "./common/index.js";

export default function ZuploIngressWithManagedDedicated() {
  const props = React.useMemo(() => {
    const builder = new DiagramBuilder([
      {
        label: "Client",
        position: { x: 10, y: 90 },
      },
      {
        label: "Backend",
        position: { x: 450, y: 90 },
      },
      {
        label: "Zuplo API Gateway",
        variant: "zuplo",
        position: { x: 170, y: 90 },
      },
      {
        position: { x: 150, y: 40 },
        label: "Dedicated VPC",
        type: "labeledGroup",
        width: 180,
        height: 100,
      },
      {
        position: { x: 400, y: 40 },
        label: "Customer VPC",
        type: "labeledGroup",
        width: 180,
        height: 100,
      },
    ]);

    builder.connect(
      { label: "Client", position: Position.Right },
      { label: "Zuplo API Gateway", position: Position.Left },
    );
    builder.connect(
      { label: "Zuplo API Gateway", position: Position.Right },
      { label: "Backend", position: Position.Left },
    );

    return builder.getProps();
  }, []);
  return <Diagram {...props} className="h-40" />;
}
