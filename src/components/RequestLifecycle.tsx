import { useState, type ReactNode } from "react";

interface Stage {
  id: string;
  label: string;
  shortLabel?: string;
  description: string;
  details: ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  scope: string;
}

const inboundStages: Stage[] = [
  {
    id: "pre-routing",
    label: "Pre-Routing Hooks",
    shortLabel: "Pre-Routing",
    description: "Global hooks before route matching",
    details: (
      <>
        <p>
          Run <strong>before</strong> the request is matched to any route.
          Receives a standard <code>Request</code> and returns a (possibly
          modified) <code>Request</code>.
        </p>
        <p className="mt-2 text-sm">
          <strong>Use for:</strong> URL normalization, version-based routing,
          trailing-slash cleanup
        </p>
        <p className="mt-2 text-sm">
          <strong>Register:</strong> <code>runtime.addPreRoutingHook()</code> in{" "}
          <code>zuplo.runtime.ts</code>
        </p>
      </>
    ),
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    scope: "Global",
  },
  {
    id: "routing",
    label: "Route Matching",
    shortLabel: "Routing",
    description: "Match request to OpenAPI route",
    details: (
      <>
        <p>
          Matches the request by HTTP method and path using your OpenAPI
          specification. Routes match in the order they appear in the file.
        </p>
        <p className="mt-2 text-sm">
          <strong>Tip:</strong> List specific paths before general ones (e.g.,{" "}
          <code>/users/admin</code> before <code>/users/&#123;id&#125;</code>)
        </p>
      </>
    ),
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-400",
    scope: "Per-route",
  },
  {
    id: "request-hooks",
    label: "Request Hooks",
    shortLabel: "Req Hooks",
    description: "Global hooks after routing",
    details: (
      <>
        <p>
          Run after a route is matched. Can modify the request or short-circuit
          by returning a <code>Response</code>.
        </p>
        <p className="mt-2 text-sm">
          <strong>Use for:</strong> Correlation IDs, maintenance mode,
          request-level feature flags
        </p>
        <p className="mt-2 text-sm">
          <strong>Register:</strong> <code>runtime.addRequestHook()</code>
        </p>
      </>
    ),
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    scope: "Global",
  },
  {
    id: "inbound-policies",
    label: "Inbound Policies",
    shortLabel: "Inbound",
    description: "Auth, rate limiting, validation",
    details: (
      <>
        <p>
          Execute in order on the matched route. Each policy can modify the
          request or <strong>short-circuit</strong> by returning a{" "}
          <code>Response</code> (e.g., 401 Unauthorized).
        </p>
        <p className="mt-2 text-sm">
          <strong>Examples:</strong> API key auth, JWT validation, rate
          limiting, request validation, IP restrictions
        </p>
        <p className="mt-2 text-sm">
          <strong>Configure:</strong>{" "}
          <code>x-zuplo-route.policies.inbound</code> in OpenAPI spec
        </p>
      </>
    ),
    color: "text-fuchsia-700",
    bgColor: "bg-fuchsia-50",
    borderColor: "border-fuchsia-400",
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
      <p className="mt-2 text-sm">
        <strong>Built-in:</strong> URL Forward, URL Rewrite, Redirect, AWS
        Lambda, MCP Server, OpenAPI Spec
      </p>
      <p className="mt-2 text-sm">
        <strong>Custom:</strong> Write a Function Handler in TypeScript for full
        control
      </p>
    </>
  ),
  color: "text-green-700",
  bgColor: "bg-green-50",
  borderColor: "border-green-500",
  scope: "Per-route",
};

const outboundStages: Stage[] = [
  {
    id: "outbound-policies",
    label: "Outbound Policies",
    shortLabel: "Outbound",
    description: "Transform response",
    details: (
      <>
        <p>
          Run after the handler returns a response. Can transform the response
          body, add/remove headers, or replace the response entirely.
        </p>
        <p className="mt-2 text-sm">
          <strong>Examples:</strong> Body transformation, header manipulation,
          XML-to-JSON conversion, string replacement
        </p>
        <p className="mt-2 text-sm">
          <strong>Configure:</strong>{" "}
          <code>x-zuplo-route.policies.outbound</code> in OpenAPI spec
        </p>
      </>
    ),
    color: "text-fuchsia-700",
    bgColor: "bg-fuchsia-50",
    borderColor: "border-fuchsia-400",
    scope: "Per-route",
  },
  {
    id: "response-hooks",
    label: "Response Hooks",
    shortLabel: "Resp Hooks",
    description: "Modify response before sending",
    details: (
      <>
        <p>
          Can modify the <code>Response</code> before it reaches the client.
          Global hooks run before handler-specific hooks.
        </p>
        <p className="mt-2 text-sm">
          <strong>Use for:</strong> Security headers, CORS headers, response
          timing
        </p>
        <p className="mt-2 text-sm">
          <strong>Register:</strong>{" "}
          <code>runtime.addResponseSendingHook()</code> or{" "}
          <code>context.addResponseSendingHook()</code>
        </p>
      </>
    ),
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
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
        <p className="mt-2 text-sm">
          <strong>Use for:</strong> Logging, analytics, metrics, audit trails
        </p>
        <p className="mt-2 text-sm">
          <strong>Register:</strong>{" "}
          <code>runtime.addResponseSendingFinalHook()</code>
        </p>
      </>
    ),
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    scope: "Global + per-request",
  },
];

function StageNode({
  stage,
  isSelected,
  onClick,
  showPulse,
  size = "normal",
}: {
  stage: Stage;
  isSelected: boolean;
  onClick: () => void;
  showPulse?: "inbound" | "outbound" | null;
  size?: "normal" | "large";
}) {
  const isLarge = size === "large";
  const pulseClass =
    showPulse === "inbound"
      ? "animate-pulse ring-2 ring-blue-400"
      : showPulse === "outbound"
        ? "animate-pulse ring-2 ring-orange-400"
        : "";

  return (
    <button
      onClick={onClick}
      className={[
        "relative flex flex-col items-center justify-center rounded-lg border-2 transition-all cursor-pointer select-none",
        isLarge ? "px-4 py-3 min-w-[120px]" : "px-3 py-2 min-w-[100px]",
        stage.borderColor,
        isSelected
          ? `${stage.bgColor} shadow-lg scale-105`
          : "bg-white hover:shadow-md hover:scale-[1.02]",
        pulseClass,
      ].join(" ")}
    >
      <span
        className={`font-semibold text-xs sm:text-sm leading-tight text-center ${stage.color}`}
      >
        {stage.shortLabel ?? stage.label}
      </span>
      <span className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
        {stage.scope}
      </span>
    </button>
  );
}

function Arrow({ direction }: { direction: "right" | "left" | "down" }) {
  if (direction === "down") {
    return (
      <div className="flex justify-center py-1">
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          className="text-gray-300"
        >
          <path
            d="M8 0 L8 18 M3 14 L8 20 L13 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex items-center px-0.5 shrink-0">
      <svg width="20" height="16" viewBox="0 0 20 16" className="text-gray-300">
        {direction === "right" ? (
          <path
            d="M0 8 L14 8 M10 3 L16 8 L10 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        ) : (
          <path
            d="M20 8 L6 8 M10 3 L4 8 L10 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
}

export function RequestLifecycle() {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

  const handleClick = (stage: Stage) => {
    setSelectedStage(selectedStage?.id === stage.id ? null : stage);
  };

  return (
    <div className="not-prose my-6">
      {/* Inbound row */}
      <div className="mb-1">
        <div className="flex items-center gap-0.5 text-xs font-medium text-blue-600 mb-1.5 ml-1">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M2 6 L8 6 M6 3 L9 6 L6 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          REQUEST
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          <div className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2 min-w-[80px] shrink-0">
            <span className="font-semibold text-xs sm:text-sm text-gray-600">
              Client
            </span>
          </div>
          <Arrow direction="right" />
          {inboundStages.map((stage, i) => (
            <div key={stage.id} className="contents">
              <StageNode
                stage={stage}
                isSelected={selectedStage?.id === stage.id}
                onClick={() => handleClick(stage)}
              />
              {i < inboundStages.length - 1 && <Arrow direction="right" />}
            </div>
          ))}
          <Arrow direction="right" />
          <StageNode
            stage={handlerStage}
            isSelected={selectedStage?.id === handlerStage.id}
            onClick={() => handleClick(handlerStage)}
            size="large"
          />
        </div>
      </div>

      {/* Outbound row */}
      <div className="mt-1">
        <div className="flex items-center gap-0.5 text-xs font-medium text-orange-600 mb-1.5 ml-1">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M10 6 L4 6 M6 3 L3 6 L6 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          RESPONSE
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          <div className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2 min-w-[80px] shrink-0">
            <span className="font-semibold text-xs sm:text-sm text-gray-600">
              Client
            </span>
          </div>
          <Arrow direction="left" />
          {[...outboundStages].reverse().map((stage, i) => (
            <div key={stage.id} className="contents">
              <StageNode
                stage={stage}
                isSelected={selectedStage?.id === stage.id}
                onClick={() => handleClick(stage)}
              />
              {i < outboundStages.length - 1 && <Arrow direction="left" />}
            </div>
          ))}
          <Arrow direction="left" />
          <StageNode
            stage={handlerStage}
            isSelected={selectedStage?.id === handlerStage.id}
            onClick={() => handleClick(handlerStage)}
            size="large"
          />
        </div>
      </div>

      {/* Detail panel */}
      {selectedStage && (
        <div
          className={`mt-4 rounded-lg border-2 p-4 transition-all ${selectedStage.borderColor} ${selectedStage.bgColor}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className={`font-bold text-base m-0 ${selectedStage.color}`}>
                {selectedStage.label}
              </h4>
              <p className="text-sm text-gray-500 m-0">
                {selectedStage.description}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${selectedStage.borderColor} ${selectedStage.color}`}
            >
              {selectedStage.scope}
            </span>
          </div>
          <div className="text-sm text-gray-700 [&_code]:text-xs [&_code]:bg-white/60 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
            {selectedStage.details}
          </div>
        </div>
      )}

      {!selectedStage && (
        <p className="text-center text-sm text-gray-400 mt-3 italic">
          Click any stage to see details
        </p>
      )}
    </div>
  );
}
