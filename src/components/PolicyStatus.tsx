import Admonition from "@theme/Admonition";
import React from "react";

const PolicyStatus = ({ isPreview }: { isPreview: boolean }) => {
  if (isPreview) {
    return (
      <div>
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
  return null;
};

export default PolicyStatus;
