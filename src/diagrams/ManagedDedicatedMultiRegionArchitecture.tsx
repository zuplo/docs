import React from "react";
import { Diagram, DiagramBuilder, Position } from "./common/index.js";

export default function ManagedDedicatedMultiRegionArchitecture() {
  const props = React.useMemo(() => {
    const y = 90;
    const x = 0;

    const space = 100;

    const builder = new DiagramBuilder([
      {
        label: "Client",
        type: "custom",
        position: { x, y },
      },
      {
        label: "Load Balancer",
        type: "custom",
        position: { x: x + space, y },
      },
      {
        label: "Zuplo API Gateway (Region 1)",
        variant: "zuplo",
        position: { x: x + space * 3, y: y - 40 },
        width: 210,
      },
      {
        label: "Zuplo API Gateway (Region 2)",
        variant: "zuplo",
        position: { x: x + space * 3, y },
        width: 210,
      },
      {
        label: "Zuplo API Gateway (Region 3)",
        variant: "zuplo",
        position: { x: x + space * 3, y: y + 40 },
        width: 210,
      },
    ]);

    builder.connect(
      { label: "Client", position: Position.Right },
      { label: "Load Balancer", position: Position.Left },
    );
    [1, 2, 3].forEach((region) => {
      builder.connect(
        { label: "Load Balancer", position: Position.Right },
        {
          label: `Zuplo API Gateway (Region ${region})`,
          position: Position.Left,
        },
      );
    });

    return builder.getProps();
  }, []);

  return <Diagram {...props} className="h-56" />;
}
