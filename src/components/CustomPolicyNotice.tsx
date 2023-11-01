import Admonition from "@theme/Admonition";
import React from "react";

export default function CustomPolicyNotice({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const href = id.endsWith("-inbound")
    ? "/docs/policies/custom-code-inbound"
    : "/docs/policies/custom-code-outbound";
  return (
    <div>
      <Admonition type="tip" title="Custom Policy Example">
        <p>
          Zuplo is extensible, so we don't have a built-in policy for {name},
          instead we have a template here that shows you how you can use your
          superpower (code) to achieve your goals. To learn more about custom
          policies{" "}
          <a href={href} target="_blank">
            see the documentation
          </a>
          .
        </p>
      </Admonition>
    </div>
  );
}
