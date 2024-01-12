import { GenericLayout } from "@/components/GenericLayout";
import { MarkdocComponent } from "@/components/MarkdocComponent";
import CustomPolicyNotice from "@/components/policies/CustomPolicyNotice";
import PolicyStatus from "@/components/policies/PolicyStatus";
import Link from "next/link";
import { notFound } from "next/navigation";

type PolicyProperties = Record<
  string,
  {
    default?: boolean | string | number;
    description: string;
    properties?: PolicyProperties;
  }
>;

const OptionProperties = ({ properties }: { properties: PolicyProperties }) => (
  <ul>
    {Object.entries(properties).map(([key, value]) => (
      <li key={key}>
        <code>{key}</code>{" "}
        <div dangerouslySetInnerHTML={{ __html: value.description ?? "" }} />
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
  const { properties } = schema.properties.handler;
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
      {properties.options ? (
        <li>
          <code>handler/options</code> The options for this policy:
          {properties.options.properties && (
            <OptionProperties properties={properties.options.properties} />
          )}
        </li>
      ) : null}
    </ul>
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
      <MarkdocComponent markdown={files.introMd ?? schema.description ?? ""} />
      <PolicyStatus
        isPreview={schema.isPreview ?? false}
        isPaidAddOn={schema.isPaidAddOn ?? false}
      />
      {schema.isCustom && files.policyTs ? <pre>{files.policyTs}</pre> : null}
      <h2>Configuration</h2>
      <p>
        {schema.isCustom
          ? `The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.`
          : `The configuration shows how to configure the policy in the 'policies.json' document.`}
      </p>
      <pre>{JSON.stringify(code, null, 2)}</pre>
      <PolicyOptions schema={schema} policyId={policyId} />
      <h2>Using the Policy</h2>
      {/* ${(docMd ?? "").replace(/!\[(.*)\]\(\.\/(.*)\)/, `![$1](./${policyId}/$2)`)} */}
      <MarkdocComponent markdown={files.docMd ?? ""} />
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
