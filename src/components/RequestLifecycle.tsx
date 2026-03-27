import { useState, type ReactNode } from "react";

interface Stage {
  id: string;
  label: string;
  why: string;
  details: ReactNode;
  links: { label: string; href: string }[];
  color: "sky" | "violet" | "emerald" | "amber" | "gray";
  scope: string;
  canShortCircuit?: boolean;
  isEndpoint?: boolean;
}

const stages: Stage[] = [
  {
    id: "client-in",
    label: "Client Request",
    why: "",
    details: <></>,
    links: [],
    color: "gray",
    scope: "",
    isEndpoint: true,
  },
  {
    id: "pre-routing",
    label: "Pre-Routing Hooks",
    why: "Modify the request URL or headers before Zuplo decides which route handles it. Common for URL normalization, API version routing, or trailing-slash cleanup.",
    details: (
      <>
        <p>
          Receives a standard <code>Request</code> and returns a (possibly
          modified) <code>Request</code>.
        </p>
        <p>
          Register with <code>runtime.addPreRoutingHook()</code> in your{" "}
          <code>zuplo.runtime.ts</code> file.
        </p>
      </>
    ),
    links: [
      {
        label: "Runtime Extensions",
        href: "/docs/programmable-api/runtime-extensions",
      },
      { label: "Hooks Reference", href: "/docs/programmable-api/hooks" },
    ],
    color: "sky",
    scope: "Global",
    canShortCircuit: true,
  },
  {
    id: "routing",
    label: "Route Matching",
    why: "Zuplo uses your OpenAPI specification to match the request by HTTP method and path. Routes match in the order they appear in the file, so list specific paths before general ones.",
    details: (
      <>
        <p>
          Supports <strong>OpenAPI mode</strong> (default) with{" "}
          <code>/users/&#123;userId&#125;</code> syntax and{" "}
          <strong>URL Pattern mode</strong> with regex support. Multiple OpenAPI
          files are processed in alphabetical order.
        </p>
      </>
    ),
    links: [
      { label: "Routing", href: "/docs/articles/routing" },
      { label: "OpenAPI", href: "/docs/articles/openapi" },
      {
        label: "Advanced Path Matching",
        href: "/docs/articles/advanced-path-matching",
      },
    ],
    color: "sky",
    scope: "Per-route",
  },
  {
    id: "request-hooks",
    label: "Request Hooks",
    why: "Run cross-cutting logic that needs route context but applies globally: correlation IDs, maintenance mode, request-level feature flags.",
    details: (
      <>
        <p>
          Receives <code>ZuploRequest</code> and <code>ZuploContext</code>. Can
          modify the request or short-circuit by returning a{" "}
          <code>Response</code>.
        </p>
        <p>
          Register with <code>runtime.addRequestHook()</code>.
        </p>
      </>
    ),
    links: [
      {
        label: "Runtime Extensions",
        href: "/docs/programmable-api/runtime-extensions",
      },
      { label: "ZuploContext", href: "/docs/programmable-api/zuplo-context" },
    ],
    color: "sky",
    scope: "Global",
    canShortCircuit: true,
  },
  {
    id: "inbound",
    label: "Inbound Policies",
    why: "The primary extension point for request processing. Add authentication, rate limiting, request validation, or any custom logic. Policies are reusable across routes and execute in order.",
    details: (
      <>
        <p>
          Each policy can modify the request or <strong>short-circuit</strong>{" "}
          by returning a <code>Response</code>. This is how auth policies block
          unauthenticated requests before they reach your backend.
        </p>
        <p>
          Configured via <code>x-zuplo-route.policies.inbound</code> in your
          OpenAPI spec. Defined in <code>config/policies.json</code>.
        </p>
      </>
    ),
    links: [
      { label: "Policy Fundamentals", href: "/docs/articles/policies" },
      { label: "All Policies", href: "/docs/policies/overview" },
      { label: "Custom Policies", href: "/docs/policies/custom-code-inbound" },
      { label: "Authentication", href: "/docs/concepts/authentication" },
    ],
    color: "violet",
    scope: "Per-route",
    canShortCircuit: true,
  },
  {
    id: "handler",
    label: "Handler",
    why: "Every route has exactly one handler that defines what happens with the request. Most routes use URL Forward to proxy to a backend, but you can write custom logic in TypeScript.",
    details: (
      <>
        <p>
          Receives the <code>ZuploRequest</code> (as modified by inbound
          policies) and returns a <code>Response</code>.
        </p>
        <p>
          <strong>Built-in:</strong> URL Forward, URL Rewrite, Redirect, AWS
          Lambda, MCP Server, OpenAPI Spec.
        </p>
        <p>
          <strong>Custom:</strong> Write a Function Handler in TypeScript for
          full control over the request and response.
        </p>
      </>
    ),
    links: [
      { label: "URL Forward Handler", href: "/docs/handlers/url-forward" },
      { label: "Function Handler", href: "/docs/handlers/custom-handler" },
      {
        label: "Project Structure",
        href: "/docs/concepts/project-structure",
      },
    ],
    color: "emerald",
    scope: "Per-route",
  },
  {
    id: "outbound",
    label: "Outbound Policies",
    why: "Transform responses before they reach the client. Remove sensitive headers, modify response bodies, convert formats (XML to JSON), or add caching headers.",
    details: (
      <>
        <p>
          Run after the handler returns a response. Can modify the body,
          add/remove headers, or replace the response entirely.
        </p>
        <p>
          Configured via <code>x-zuplo-route.policies.outbound</code> in your
          OpenAPI spec.
        </p>
      </>
    ),
    links: [
      { label: "Policy Fundamentals", href: "/docs/articles/policies" },
      {
        label: "Custom Outbound Policy",
        href: "/docs/policies/custom-code-outbound",
      },
      {
        label: "Transform Body",
        href: "/docs/policies/transform-body-outbound",
      },
    ],
    color: "violet",
    scope: "Per-route",
  },
  {
    id: "response-hooks",
    label: "Response Hooks",
    why: "Add security headers, CORS headers, or timing information to responses. Global hooks apply to all routes; per-request hooks target the current request only.",
    details: (
      <>
        <p>
          Register globally with <code>runtime.addResponseSendingHook()</code>{" "}
          or per-request with <code>context.addResponseSendingHook()</code>.
          Global hooks run before per-request hooks.
        </p>
      </>
    ),
    links: [
      { label: "Hooks Reference", href: "/docs/programmable-api/hooks" },
      {
        label: "Runtime Extensions",
        href: "/docs/programmable-api/runtime-extensions",
      },
    ],
    color: "amber",
    scope: "Global + per-request",
  },
  {
    id: "final-hooks",
    label: "Final Hooks",
    why: "Send logs, analytics, or metrics after the response is finalized. These hooks cannot modify the response. Use context.waitUntil() for non-blocking background work like sending to an analytics service.",
    details: (
      <>
        <p>
          Register with <code>runtime.addResponseSendingFinalHook()</code>.
          Cannot modify the response — read-only access.
        </p>
      </>
    ),
    links: [
      { label: "Hooks Reference", href: "/docs/programmable-api/hooks" },
      { label: "Logging", href: "/docs/articles/logging" },
      { label: "OpenTelemetry", href: "/docs/articles/opentelemetry" },
    ],
    color: "amber",
    scope: "Global + per-request",
  },
  {
    id: "client-out",
    label: "Client Response",
    why: "",
    details: <></>,
    links: [],
    color: "gray",
    scope: "",
    isEndpoint: true,
  },
];

const colors = {
  sky: {
    dot: "bg-sky-400",
    line: "bg-sky-200 dark:bg-sky-800",
    text: "text-sky-700 dark:text-sky-300",
    panelBorder: "border-sky-300 dark:border-sky-700",
    link: "text-gray-700 dark:text-gray-300",
    connector: "bg-sky-300 dark:bg-sky-700",
  },
  violet: {
    dot: "bg-violet-400",
    line: "bg-violet-200 dark:bg-violet-800",
    text: "text-violet-700 dark:text-violet-300",
    panelBorder: "border-violet-300 dark:border-violet-700",
    link: "text-gray-700 dark:text-gray-300",
    connector: "bg-violet-300 dark:bg-violet-700",
  },
  emerald: {
    dot: "bg-emerald-400",
    line: "bg-emerald-200 dark:bg-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    panelBorder: "border-emerald-300 dark:border-emerald-700",
    link: "text-gray-700 dark:text-gray-300",
    connector: "bg-emerald-300 dark:bg-emerald-700",
  },
  amber: {
    dot: "bg-amber-400",
    line: "bg-amber-200 dark:bg-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    panelBorder: "border-amber-300 dark:border-amber-700",
    link: "text-gray-700 dark:text-gray-300",
    connector: "bg-amber-300 dark:bg-amber-700",
  },
  gray: {
    dot: "bg-gray-300 dark:bg-gray-600",
    line: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-500 dark:text-gray-400",
    panelBorder: "border-gray-200 dark:border-gray-700",
    link: "text-gray-700 dark:text-gray-300",
    connector: "bg-gray-300 dark:bg-gray-700",
  },
};

const interactiveStages = stages.filter((s) => !s.isEndpoint);

export function RequestLifecycle() {
  const [selected, setSelected] = useState<Stage>(interactiveStages[0]);
  const cm = colors[selected.color];

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col lg:flex-row items-stretch gap-0">
        {/* Pipeline (vertical) */}
        <div className="lg:w-[240px] shrink-0 flex flex-col">
          {/* Stages */}
          {stages.map((stage, i) => {
            const c = colors[stage.color];
            const isSelected = selected.id === stage.id;
            const isLast = i === stages.length - 1;
            const prevColor =
              i > 0 ? colors[stages[i - 1].color].line : "bg-transparent";

            return (
              <div key={stage.id} className="flex items-center">
                {/* Dot column - fixed width, dot always vertically centered */}
                <div className="w-6 shrink-0 self-stretch flex flex-col items-center">
                  <div
                    className={`w-[2px] flex-1 ${i === 0 ? "bg-transparent" : prevColor}`}
                  />
                  <div
                    className={[
                      "rounded-full shrink-0",
                      stage.isEndpoint ? "w-2.5 h-2.5" : "w-3 h-3",
                      c.dot,
                    ].join(" ")}
                  />
                  <div
                    className={`w-[2px] flex-1 ${isLast ? "bg-transparent" : c.line}`}
                  />
                </div>

                {/* Connector + box */}
                <div className="flex items-center py-1">
                  {/* Connector from dot to box */}
                  <div
                    className={[
                      "w-4 h-[2px] -ml-1.5 shrink-0",
                      !stage.isEndpoint && isSelected
                        ? cm.connector
                        : "bg-transparent",
                    ].join(" ")}
                  />

                  {stage.isEndpoint ? (
                    <div className="w-[195px] px-3.5 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                      <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                        {stage.label}
                      </span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelected(stage)}
                        className={[
                          "w-[195px] px-3.5 py-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer",
                          isSelected
                            ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm"
                            : "bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "font-semibold block leading-tight text-[13px]",
                            isSelected
                              ? c.text
                              : "text-gray-700 dark:text-gray-300",
                          ].join(" ")}
                        >
                          {stage.label}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">
                          {stage.scope}
                          {stage.canShortCircuit && (
                            <span className="ml-1 opacity-60">
                              &middot; can short-circuit
                            </span>
                          )}
                        </span>
                      </button>

                      {/* Connector to panel */}
                      {isSelected && (
                        <div
                          className={`hidden lg:block h-[2px] w-5 ${cm.connector}`}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0 mt-4 lg:mt-1 flex flex-col">
          <div
            className={`rounded-xl border-2 ${cm.panelBorder} bg-white dark:bg-gray-900/50 transition-all duration-200 flex-1`}
          >
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <h3 className={`font-bold text-xl m-0 ${cm.text}`}>
                    {selected.label}
                  </h3>
                  {selected.scope && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                      {selected.scope}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  When to use
                </h4>
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed m-0">
                  {selected.why}
                </p>
              </div>

              {selected.details && (
                <div className="mb-6">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    How it works
                  </h4>
                  <div className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_code]:text-[13px] [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono">
                    {selected.details}
                  </div>
                </div>
              )}

              {selected.links.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    Learn more
                  </h4>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {selected.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-[15px] font-medium no-underline hover:underline text-gray-700 dark:text-gray-300"
                      >
                        {link.label} &rarr;
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
