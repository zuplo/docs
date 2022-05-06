import React from "react";
import styles from "./PolicyOptions.module.css";

type PolicyProperties = Record<
  string,
  { description: string; properties?: PolicyProperties }
>;

const OptionProperties = ({ properties }: { properties: PolicyProperties }) => (
  <ul>
    {Object.entries(properties).map(([key, value]) => (
      <li>
        <code>{key}</code>{" "}
        <div
          className={styles["description"]}
          dangerouslySetInnerHTML={{ __html: value.description }}
        />
        {value.properties ? (
          <OptionProperties properties={value.properties} />
        ) : undefined}
      </li>
    ))}
  </ul>
);

const PolicyOptions = ({
  schema,
  policyId,
}: {
  schema: any;
  policyId: string;
}) => {
  const { required, properties } = schema.properties.handler;
  // if (!Array.isArray(examples) || examples.length === 0) {
  // throw new Error(`There are no examples set for policy ${policy}`);
  // }

  return (
    <ul>
      <li>
        <code>name</code> the name of your policy instance. This is used as a
        reference in your routes.
      </li>
      <li>
        <code>policyType</code> the identifier of the policy. This is used by
        the Zuplo UI. Value should be <code>{policyId}</code>.
      </li>
      <li>
        <code>handler/export</code> The name of the exported type. Value should
        be <code>{properties.export.const}</code>.
      </li>
      <li>
        <code>handler/module</code> the module containing the policy. Value
        should be <code>{properties.module.const}</code>.
      </li>
      <li>
        <code>handler/options</code> The options for this policy:
        <OptionProperties properties={properties.options.properties} />
      </li>
    </ul>
  );
};

export default PolicyOptions;
