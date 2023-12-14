import { DocsLayout } from "@/components/DocsLayout";
import { Section } from "@/lib/types";
import { getAllPolicies, getPolicy } from "@/lib/policies";
import { getHighlighter } from "shiki";

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
          <OptionProperties properties={properties.options.properties} />
        </li>
      ) : null}
    </ul>
  );
};

export default async function Page({ params }: { params: { slug: string } }) {
  if (!params?.slug || typeof params.slug !== "string") {
    throw new Error("Invalid slug");
  }

  const highlighter = await getHighlighter({ theme: "github-dark" });

  const policyId = params.slug;

  const {
    meta,
    schema,
    description,
    introHtml,
    docHtml,
    sections: contentSections,
  } = await getPolicy(policyId);

  const properties =
    (schema.properties!.handler as any).properties.options?.properties ?? {};
  if (properties && Object.keys(properties).length === 0) {
    console.warn(
      `WARN: The policy ${policyId} does not have any options set in the schema.`,
    );
  }

  const { examples } = schema.properties!.handler as any;
  let code: any;

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

  const sections: Section[] = [
    {
      title: "Configuration",
      id: "configuration",
      level: 2,
      children: [
        {
          title: "Options",
          id: "options",
          level: 3,
          children: [],
        },
      ],
    },
    ...contentSections,
  ];

  const exampleHtml = highlighter.codeToHtml(JSON.stringify(code, null, 2), {
    lang: "json",
  });

  return (
    <DocsLayout frontmatter={{ title: meta.name }} sections={sections}>
      <div dangerouslySetInnerHTML={{ __html: introHtml ?? description }} />

      <h2 id="configuration">
        Configuration
        <a
          href="#configuration"
          className="mb-3 cursor-pointer pl-1 no-underline opacity-0 hover:!opacity-100 group-hover:!opacity-100"
        >
          #
        </a>
      </h2>
      {exampleHtml ? (
        <div dangerouslySetInnerHTML={{ __html: exampleHtml }} />
      ) : null}
      {Object.keys(properties).length >= 0 ? (
        <>
          <h3 id="options">
            Options
            <a
              href="#options"
              className="mb-3 cursor-pointer pl-1 no-underline opacity-0 hover:!opacity-100 group-hover:!opacity-100"
            >
              #
            </a>
          </h3>
          <PolicyOptions schema={schema} policyId={policyId} />
        </>
      ) : null}
      {docHtml ? <div dangerouslySetInnerHTML={{ __html: docHtml }} /> : null}
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  const policies = await getAllPolicies();
  return policies.map((policy) => ({
    slug: policy.meta.id,
  }));
}
