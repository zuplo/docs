import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import React from "react";

// here just to keep the react import as we use this in a script outside of
// next.js
const version = React.version;

type SchemaRecord = {
  [key: string]: JSONSchema7;
};

export const OptionProperty = ({ schema }: { schema: JSONSchema7 }) => {
  isObjectSchema(schema);

  if (schema.type === "object" && schema.properties) {
    return <ObjectSchema schema={schema} />;
  } else if (schema.type === "array" && schema.items) {
    return <ArraySchema schema={schema} />;
  }
};

function ObjectSchema({ schema }: { schema: JSONSchema7 }) {
  return (
    <ul>
      {Object.entries(schema.properties as SchemaRecord).map(([key, value]) => (
        <li key={key}>
          <code>{key}</code> <OptionType value={value} />
          {schema.required?.includes(key) && (
            <span className="font-semibold">{" (Required)"}</span>
          )}
          {" - "}
          <div
            className="inline"
            dangerouslySetInnerHTML={{ __html: value.description ?? "" }}
          />
          {value.type === "string" && value.enum && (
            <span>
              {" "}
              Allowed values are{" "}
              {value.enum.map((v, i) => {
                const comma = i < value.enum!.length - 1 ? ", " : null;
                const and = i === value.enum!.length - 1 ? "and " : null;
                return (
                  <span key={i}>
                    {and}
                    <code>{v!.toString()}</code>
                    {comma}
                  </span>
                );
              })}
              .
            </span>
          )}
          {value.default !== undefined &&
            value.default !== null &&
            value.default !== "" && (
              <span>
                {" "}
                Defaults to <code>{JSON.stringify(value.default)}</code>.
              </span>
            )}
          <OptionProperty schema={value} />
        </li>
      ))}
    </ul>
  );
}

function ArraySchema({ schema }: { schema: JSONSchema7 }) {
  const items = schema.items as JSONSchema7;
  if (items.type === "object" && items.properties) {
    return <ObjectSchema schema={items} />;
  }
  return null;
}

function OptionType({ value }: { value: JSONSchema7 }) {
  let typeString: string | undefined;
  if (value.type === "array") {
    const arrayType = (value.items as JSONSchema7 | undefined)?.type;
    typeString = arrayType ? `${arrayType}[]` : "array";
  } else if (value.type) {
    typeString = value.type.toString();
  } else if (value.oneOf) {
    typeString = (value.oneOf as JSONSchema7[])
      .map((o: JSONSchema7) => {
        if (o.items && (o.items as JSONSchema7).type) {
          return `${(o.items as JSONSchema7).type!.toString()}[]`;
        }
        return o.type?.toString();
      })
      .filter((t) => t !== undefined)
      .join(" | ");
  }
  if (typeString) {
    return <span className="text-green-600">{` <${typeString}>`}</span>;
  }
}

export function isObjectSchema(val: unknown): asserts val is object {
  if (typeof val === "boolean") {
    throw new Error("Invalid schema");
  }
}

export const PolicyOptions = ({
  schema,
  policyId,
}: {
  schema: JSONSchema7Definition;
  policyId: string;
}) => {
  isObjectSchema(schema);
  const { handler } = schema.properties!;
  isObjectSchema(handler);
  const { properties } = handler;
  const { module: handlerModule, export: handlerExport, options } = properties!;
  isObjectSchema(handlerModule);
  isObjectSchema(handlerExport);
  return (
    <div>
      <h3 id="policy-configuration">Policy Configuration</h3>
      <ul>
        <li>
          <code>name</code> <span className="text-green-600">{"<string>"}</span>{" "}
          - The name of your policy instance. This is used as a reference in
          your routes.
        </li>
        <li>
          <code>policyType</code>{" "}
          <span className="text-green-600">{"<string>"}</span> - The identifier
          of the policy. This is used by the Zuplo UI. Value should be{" "}
          <code>{policyId}</code>.
        </li>
        <li>
          <code>handler.export</code>{" "}
          <span className="text-green-600">{"<string>"}</span> - The name of the
          exported type. Value should be{" "}
          <code>{handlerExport.const!.toString()}</code>.
        </li>
        <li>
          <code>handler.module</code>{" "}
          <span className="text-green-600">{"<string>"}</span> - The module
          containing the policy. Value should be{" "}
          <code>{handlerModule.const!.toString()}</code>.
        </li>
        {options && Object.keys(options).length > 0 ? (
          <li>
            <code>handler.options</code>{" "}
            <span className="text-green-600">{"<object>"}</span> - The options
            for this policy. <a href="#policy-options">See Policy Options</a>{" "}
            below.
          </li>
        ) : null}
      </ul>
      {options && Object.keys(options).length > 0 ? (
        <>
          <h3 id="policy-options">Policy Options</h3>
          <p>
            The options for this policy are specified below. All properties are
            optional unless specifically marked as required.
          </p>
          <OptionProperty schema={options as JSONSchema7} />
        </>
      ) : null}
    </div>
  );
};
