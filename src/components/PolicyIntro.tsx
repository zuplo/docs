import Admonition from "@theme/Admonition";
import data from "@zuplo/policies/policies.v3.json";
import React from "react";

const PolicyIntro = ({ policy }: { policy: string }) => {
  const schema = data.policies[policy];
  if (!schema) {
    throw new Error(`Could not find policy '${policy}'`);
  }

  const description = <p>{schema.description}</p>;

  if (schema.isPreview) {
    return (
      <div>
        {description}
        <Admonition type="caution">
          <p>
            This policy is in private beta. If you would like to use this please
            reach out to us:{" "}
            <a href="mailto:whatzup@zuplo.com">whatzup@zuplo.com</a>
          </p>
        </Admonition>
      </div>
    );
  }
  return <div>{description}</div>;
};

export default PolicyIntro;
