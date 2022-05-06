import CodeBlock from "@theme/CodeBlock";
import React from "react";

const PolicyExample = ({
  schema,
  policyId,
  exampleName,
}: {
  schema: any;
  policyId: string;
  exampleName?: string;
}) => {
  const { examples } = schema.properties.handler;
  if (!Array.isArray(examples) || examples.length === 0) {
    throw new Error(`There are no examples set for policy ${policyId}`);
  }

  let handler: any;
  if (exampleName) {
    handler = examples.find((e) => e._name === exampleName);
    if (!handler) {
      throw new Error(
        `Could not location example ${exampleName} for policy ${policyId}`
      );
    }
  } else {
    handler = examples[0];
  }

  const copy = { ...handler };
  delete copy._name;

  const code = {
    name: `my-${policyId}-policy`,
    policyType: policyId,
    handler: copy,
  };

  return <CodeBlock language="json">{JSON.stringify(code, null, 2)}</CodeBlock>;
};

export default PolicyExample;
