import { Handle, HandleProps } from "@xyflow/react";
import React from "react";
import { BaseNode } from "./BaseNode";

export type CustomHandleProps = Pick<HandleProps, "position" | "type" | "id">;

const variants = {
  default: "text-black",
  blue: "bg-blue-500",
  zuplo: "bg-[#ff00bd] text-white",
};

export type NodeVariant = keyof typeof variants;

export const CustomNode = React.memo(
  ({
    data,
  }: {
    data: {
      variant: NodeVariant;
      label: string;
      handles?: CustomHandleProps[];
    };
  }) => {
    return (
      <BaseNode
        title={data.label}
        className={variants[data.variant ?? "default"]}
      >
        <div className="text-sm text-[0.6rem]">{data.label}</div>
        {data.handles?.map((handle, i) => (
          <Handle
            key={i}
            {...handle}
            isConnectable={false}
            className="!bg-gray-300"
          />
        ))}
      </BaseNode>
    );
  },
);
