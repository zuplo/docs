import { Handle, HandleProps } from "@xyflow/react";
import React, { memo } from "react";
import { BaseNode } from "./BaseNode";

type _react = typeof React;

export const ZuploApiNode = memo(
  ({ data }: { data: { handles?: Pick<HandleProps, "position">[] } }) => {
    return (
      <BaseNode title="Zuplo API Gateway" className="bg-[#ff00bd]">
        <div className="text-sm text-[0.6rem] text-white">
          Zuplo API Gateway
        </div>
        {data.handles?.map((handle, i) => (
          <Handle
            key={i}
            type="target"
            {...handle}
            isConnectable={false}
            className="!bg-gray-300"
          />
        ))}
      </BaseNode>
    );
  },
);
