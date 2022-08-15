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
  const { examples } = schema.properties.handler as any;
  if (!Array.isArray(examples) || examples.length === 0) {
    throw new Error(`There are no examples set for policy ${policyId}`);
  }

  const copy = { ...examples[0] };
  delete copy._name;

  const code = {
    name: `my-${policyId}-policy`,
    policyType: policyId,
    handler: copy,
  };

  return <CodeBlock language="json">{JSON.stringify(code, null, 2)}</CodeBlock>;
};

export default PolicyExample;
