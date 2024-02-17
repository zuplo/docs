import { DocsLayout } from "@/components/DocsLayout";
import { Fence } from "@/components/Fence";
import CustomPolicyNotice from "@/components/policies/CustomPolicyNotice";
import { PolicyOptions } from "@/components/policies/PolicyOptions";
import PolicyStatus from "@/components/policies/PolicyStatus";
import { Section } from "@/lib/interfaces";
import { compileMdx } from "@/lib/markdown/mdx";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const mod = await import("@/build/policies.mjs");
  const policy = mod[params.slug.replaceAll("-", "_")];
  if (!policy) {
    return {};
  }

  const { schema } = policy;
  return {
    title: schema.title,
  };
}

const CUSTOM_DESCRIPTION = `The example below shows how to configure a custom code policy in the 'policies.json' document that utilizes the above example policy code.`;
const DEFAULT_DESCRIPTION = `The configuration shows how to configure the policy in the 'policies.json' document.`;

export default async function Page({ params }: { params: { slug: string } }) {
  const mod = await import("@/build/policies.mjs");
  const policy = mod[params.slug.replaceAll("-", "_")];
  if (!policy) {
    return notFound();
  }
  const { schema, policyId, files } = policy;

  let examplesOutput: {
    code: any;
    description: string;
    name: string | undefined;
  }[] = [];
  const { examples } = schema.properties?.handler as any;
  if (examples && examples.length > 0) {
    examples.forEach((example: any, i: number) => {
      let name = example["x-example-name"];
      let description = example["x-example-description"] ?? DEFAULT_DESCRIPTION;
      Object.keys(example).forEach((key) => {
        if (key.startsWith("x-example") || key === "_name") {
          delete example[key];
        }
      });
      examplesOutput.push({
        name,
        description,
        code: {
          name: `my-${policyId}-policy`,
          policyType: policyId,
          handler: example,
        },
      });
    });
  } else if (schema.isCustom) {
    examplesOutput.push({
      name: "basic",
      description: CUSTOM_DESCRIPTION,
      code: {
        name: policyId,
        policyType: policyId.endsWith("-inbound")
          ? "custom-code-inbound"
          : "custom-code-outbound",
        handler: {
          export: "default",
          module: `$import(./modules/${policyId})`,
        },
      },
    });
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
          title: "Policy Configuration",
          id: "policy-configuration",
          level: 3,
          children: [],
        },
        {
          title: "Policy Options",
          id: "policy-options",
          level: 3,
          children: [],
        },
      ],
    },
    {
      title: "Using the Policy",
      id: "using-the-policy",
      level: 2,
      children: [],
    },
  ];

  const { content: intro } = await compileMdx(
    files.introMd ?? schema.description ?? "",
    `./policy/intro.md`,
  );
  const { content: doc, toc: docToc } = await compileMdx(
    files.docMd ?? "",
    "./policy/doc.md",
  );
  sections.push(...docToc);

  return (
    <DocsLayout
      frontmatter={{ title: `${schema.title} Policy` }}
      sections={sections}
    >
      {schema.isCustom ? (
        <CustomPolicyNotice name="${schema.title}" id="${policyId}" />
      ) : null}
      {schema.isDeprecated ? (
        <pre>This policy is deprecated. ${schema.deprecatedMessage ?? ""}</pre>
      ) : null}
      {intro}
      <PolicyStatus
        isPreview={schema.isPreview ?? false}
        isPaidAddOn={schema.isPaidAddOn ?? false}
      />
      {schema.isCustom && files.policyTs ? (
        <Fence language="typescript">{files.policyTs}</Fence>
      ) : null}
      <h2 id="configuration">Configuration</h2>
      {examplesOutput.length > 0 && (
        <p>Below you will see some common configurations for this policy.</p>
      )}
      {examplesOutput.map((example) => {
        return (
          <>
            {example.name && examplesOutput.length > 1 && (
              <p className="font-bold">{example.name}</p>
            )}
            <p>{example.description}</p>
            <Fence language="json">
              {JSON.stringify(example.code, null, 2)}
            </Fence>
          </>
        );
      })}

      <PolicyOptions schema={schema} policyId={policyId} />
      <h2 id="using-the-policy">Using the Policy</h2>
      {doc}
      <p>
        Read more about{" "}
        <Link href={"/articles/policies"}>how policies work</Link>
      </p>
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  const policies = await import("@/build/policies.mjs");
  return Object.keys(policies).map((key) => ({
    slug: key.replaceAll("_", "-"),
  }));
}
