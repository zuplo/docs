import * as policies from "@/build/policies.mjs";
import { Card } from "@/components/Card";
import { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "../../components/DocsLayout";

export const metadata: Metadata = {
  title: "Policies",
};

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: `Policies` }} sections={[]}>
      <p>
        Zuplo includes policies for any solution you need for securing and
        sharing your API. See the{" "}
        <Link
          href="/articles/policies"
          className="text-pink underline transition-colors hover:text-pink-hover"
        >
          policy introduction
        </Link>{" "}
        to learn about using policies.
      </p>
      <p>
        In addition to the built-in policies, Zuplo is{" "}
        <Link
          href="/policies/custom-code-inbound"
          className="text-pink underline transition-colors hover:text-pink-hover"
        >
          fully programmable
        </Link>{" "}
        so developers can simply write code to customize any aspect of Zuplo.
      </p>

      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="policies-grid"
      >
        {Object.values(policies).map((item) => (
          <Card
            key={item.policyId}
            name={item.schema.title!}
            href={`/policies/${item.policyId}`}
            icon={item.icon!}
            testID="policy-card"
          />
        ))}
      </div>
    </DocsLayout>
  );
}
