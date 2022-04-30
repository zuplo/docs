import CodeBlock from "@theme/CodeBlock";
import React from "react";
import data from "../../node_modules/@zuplo/policies/policies.v2.json";

const PolicyConfig = ({ id }: { id: string }) => {
  const policy = data.policies.find((p) => p.id === id);
  if (!policy) {
    throw new Error(`Could not find policy '${id}'`);
  }

  const code = {
    name: "your-policy-name",
    policyType: policy.id,
    handler: policy.defaultHandler,
  };

  return <CodeBlock language="json">{JSON.stringify(code, null, 2)}</CodeBlock>;
};

export default PolicyConfig;
