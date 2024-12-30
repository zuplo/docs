import React from "react";
import { Diagram, DiagramBuilder, Position } from "./common/index.js";

export default function ManagedDedicatedDeploymentArchitecture() {
  const props = React.useMemo(() => {
    const y = 40;
    const x = 0;
    const space = 200;

    const builder = new DiagramBuilder([
      {
        position: { x, y },
        label: "Source Control",
        type: "custom",
      },
      {
        position: { x: x + space, y },
        label: "Control Plane",
        variant: "zuplo",
      },
      {
        position: { x: x + space * 2, y: y + 50 },
        label: "Dev Portal",
        variant: "zuplo",
      },
      {
        label: "Zuplo API Gateway",
        variant: "zuplo",
        position: { x: x + space * 2, y: y },
      },
      {
        position: { x: x + space * 2 - 30, y: y - 50 },
        label: "Dedicated VPC",
        type: "labeledGroup",
        width: 200,
        height: 150,
      },
    ]);

    const duration = 4;
    builder.connect(
      { label: "Source Control", position: Position.Right },
      { label: "Control Plane", position: Position.Left },
      { animate: true, icon: "square-code", duration },
    );
    builder.connect(
      { label: "Control Plane", position: Position.Right },
      { label: "Zuplo API Gateway", position: Position.Left },
      { animate: true, icon: "square-code", duration },
    );
    builder.connect(
      { label: "Control Plane", position: Position.Bottom },
      { label: "Dev Portal", position: Position.Left },
      { animate: true, icon: "square-code", duration },
    );

    return builder.getProps();
  }, []);
  return <Diagram {...props} className="h-56" />;
}
