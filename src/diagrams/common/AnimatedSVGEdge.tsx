import {
  BaseEdge,
  Edge,
  getSmoothStepPath,
  type EdgeProps,
} from "@xyflow/react";
import Icon, { type IconName } from "./Icon";

export function AnimatedSVGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<Edge<{ icon: IconName; duration?: number }>>) {
  const icon = data?.icon;
  if (!icon) {
    throw new Error("Icon is required for AnimatedSVGEdge");
  }

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const offsetX = -12;
  const offsetY = -12;
  const bgSize = 20;
  const bgOffset = bgSize / 2;

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <g>
        <animateMotion
          dur={data.duration ? `${data.duration}s` : "2s"}
          repeatCount="indefinite"
          path={edgePath}
        />
        <g transform={`translate(${offsetX}, ${offsetY})`}>
          <rect
            x={bgOffset - 8}
            y={bgOffset - 8}
            width={bgSize}
            height={bgSize}
            fill="#F7F9FB"
            rx="4"
          />
          <foreignObject x="0" y="0" width="24" height="24">
            <Icon name={icon} />
          </foreignObject>
        </g>
      </g>
    </>
  );
}
