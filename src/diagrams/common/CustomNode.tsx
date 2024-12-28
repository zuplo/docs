import { Handle, HandleProps } from "@xyflow/react";
import React from "react";
import { BaseNode } from "./BaseNode";

export type CustomHandleProps = Pick<HandleProps, "position" | "type" | "id">;

export const CustomNode = React.memo(
  ({ data }: { data: { label: string; handles?: CustomHandleProps[] } }) => {
    return (
      <BaseNode title={data.label}>
        <div className="text-sm text-[0.6rem] text-black">{data.label}</div>
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
