import KeyIcon from "@site/static/img/key.svg";
import Admonition from "@theme/Admonition";
import React from "react";

const PolicyStatus: React.FC<{ isPreview: boolean; isPaidAddOn: boolean }> = ({
  isPreview,
  isPaidAddOn,
}) => {
  if (isPaidAddOn) {
    return (
      <div>
        <Admonition type="info" icon={<KeyIcon />} title="Paid Add On">
          <p>
            This policy is only available as a paid add-on. If you would like to
            try this please reach out to us:{" "}
            <a href="mailto:sales@zuplo.com">sales@zuplo.com</a>
          </p>
        </Admonition>
      </div>
    );
  }
  if (isPreview) {
    return (
      <div>
        <Admonition type="caution" title="Early Access">
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
