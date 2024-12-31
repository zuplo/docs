import React from "react";
import { Diagram, DiagramBuilder, Position } from "./common/index.js";

export default function ManagedDedicatedArchitecture() {
  const props = React.useMemo(() => {
    const y = 90;
    const builder = new DiagramBuilder([
      {
        label: "Client",
        type: "custom",
        position: { x: 10, y },
      },
      {
        label: "Zuplo API Gateway",
        variant: "zuplo",
        position: { x: 190, y },
      },
      {
        label: "Backend",
        type: "custom",
        position: { x: 450, y },
      },
      {
        position: { x: 210, y: y + 80 },
        label: "Gateway Services",
        variant: "zuplo",
      },
      {
        position: { x: 10, y: y - 80 },
        label: "Control Plane",
        variant: "zuplo",
      },
      {
        position: { x: 150, y: y - 50 },
        label: "Dedicated VPC",
        type: "labeledGroup",
        width: 200,
        height: 100,
      },
      {
        position: { x: 400, y: y - 50 },
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
    builder.connect(
      { label: "Zuplo API Gateway", position: Position.Bottom },
      { label: "Gateway Services", position: Position.Top },
      { animate: false },
    );
    builder.connect(
      { label: "Control Plane", position: Position.Right },
      { label: "Zuplo API Gateway", position: Position.Top },
      { animate: false },
    );

    return builder.getProps();
  }, []);

  return <Diagram {...props} className="h-56" />;
}
