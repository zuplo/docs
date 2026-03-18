import { type CSSProperties, useState } from "react";
import { Button, Link } from "zudoku/components";
import { XCircleIcon } from "zudoku/icons";

type ProductType = "ai-gateway" | "api-gateway" | "mcp-gateway";

export const PolicyOverview = ({
  policies,
  product,
}: {
  policies: Array<{
    id: string;
    name: string;
    icon: string;
    isDeprecated: boolean;
    isPaidAddOn: boolean;
    isEnterprise: boolean;
    isCustom: boolean;
    isHidden: boolean;
    products: ProductType[];
  }>;
  product: ProductType;
}) => {
  const [input, setInput] = useState("");
  const [planFilter, setPlanFilter] = useState<
    "all" | "enterprise" | "builder"
  >("all");

  const filteredPolicies = policies
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((policy) => {
      if (
        policy.isDeprecated ||
        policy.isHidden ||
        !policy.products.includes(product)
      ) {
        return false;
      }
      if (planFilter === "enterprise")
        return policy.isPaidAddOn || policy.isEnterprise;
      if (planFilter === "builder")
        return !policy.isPaidAddOn && !policy.isEnterprise;
      return true;
    });
  const inboundPolicies = filteredPolicies.filter(
    (policy) =>
      policy.id.includes("inbound") &&
      policy.name.toLowerCase().includes(input.toLowerCase()),
  );
  const outboundPolicies = filteredPolicies.filter(
    (policy) =>
      policy.id.includes("outbound") &&
      policy.name.toLowerCase().includes(input.toLowerCase()),
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
      <div className="flex items-center gap-2 mt-4">
        <span className="text-sm text-muted-foreground font-medium">Plan:</span>
        {(["all", "enterprise", "builder"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setPlanFilter(f)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors capitalize ${
              planFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-accent"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "enterprise"
                ? "Enterprise Add-On"
                : "Included"}
          </button>
        ))}
      </div>
      <h2 className="text-2xl font-bold">Inbound Policies</h2>
      <div
        role="list"
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {inboundPolicies.length > 0 ? (
          inboundPolicies.map((policy) => (
            <PolicyCard key={policy.id} {...policy} />
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
            <PolicyCard key={policy.id} {...policy} />
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
  id: string;
  name: string;
  icon: string;
  isDeprecated: boolean;
  isHidden: boolean;
  isPaidAddOn: boolean;
  isEnterprise: boolean;
  isCustom: boolean;
}) => (
  <Link
    to={`/policies/${policy.id}`}
    key={policy.id}
    className="relative overflow-hidden flex items-center gap-4 rounded-lg border border-border shadow-sm p-4 transition-colors hover:bg-accent md:h-36 md:flex-col md:justify-center md:px-5 md:py-6 md:text-center no-underline"
  >
    {(policy.isPaidAddOn || policy.isEnterprise) && (
      <div className="absolute top-[14px] right-[-22px] w-24 text-center rotate-45 bg-black text-white text-[10px] font-bold py-0.5 shadow-sm">
        Add-On
      </div>
    )}
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
    <span className="text-sm font-bold">{policy.name}</span>
  </Link>
);
