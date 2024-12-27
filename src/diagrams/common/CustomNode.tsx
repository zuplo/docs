import { Handle, HandleProps } from "@xyflow/react";
import React, { memo } from "react";
import { BaseNode } from "./BaseNode";
type _react = typeof React;

export type CustomHandleProps = Pick<HandleProps, "position" | "type" | "id">;

export const CustomNode = memo(
  ({ data }: { data: { label: string; handles?: CustomHandleProps[] } }) => {
    return (
      <BaseNode title={data.label}>
        <div className="text-sm text-[0.6rem] text-black">{data.label}</div>
        {data.handles?.map((handle, i) => (
          <Handle
            key={i}
            {...handle}
            isConnectable={false}
            className="w-16 !bg-gray-300"
          />
        ))}
      </BaseNode>
    );
  },
);
