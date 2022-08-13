import React from "react";

type PolicyProperties = Record<
  string,
  { description: string; properties?: PolicyProperties }
>;

// NOTE: This component is used to generate policy HTML in the policy script
// as such it CANNOT include css module imports

export const OptionProperties = ({
  properties,
}: {
  properties: PolicyProperties;
}) => (
  <ul>
    {Object.entries(properties).map(([key, value]) => (
      <li key={key}>
        <code>{key}</code>{" "}
        <div dangerouslySetInnerHTML={{ __html: value.description }} />
        {value.properties ? (
          <OptionProperties properties={value.properties} />
        ) : undefined}
      </li>
    ))}
  </ul>
);
