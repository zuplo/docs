import type { Navigation } from "zudoku";

export const categories = [
  { slug: "openapi", label: "OpenAPI & API Design" },
  { slug: "authentication", label: "Authentication & Security" },
  { slug: "rate-limiting", label: "Rate Limiting & Quotas" },
  { slug: "caching", label: "Caching & Performance" },
  { slug: "backends", label: "Backend Integration" },
  { slug: "integrations", label: "Third-Party Integrations" },
  { slug: "custom-code", label: "Custom Policies & Code" },
  { slug: "request-handling", label: "Request & Response Handling" },
  { slug: "testing", label: "Testing & Debugging" },
  { slug: "deployment", label: "Deployment & Networking" },
  { slug: "observability", label: "Monitoring & Observability" },
  { slug: "dev-portal", label: "Developer Portal" },
];

export const guides: Navigation = [
  {
    type: "filter",
    placeholder: "Filter documentation",
  },
  {
    type: "doc",
    file: "guides/overview",
  },
  {
    type: "category",
    label: "Authentication & Security",
    items: [
      "articles/multiple-auth-policies",
      "articles/graphql-security",
      "articles/bypass-policy-for-testing",
      "articles/configuring-auth0-for-mcp-auth",
      "articles/configuring-okta-for-mcp-auth",
      "articles/manual-mcp-oauth-testing",
    ],
  },
  {
    type: "category",
    label: "OpenAPI & API Design",
    items: [
      "articles/advanced-path-matching",
      "articles/convert-urls-to-openapi",
      "articles/openapi-server-urls",
      "articles/use-openapi-extension-data",
      "articles/versioning-on-zuplo",
      "guides/modify-openapi-paths",
      "guides/openapi-overlays",
    ],
  },
  {
    type: "category",
    label: "Routing & Backends",
    items: [
      "guides/canary-routing-for-employees",
      "guides/geolocation-backend-routing",
      "guides/user-based-backend-routing",
      "articles/add-api-to-backstage",
      "articles/s3-signed-url-uploads",
      "articles/non-standard-ports",
      "articles/handling-form-data",
    ],
  },
  {
    type: "category",
    label: "Performance & Data",
    items: [
      "articles/per-user-rate-limits-using-db",
      "articles/lazy-load-configuration-into-cache",
      "articles/archiving-requests-to-storage",
      "articles/check-ip-address",
    ],
  },
  {
    type: "category",
    label: "Testing & Development",
    items: [
      "articles/testing-graphql",
      "articles/health-checks",
      "articles/sharing-code-across-projects",
      "articles/rick-and-morty-api-developer-portal-example",
    ],
  },
];
