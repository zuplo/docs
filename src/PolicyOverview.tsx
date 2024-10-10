import React, { type CSSProperties } from "react";
import { Link } from "zudoku/components";

export const PolicyOverview = ({
  policies,
}: {
  policies: Array<{ policyId: string; title: string; icon: string }>;
}) => {
  return (
    <div
      role="list"
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {policies
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((policy) => (
          <Link
            to={`/policies/${policy.policyId}`}
            key={policy.policyId}
            className="flex items-center gap-4 rounded-lg border border-border shadow-sm p-4 transition-colors hover:bg-accent md:h-36 md:flex-col md:justify-center md:px-5 md:py-6 md:text-center no-underline"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <div
                className="mask-icon h-6 w-6 shrink-0 bg-primary md:h-8 md:w-8"
                style={
                  {
                    "--url": `url(data:image/svg+xml;base64,${btoa(policy.icon)})`,
                    maskImage: "var(--url)",
                    WebkitMaskImage: "var(--url)",
                  } as CSSProperties
                }
              />
            </div>
            <span className="text-sm font-bold">{policy.title}</span>
          </Link>
        ))}
    </div>
  );
};
