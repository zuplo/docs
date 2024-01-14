import { GenericLayout } from "@/components/GenericLayout";
import { MarkdocInline } from "@/components/MarkdocComponent";
import CustomPolicyNotice from "@/components/policies/CustomPolicyNotice";
import PolicyStatus from "@/components/policies/PolicyStatus";
import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fence } from "../../../components/Fence";

type SchemaRecord = {
  [key: string]: JSONSchema7;
};

const OptionProperty = ({ schema }: { schema: JSONSchema7 }) => {
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
          {value.description && (
            <MarkdocInline markdown={value.description ?? ""} />
          )}
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
          {value.default && (
            <span>
              {" "}
              Defaults to <code>{value.default.toString()}</code>.
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

function isObjectSchema(val: unknown): asserts val is object {
  if (typeof val === "boolean") {
    throw new Error("Invalid schema");
  }
}
const PolicyOptions = ({
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
      <h3>Policy Configuration</h3>
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
          <h3>Policy Options</h3>
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

export default async function Page({ params }: { params: { slug: string } }) {
  const mod = await import("@/build/policies.mjs");
  const policy = mod[params.slug.replaceAll("-", "_")];
  if (!policy) {
    return notFound();
  }
  const { schema, policyId, files } = policy;

  let code: any;
  const { examples } = schema.properties?.handler as any;
  if (examples && examples.length > 0) {
    const example = { ...examples[0] };
    delete example._name;
    code = {
      name: `my-${policyId}-policy`,
      policyType: policyId,
      handler: example,
    };
  } else if (schema.isCustom) {
    code = {
      name: policyId,
      policyType: policyId.endsWith("-inbound")
        ? "custom-code-inbound"
        : "custom-code-outbound",
      handler: {
        export: "default",
        module: `$import(./modules/${policyId})`,
      },
    };
  } else {
    throw new Error(`There are no examples set for policy ${policyId}`);
  }

  return (
    <GenericLayout
      frontmatter={{ title: `${schema.title} Policy` }}
      sections={[]}
    >
      {schema.isCustom ? (
        <CustomPolicyNotice name="${schema.title}" id="${policyId}" />
      ) : null}
      {schema.isDeprecated ? (
        <pre>This policy is deprecated. ${schema.deprecatedMessage ?? ""}</pre>
      ) : null}
      <MarkdocInline markdown={files.introMd ?? schema.description ?? ""} />
      <PolicyStatus
        isPreview={schema.isPreview ?? false}
        isPaidAddOn={schema.isPaidAddOn ?? false}
      />
      {schema.isCustom && files.policyTs ? (
        <Fence language="typescript">{files.policyTs}</Fence>
      ) : null}
      <h2>Configuration</h2>
      <p>
        {schema.isCustom
          ? `The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.`
          : `The configuration shows how to configure the policy in the 'policies.json' document.`}
      </p>
      <Fence language="json">{JSON.stringify(code, null, 2)}</Fence>
      <PolicyOptions schema={schema} policyId={policyId} />
      <h2>Using the Policy</h2>
      {/* ${(docMd ?? "").replace(/!\[(.*)\]\(\.\/(.*)\)/, `![$1](./${policyId}/$2)`)} */}
      <MarkdocInline markdown={files.docMd ?? ""} />
      <p>
        Read more about{" "}
        <Link href={"/docs/articles/policies"}>how policies work</Link>
      </p>
    </GenericLayout>
  );
}

export async function generateStaticParams() {
  const policies = await import("@/build/policies.mjs");
  return Object.keys(policies).map((key) => ({
    slug: key.replaceAll("_", "-"),
  }));
}
