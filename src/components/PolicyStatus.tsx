import Admonition from "@theme/Admonition";
import React from "react";
import data from "../../node_modules/@zuplo/policies/policies.v2.json";

const PolicyStatus = ({ policy }: { policy: string }) => {
  const config = data.policies.find((p) => p.id === policy);
  if (!policy) {
    throw new Error(`Could not find policy '${policy}'`);
  }

  if (config.isPreview) {
    return (
      <Admonition type="caution">
        <p>
          This policy is in private beta. If you would like to use this please
          reach out to us:{" "}
          <a href="mailto:whatzup@zuplo.com">whatzup@zuplo.com</a>
        </p>
      </Admonition>
    );
  }
  return null;
};

export default PolicyStatus;
