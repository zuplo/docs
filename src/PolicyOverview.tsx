import { type CSSProperties, useState } from "react";
import { Button, Link } from "zudoku/components";
import { XCircleIcon } from "zudoku/icons";

export const PolicyOverview = ({
  policies,
}: {
  policies: Array<{
    policyId: string;
    title: string;
    icon: string;
    isDeprecated?: boolean;
    isHidden?: boolean;
  }>;
}) => {
  const [input, setInput] = useState("");

  const filteredPolicies = policies
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((policy) => !policy.isDeprecated && !policy.isHidden);
  const inboundPolicies = filteredPolicies.filter(
    (policy) =>
      policy.policyId.includes("inbound") &&
      policy.title.toLowerCase().includes(input.toLowerCase()),
  );
  const outboundPolicies = filteredPolicies.filter(
    (policy) =>
      policy.policyId.includes("outbound") &&
      policy.title.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className="flex flex-col">
      <div className="relative flex">
        <input
          placeholder="Search policies…"
          className="w-full bg-secondary/10 border rounded-lg p-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {input.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => setInput("")}
            className="absolute right-4 top-0 bottom-0 self-center"
          >
            <XCircleIcon size={20} />
          </Button>
        )}
      </div>
      <h2 className="text-2xl font-bold">Inbound Policies</h2>
      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {inboundPolicies.length > 0 ? (
          inboundPolicies.map((policy) => (
            <PolicyCard key={policy.policyId} {...policy} />
          ))
        ) : (
          <div className="text-lg text-muted-foreground col-span-full">
            No inbound policies found
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold">Outbound Policies</h2>
      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {outboundPolicies.length > 0 ? (
          outboundPolicies.map((policy) => (
            <PolicyCard key={policy.policyId} {...policy} />
          ))
        ) : (
          <div className="text-lg text-muted-foreground col-span-full">
            No outbound policies found
          </div>
        )}
      </div>
    </div>
  );
};

const PolicyCard = (policy: {
  policyId: string;
  title: string;
  icon: string;
  isDeprecated?: boolean;
  isHidden?: boolean;
}) => (
  <Link
    to={`/policies/${policy.policyId}`}
    key={policy.policyId}
    className="flex items-center gap-4 rounded-lg border border-border shadow-sm p-4 transition-colors hover:bg-accent md:h-36 md:flex-col md:justify-center md:px-5 md:py-6 md:text-center no-underline"
  >
    <div className="rounded-lg bg-primary/10 p-2 flex items-center justify-center">
      <div
        className="mask-icon h-6 w-6 bg-primary md:h-8 md:w-8"
        style={
          {
            "--url": `url(data:image/svg+xml;base64,${btoa(policy.icon)})`,
            maskRepeat: "no-repeat",
            maskSize: "contain",
            maskImage: "var(--url)",
            WebkitMaskImage: "var(--url)",
          } as CSSProperties
        }
      />
    </div>
    <span className="text-sm font-bold">{policy.title}</span>
  </Link>
);
