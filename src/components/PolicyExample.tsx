import CodeBlock from "@theme/CodeBlock";
import data from "@zuplo/policies/policies.v3.json";
import React from "react";

const PolicyExample = ({
  policy,
  example,
}: {
  policy: string;
  example?: string;
}) => {
  const schema = data.policies[policy];
  if (!schema) {
    throw new Error("Invalid policy");
  }

  const { examples } = schema.properties.handler;
  if (!Array.isArray(examples) || examples.length === 0) {
    throw new Error(`There are no examples set for policy ${policy}`);
  }

  let handler: any;
  if (example) {
    handler = examples.find((e) => e._name === example);
    if (!handler) {
      throw new Error(
        `Could not location example ${example} for policy ${policy}`
      );
    }
  } else {
    handler = examples[0];
  }

  const copy = { ...handler };
  delete copy._name;

  const code = {
    name: `my-${policy}-policy`,
    policyType: policy,
    handler: copy,
  };

  return <CodeBlock language="json">{JSON.stringify(code, null, 2)}</CodeBlock>;
};

export default PolicyExample;
