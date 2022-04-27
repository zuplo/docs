import CodeBlock from "@theme/CodeBlock";
import React from "react";
import data from "./policies.json";

const PolicyConfig = ({ id }: { id: string }) => {
  const policy = data.find((p) => p.id === id);
  if (!policy) {
    throw new Error("Invalid policy");
  }

  const code = {
    name: "your-policy-name",
    policyType: policy.id,
    handler: policy.defaultHandler,
  };

  return <CodeBlock language="json">{JSON.stringify(code, null, 2)}</CodeBlock>;
};

export default PolicyConfig;
