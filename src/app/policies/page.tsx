import { Metadata } from "next";
import Link from "next/link";
import { DocsHeader } from "../../components/DocsHeader";
import { getAllPolicies } from "../../lib/policies";
import { DocsContainer } from "@/components/DocsContainer";
import { Prose } from "@/components/Prose";
import { PolicyCard } from "@/components/PolicyCard";

export const metadata: Metadata = {
  title: "Policies",
};

export default async function Page() {
  const policies = await getAllPolicies();

  return (
    <DocsContainer>
      <Prose>
        <DocsHeader title="Policies" />
        <p>
          Zuplo includes policies for any solution you need for securing and
          sharing your API. See the{" "}
          <Link
            href="/policies"
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
      </Prose>
      <Link
        href="/articles/policies"
        className="not-prose btn btn-large btn-secondary-light mt-6 inline-block no-underline"
      >
        Check out details
      </Link>

      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {policies.map((item) => (
          <PolicyCard
            key={item.meta.id}
            name={item.meta.name}
            href={item.meta.href}
            icon={item.meta.icon}
          />
        ))}
      </div>
    </DocsContainer>
  );
}
