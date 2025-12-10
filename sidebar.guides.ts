import type { Navigation } from "zudoku";

export const categories = [
  // Core API Design
  { slug: "openapi", label: "OpenAPI & API Design" },
  { slug: "authentication", label: "Authentication & Security" },

  // Performance & Reliability
  { slug: "rate-limiting", label: "Rate Limiting & Quotas" },
  { slug: "caching", label: "Caching & Performance" },

  // Backend & Integration
  { slug: "backends", label: "Backend Integration" },
  { slug: "integrations", label: "Third-Party Integrations" },

  // Development
  { slug: "custom-code", label: "Custom Policies & Code" },
  { slug: "request-handling", label: "Request & Response Handling" },
  { slug: "testing", label: "Testing & Debugging" },

  // Operations
  { slug: "deployment", label: "Deployment & Networking" },
  { slug: "observability", label: "Monitoring & Observability" },

  // Documentation
  { slug: "dev-portal", label: "Developer Portal" },
];

export const guides: Navigation = [
  "articles/add-api-to-backstage",
  "articles/advanced-path-matching",
  "articles/archiving-requests-to-storage",
  "articles/bypass-policy-for-testing",
  "articles/check-ip-address",
  "articles/configuring-auth0-for-mcp-auth",
  "articles/configuring-okta-for-mcp-auth",
  "articles/convert-urls-to-openapi",
  "articles/graphql-security",
  "articles/handling-form-data",
  "articles/health-checks",
  "articles/lazy-load-configuration-into-cache",
  "articles/manual-mcp-oauth-testing",
  "articles/multiple-auth-policies",
  "articles/non-standard-ports",
  "articles/openapi-server-urls",
  "articles/per-user-rate-limits-using-db",
  "articles/rick-and-morty-api-developer-portal-example",
  "articles/s3-signed-url-uploads",
  "articles/sharing-code-across-projects",
  "articles/testing-graphql",
  "articles/use-openapi-extension-data",
  "articles/versioning-on-zuplo",
  "guides/canary-routing-for-employees",
  "guides/geolocation-backend-routing",
  "guides/modify-openapi-paths",
  "guides/modify-openapi-paths",
  "guides/openapi-overlays",
];
