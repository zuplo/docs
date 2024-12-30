import React from "react";
import { Diagram, DiagramBuilder, Position } from "./common/index.js";

export default function ManagedDedicatedMultiRegionArchitecture() {
  const props = React.useMemo(() => {
    const y = 50;
    const x = 0;

    const space = 100;

    const builder = new DiagramBuilder([
      {
        position: { x, y },
        label: "Source Control",
        type: "custom",
      },
      {
        position: { x: x + space * 2, y },
        label: "Control Plane",
        variant: "zuplo",
      },
      {
        label: "Zuplo API Gateway (Production)",
        variant: "zuplo",
        position: { x: x + space * 4, y: y - 60 },
        width: 160,
      },
      {
        label: "Zuplo API Gateway (Non-Production)",
        variant: "zuplo",
        position: { x: x + space * 4, y: y + 40 },
        width: 160,
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
      { label: "Zuplo API Gateway (Production)", position: Position.Left },
      { animate: true, icon: "square-code", duration },
    );
    builder.connect(
      { label: "Control Plane", position: Position.Right },
      { label: "Zuplo API Gateway (Non-Production)", position: Position.Left },
      { animate: true, icon: "square-code", duration },
    );

    return builder.getProps();
  }, []);

  return <Diagram {...props} className="h-56" />;
}
