import { useState, type ReactNode } from "react";

interface Stage {
  id: string;
  label: string;
  description: string;
  details: ReactNode;
  variant: "hook" | "policy" | "handler" | "routing" | "endpoint";
  scope: string;
}

const variantStyles = {
  hook: {
    bg: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-300 dark:border-sky-700",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-400",
    activeBg: "bg-sky-100 dark:bg-sky-900/60",
    ring: "ring-sky-400/30",
  },
  policy: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    border: "border-fuchsia-300 dark:border-fuchsia-700",
    text: "text-fuchsia-700 dark:text-fuchsia-300",
    dot: "bg-fuchsia-400",
    activeBg: "bg-fuchsia-100 dark:bg-fuchsia-900/60",
    ring: "ring-fuchsia-400/30",
  },
  handler: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-300 dark:border-emerald-700",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-400",
    activeBg: "bg-emerald-100 dark:bg-emerald-900/60",
    ring: "ring-emerald-400/30",
  },
  routing: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-400",
    activeBg: "bg-amber-100 dark:bg-amber-900/60",
    ring: "ring-amber-400/30",
  },
  endpoint: {
    bg: "bg-gray-50 dark:bg-gray-800/40",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
    activeBg: "bg-gray-100 dark:bg-gray-800/60",
    ring: "ring-gray-400/30",
  },
};

const inboundStages: Stage[] = [
  {
    id: "pre-routing",
    label: "Pre-Routing Hooks",
    description: "Global hooks before route matching",
    details: (
      <>
        <p>
          Run <strong>before</strong> the request is matched to any route.
          Receives a standard <code>Request</code> and returns a (possibly
          modified) <code>Request</code>.
        </p>
        <p>
          <strong>Use for:</strong> URL normalization, version-based routing,
          trailing-slash cleanup
        </p>
        <p>
          <strong>Register:</strong> <code>runtime.addPreRoutingHook()</code> in{" "}
          <code>zuplo.runtime.ts</code>
        </p>
      </>
    ),
    variant: "hook",
    scope: "Global",
  },
  {
    id: "routing",
    label: "Route Matching",
    description: "Match by HTTP method + path",
    details: (
      <>
        <p>
          Matches the request by HTTP method and path using your OpenAPI
          specification. Routes match in the order they appear in the file.
        </p>
        <p>
          <strong>Tip:</strong> List specific paths before general ones (e.g.,{" "}
          <code>/users/admin</code> before <code>/users/&#123;id&#125;</code>)
        </p>
      </>
    ),
    variant: "routing",
    scope: "Per-route",
  },
  {
    id: "request-hooks",
    label: "Request Hooks",
    description: "Global hooks after routing",
    details: (
      <>
        <p>
          Run after a route is matched. Can modify the request or short-circuit
          by returning a <code>Response</code>.
        </p>
        <p>
          <strong>Use for:</strong> Correlation IDs, maintenance mode,
          request-level feature flags
        </p>
        <p>
          <strong>Register:</strong> <code>runtime.addRequestHook()</code>
        </p>
      </>
    ),
    variant: "hook",
    scope: "Global",
  },
  {
    id: "inbound-policies",
    label: "Inbound Policies",
    description: "Auth, rate limiting, validation",
    details: (
      <>
        <p>
          Execute in order on the matched route. Each policy can modify the
          request or <strong>short-circuit</strong> by returning a{" "}
          <code>Response</code> (e.g., 401 Unauthorized).
        </p>
        <p>
          <strong>Examples:</strong> API key auth, JWT validation, rate
          limiting, request validation, IP restrictions
        </p>
        <p>
          <strong>Configure:</strong>{" "}
          <code>x-zuplo-route.policies.inbound</code> in your OpenAPI spec
        </p>
      </>
    ),
    variant: "policy",
    scope: "Per-route",
  },
];

const handlerStage: Stage = {
  id: "handler",
  label: "Handler",
  description: "Route logic / backend call",
  details: (
    <>
      <p>
        The core logic for the route. Receives the <code>ZuploRequest</code> (as
        modified by inbound policies) and returns a <code>Response</code>.
      </p>
      <p>
        <strong>Built-in:</strong> URL Forward, URL Rewrite, Redirect, AWS
        Lambda, MCP Server, OpenAPI Spec
      </p>
      <p>
        <strong>Custom:</strong> Write a Function Handler in TypeScript for full
        control
      </p>
    </>
  ),
  variant: "handler",
  scope: "Per-route",
};

const outboundStages: Stage[] = [
  {
    id: "outbound-policies",
    label: "Outbound Policies",
    description: "Transform response",
    details: (
      <>
        <p>
          Run after the handler returns a response. Can transform the response
          body, add/remove headers, or replace the response entirely.
        </p>
        <p>
          <strong>Examples:</strong> Body transformation, header manipulation,
          XML-to-JSON, string replacement
        </p>
        <p>
          <strong>Configure:</strong>{" "}
          <code>x-zuplo-route.policies.outbound</code> in your OpenAPI spec
        </p>
      </>
    ),
    variant: "policy",
    scope: "Per-route",
  },
  {
    id: "response-hooks",
    label: "Response Hooks",
    description: "Modify response before sending",
    details: (
      <>
        <p>
          Can modify the <code>Response</code> before it reaches the client.
          Global hooks run before per-request hooks.
        </p>
        <p>
          <strong>Use for:</strong> Security headers, CORS headers, response
          timing
        </p>
        <p>
          <strong>Register:</strong>{" "}
          <code>runtime.addResponseSendingHook()</code> or{" "}
          <code>context.addResponseSendingHook()</code>
        </p>
      </>
    ),
    variant: "hook",
    scope: "Global + per-request",
  },
  {
    id: "final-hooks",
    label: "Final Hooks",
    description: "Logging & analytics (read-only)",
    details: (
      <>
        <p>
          Run after all response processing.{" "}
          <strong>Cannot modify the response.</strong> Use{" "}
          <code>context.waitUntil()</code> for non-blocking background work.
        </p>
        <p>
          <strong>Use for:</strong> Logging, analytics, metrics, audit trails
        </p>
        <p>
          <strong>Register:</strong>{" "}
          <code>runtime.addResponseSendingFinalHook()</code>
        </p>
      </>
    ),
    variant: "hook",
    scope: "Global + per-request",
  },
];

function StageNode({
  stage,
  isSelected,
  onClick,
}: {
  stage: Stage;
  isSelected: boolean;
  onClick: () => void;
}) {
  const styles = variantStyles[stage.variant];

  return (
    <button
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer select-none min-w-[110px] px-4 py-2.5",
        isSelected
          ? `${styles.activeBg} ${styles.border} shadow-md ring-4 ${styles.ring} scale-[1.03]`
          : `${styles.bg} ${styles.border} hover:shadow-sm hover:scale-[1.01]`,
      ].join(" ")}
    >
      <span
        className={`font-semibold text-sm leading-tight text-center ${styles.text}`}
      >
        {stage.label}
      </span>
    </button>
  );
}

function PipelineLine({ direction }: { direction: "right" | "left" }) {
  return (
    <div className="flex items-center shrink-0 mx-0.5">
      <div className="relative w-8 h-[2px] bg-gray-200 dark:bg-gray-700">
        <div
          className={[
            "absolute top-1/2 -translate-y-1/2 w-0 h-0",
            "border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent",
            direction === "right"
              ? "right-0 border-l-[6px] border-l-gray-300 dark:border-l-gray-600"
              : "left-0 border-r-[6px] border-r-gray-300 dark:border-r-gray-600",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function EndpointNode({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-5 py-2.5 min-w-[90px] shrink-0">
      <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

export function RequestLifecycle() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  const handleClick = (stage: Stage) => {
    setSelectedStage(selectedStage?.id === stage.id ? null : stage);
  };

  const styles = selectedStage ? variantStyles[selectedStage.variant] : null;

  return (
    <div className="not-prose my-8 space-y-6">
      {/* Request flow */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-sky-600 dark:text-sky-400 uppercase mb-3 flex items-center gap-1.5">
          <span className="inline-block w-4 h-[2px] bg-sky-400 rounded-full" />
          Request
        </div>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          <EndpointNode label="Client" />
          <PipelineLine direction="right" />
          {inboundStages.map((stage, i) => (
            <div key={stage.id} className="contents">
              <StageNode
                stage={stage}
                isSelected={selectedStage?.id === stage.id}
                onClick={() => handleClick(stage)}
              />
              {i < inboundStages.length - 1 && (
                <PipelineLine direction="right" />
              )}
            </div>
          ))}
          <PipelineLine direction="right" />
          <StageNode
            stage={handlerStage}
            isSelected={selectedStage?.id === handlerStage.id}
            onClick={() => handleClick(handlerStage)}
          />
        </div>
      </div>

      {/* Curved connector */}
      <div className="flex justify-end pr-[55px]">
        <div className="w-[2px] h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Response flow */}
      <div>
        <div className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 uppercase mb-3 flex items-center gap-1.5">
          <span className="inline-block w-4 h-[2px] bg-amber-400 rounded-full" />
          Response
        </div>
        <div className="flex items-center gap-0 overflow-x-auto pb-2 flex-row-reverse">
          <EndpointNode label="Client" />
          <PipelineLine direction="left" />
          {outboundStages
            .slice()
            .reverse()
            .map((stage, i) => (
              <div key={stage.id} className="contents">
                <StageNode
                  stage={stage}
                  isSelected={selectedStage?.id === stage.id}
                  onClick={() => handleClick(stage)}
                />
                {i < outboundStages.length - 1 && (
                  <PipelineLine direction="left" />
                )}
              </div>
            ))}
          <PipelineLine direction="left" />
          <StageNode
            stage={handlerStage}
            isSelected={selectedStage?.id === handlerStage.id}
            onClick={() => handleClick(handlerStage)}
          />
        </div>
      </div>

      {/* Detail panel */}
      {selectedStage && styles && (
        <div
          className={`rounded-xl border ${styles.border} ${styles.activeBg} p-5 transition-all duration-200`}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className={`font-bold text-lg m-0 ${styles.text}`}>
                {selectedStage.label}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0 mt-0.5">
                {selectedStage.description}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${styles.border} ${styles.text} ${styles.bg}`}
            >
              {selectedStage.scope}
            </span>
          </div>
          <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:text-xs [&_code]:bg-black/5 [&_code]:dark:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono">
            {selectedStage.details}
          </div>
        </div>
      )}

      {!selectedStage && (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 italic">
          Click any stage to learn more
        </p>
      )}
    </div>
  );
}
