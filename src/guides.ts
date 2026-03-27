/**
 * This file is auto-generated. Do not modify this file manually.
 * Generated from sidebar.ts guides array and markdown frontmatter.
 */

export interface Guide {
  id: string;
  title: string;
  description: string;
  categories: string[];
  page: string;
}

export const guides: Guide[] = [
  {
    id: "multiple-auth-policies",
    title: "Handling Multiple Authentication Policies",
    description:
      "Learn how to configure multiple authentication methods like JWT and API Key on a single API route in Zuplo.",
    categories: ["authentication"],
    page: "articles/multiple-auth-policies",
  },
  {
    id: "graphql-security",
    title: "Secure your GraphQL API with Zuplo",
    description:
      "Learn how to secure your GraphQL API using Zuplo's security policies to prevent DoS attacks and protect schema information.",
    categories: ["authentication", "backends"],
    page: "articles/graphql-security",
  },
  {
    id: "bypass-policy-for-testing",
    title: "Bypass a Policy for Testing",
    description:
      "Learn how to bypass policies for testing and debugging using API key metadata or custom policies in Zuplo.",
    categories: ["testing", "authentication", "custom-code"],
    page: "articles/bypass-policy-for-testing",
  },
  {
    id: "configuring-auth0-for-mcp-auth",
    title:
      "Setting up Auth0 as an Authentication Server for MCP OAuth Authentication",
    description:
      "Learn how to configure Auth0 as an Authorization Server for use with the MCP Server handler and OAuth authentication.",
    categories: ["authentication", "integrations"],
    page: "articles/configuring-auth0-for-mcp-auth",
  },
  {
    id: "configuring-okta-for-mcp-auth",
    title:
      "Setting up Okta as an Authentication Server for MCP OAuth Authentication",
    description:
      "Learn how to configure Okta as an authorization server for OAuth authentication with MCP Server handler.",
    categories: ["authentication", "integrations"],
    page: "articles/configuring-okta-for-mcp-auth",
  },
  {
    id: "manual-mcp-oauth-testing",
    title: "Manual OAuth MCP Testing",
    description:
      "Learn how to manually test OAuth flows for MCP servers using curl and OpenSSL when clients don't support full dynamic registration.",
    categories: ["authentication", "testing"],
    page: "articles/manual-mcp-oauth-testing",
  },
  {
    id: "advanced-path-matching",
    title: "Advanced Path Matching",
    description:
      "Learn how to use URLPattern for advanced path matching with dynamic parameters, regular expressions, and wildcards in Zuplo.",
    categories: ["openapi", "custom-code"],
    page: "articles/advanced-path-matching",
  },
  {
    id: "convert-urls-to-openapi",
    title: "Script to Convert URL Params to OpenAPI Format",
    description:
      "Learn how to convert Zuplo URL parameters to standard OpenAPI format using this JavaScript conversion script.",
    categories: ["openapi", "deployment"],
    page: "articles/convert-urls-to-openapi",
  },
  {
    id: "openapi-server-urls",
    title: "OpenAPI Server URLs in Zuplo",
    description:
      "Learn how Zuplo automatically manages server URLs in OpenAPI specs across environments and custom domains.",
    categories: ["openapi", "deployment"],
    page: "articles/openapi-server-urls",
  },
  {
    id: "use-openapi-extension-data",
    title: "Using the OpenAPI Extension Data in Code",
    description:
      "Learn how to add custom vendor-specific extensions to OpenAPI files and access that data in your Zuplo API Gateway code.",
    categories: ["openapi", "custom-code"],
    page: "articles/use-openapi-extension-data",
  },
  {
    id: "versioning-on-zuplo",
    title: "Versioning on Zuplo",
    description:
      "Learn how to version your APIs using URL-based versioning with separate OpenAPI files and custom policies on Zuplo.",
    categories: ["openapi", "custom-code"],
    page: "articles/versioning-on-zuplo",
  },
  {
    id: "modify-openapi-paths",
    title: "Modifying OpenAPI Paths with Scripts",
    description:
      "Learn how to programmatically modify all paths in your OpenAPI specification by adding prefixes, changing base paths, or transforming routes for different deployment scenarios.",
    categories: ["openapi", "deployment", "custom-code"],
    page: "guides/modify-openapi-paths",
  },
  {
    id: "openapi-overlays",
    title: "Modifying OpenAPI Files with OpenAPI Overlays",
    description:
      "Learn how to use the Zuplo CLI's OpenAPI Overlay command to dynamically modify OpenAPI specifications, add parameters, and configure route extensions.",
    categories: ["openapi", "custom-code", "deployment"],
    page: "guides/openapi-overlays",
  },
  {
    id: "canary-routing-for-employees",
    title: "Route Employees to Canary or Staging Backends",
    description:
      "Learn how to create a Zuplo policy that routes employee requests to canary or staging backends for testing and dogfooding purposes.",
    categories: ["backends", "custom-code", "testing"],
    page: "guides/canary-routing-for-employees",
  },
  {
    id: "geolocation-backend-routing",
    title: "Route to Different Backends Based on Geolocation",
    description:
      "Learn how to create a Zuplo policy that routes requests to different backend URLs based on the user's country.",
    categories: ["custom-code", "backends", "deployment"],
    page: "guides/geolocation-backend-routing",
  },
  {
    id: "user-based-backend-routing",
    title: "Route to Backends Based on User Identity",
    description:
      "Learn how to create a Zuplo policy that routes requests to different backends based on API key metadata or JWT claims for multi-tenant and environment isolation scenarios.",
    categories: ["backends", "custom-code", "authentication"],
    page: "guides/user-based-backend-routing",
  },
  {
    id: "add-api-to-backstage",
    title: "Add Your Zuplo API to Backstage",
    description:
      "Learn how to integrate your Zuplo API into Backstage by adding OpenAPI spec handlers and configuring catalog entries.",
    categories: ["openapi", "backends", "integrations"],
    page: "articles/add-api-to-backstage",
  },
  {
    id: "s3-signed-url-uploads",
    title: "Generating S3 Signed URLs for Large File Uploads",
    description:
      "Learn how to bypass Zuplo's 500MB limit by generating pre-signed S3 URLs for direct client uploads to Amazon S3.",
    categories: ["integrations", "backends"],
    page: "articles/s3-signed-url-uploads",
  },
  {
    id: "non-standard-ports",
    title: "Non-Standard Ports",
    description:
      "Learn how to make requests to non-standard ports in Zuplo with compatibility dates 2024-09-02 or later.",
    categories: ["deployment", "request-handling"],
    page: "articles/non-standard-ports",
  },
  {
    id: "handling-form-data",
    title: "Handling FormData",
    description:
      "Learn how to parse multipart/form-data uploads and process file content in Zuplo runtime using function handlers.",
    categories: ["request-handling", "backends"],
    page: "articles/handling-form-data",
  },
  {
    id: "per-user-rate-limits-using-db",
    title: "Per user rate-limiting using a database and the ZoneCache",
    description:
      "Learn how to implement advanced dynamic rate limiting with database lookups and ZoneCache for improved performance.",
    categories: ["rate-limiting", "caching"],
    page: "articles/per-user-rate-limits-using-db",
  },
  {
    id: "lazy-load-configuration-into-cache",
    title: "Lazy Load Configuration",
    description:
      "Learn how to efficiently load and cache configuration data using MemoryZoneReadThroughCache for optimal performance.",
    categories: ["caching", "custom-code"],
    page: "articles/lazy-load-configuration-into-cache",
  },
  {
    id: "archiving-requests-to-storage",
    title: "Archiving requests to storage",
    description:
      "Learn how to archive incoming request text bodies to Azure Blob Storage using custom policies in Zuplo.",
    categories: ["request-handling", "observability"],
    page: "articles/archiving-requests-to-storage",
  },
  {
    id: "check-ip-address",
    title: "How to check an incoming IP address",
    description:
      "Learn how to access the true client IP address of requests using the true-client-ip header.",
    categories: ["request-handling", "deployment"],
    page: "articles/check-ip-address",
  },
  {
    id: "testing-graphql",
    title: "Testing GraphQL Queries",
    description:
      "Learn how to test GraphQL API routes using the Zuplo Portal and third-party tools like Postman.",
    categories: ["testing", "dev-portal"],
    page: "articles/testing-graphql",
  },
  {
    id: "health-checks",
    title: "Health Check Handler",
    description:
      "Learn how to set up health check endpoints to monitor your API Gateway and backend services.",
    categories: ["observability", "backends"],
    page: "articles/health-checks",
  },
  {
    id: "sharing-code-across-projects",
    title: "Sharing Code Across Zuplo Projects",
    description:
      "Learn how to create a shared npm package containing TypeScript modules that can be reused across multiple Zuplo projects.",
    categories: ["custom-code", "deployment"],
    page: "articles/sharing-code-across-projects",
  },
  {
    id: "rick-and-morty-api-developer-portal-example",
    title: "Rick and Morty Developer Portal and Documentation",
    description:
      "Learn how to use the Rick and Morty REST API to access characters, locations, and episodes from the TV show.",
    categories: ["dev-portal", "openapi"],
    page: "articles/rick-and-morty-api-developer-portal-example",
  },
];
