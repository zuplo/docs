export interface NavSection {
  title: string;
  links: (NavSection | NavItem)[];
}

export interface NavItem {
  title: string;
  href: string;
}

export const navigation: NavSection[] = [
  {
    title: "Introduction",
    links: [
      { title: "What is Zuplo?", href: "/docs/articles/what-is-zuplo" },
      {
        title: "Who uses Zuplo, and why?",
        href: "/docs/articles/who-uses-and-why",
      },
      {
        title: "Zuplo in your stack",
        href: "/docs/articles/zuplo-in-your-stack",
      },
    ],
  },
  {
    title: "Getting Started",
    links: [
      {
        title: "Step 1 - Setup a Basic Gateway",
        href: "/docs/articles/step-1-setup-basic-gateway",
      },
      {
        title: "Step 2 - API Key Authentication",
        href: "/docs/articles/step-2-add-api-key-auth",
      },
      {
        title: "Step 3 - Rate Limiting",
        href: "/docs/articles/step-3-add-rate-limiting",
      },
      {
        title: "Step 4 - Deploying to the Edge",
        href: "/docs/articles/step-4-deploying-to-the-edge",
      },
    ],
  },
  {
    title: "Getting to Production",
    links: [
      { title: "Environments", href: "/docs/articles/environments" },
      {
        title: "GitHub Integration",
        href: "/docs/articles/github-source-control",
      },
      {
        title: "Securing your backend",
        href: "/docs/articles/securing-your-backend",
      },
      {
        title: "Custom Domains",
        href: "/docs/articles/custom-domains",
      },
      { title: "Testing", href: "/docs/articles/testing" },
      {
        title: "Zuplo in your stack",
        href: "/docs/articles/zuplo-in-your-stack",
      },
      { title: "Log Plugins", href: "/docs/articles/log-plugins" },
    ],
  },
  {
    title: "API Keys",
    links: [
      { title: "Overview", href: "/docs/articles/api-key-management" },
      {
        title: "Authentication",
        href: "/docs/articles/api-key-authentication",
      },
      {
        title: "End User Access",
        href: "/docs/articles/api-key-end-users",
      },
      { title: "Using the API", href: "/docs/articles/api-key-api" },
      {
        title: "React Component",
        href: "/docs/articles/api-key-react-component",
      },
      {
        title: "Leak Detection",
        href: "/docs/articles/api-key-leak-detection",
      },
      {
        title: "Service Limits",
        href: "/docs/articles/api-key-service-limits",
      },
      {
        title: "Buckets & Environments",
        href: "/docs/articles/api-key-buckets",
      },
    ],
  },
  // { title: "OpenAPI", links: [] },
  {
    title: "How to Guides",
    links: [
      {
        title: "Local Development",
        links: [
          {
            title: "Running your Zuplo Gateway locally",
            href: "/docs/articles/local-development",
          },
          {
            title: "Configuring your IDE for Local Development",
            href: "/docs/articles/configure-ide-for-local-development",
          },
        ],
      },
      { title: "Custom CI/CD", href: "/docs/articles/custom-ci-cd" },
      {
        title: "Rename/Move Project",
        href: "/docs/articles/rename-or-move-project",
      },
      {
        title: "Add project collaborators",
        href: "/docs/articles/add-project-collaborators",
      },
      {
        title: "Multiple Auth Policies",
        href: "/docs/articles/multiple-auth-policies",
      },
      {
        title: "Archiving requests to storage",
        href: "/docs/articles/archiving-requests-to-storage",
      },
      {
        title: "Per user rate-limiting using a database and the ZoneCache",
        href: "/docs/articles/per-user-rate-limits-using-db",
      },
      {
        title: "Rick and Morty Developer Portal and Documentation",
        href: "/docs/articles/rick-and-morty-api-developer-portal-example",
      },
      {
        title: "How to check an incoming IP address",
        href: "/docs/articles/check-ip-address",
      },
      {
        title: "Custom Logging Policy",
        href: "/docs/articles/custom-logging-example",
      },
      {
        title: "Custom Log Level",
        href: "/docs/articles/custom-log-level",
      },
      {
        title: "Advanced Path Matching",
        href: "/docs/articles/advanced-path-matching",
      },
      {
        title: "Lazy Load Configuration",
        href: "/docs/articles/lazy-load-configuration-into-cache",
      },
      {
        title: "Handling FormData",
        href: "/docs/articles/handling-form-data",
      },
      {
        title: "Testing GraphQL Queries",
        href: "/docs/articles/testing-graphql",
      },
      {
        title: "Secure a GCP Backend with Zuplo Upstream Auth",
        href: "/docs/articles/gke-with-upstream-auth-policy",
      },
    ],
  },
  {
    title: "Reference",
    links: [
      {
        title: "Handlers",
        links: [
          { title: "URL Forward", href: "/docs/handlers/url-forward" },
          { title: "URL Rewrite", href: "/docs/handlers/url-rewrite" },
          {
            title: "Custom Handler",
            href: "/docs/handlers/custom-handler",
          },
          { title: "AWS Lambda", href: "/docs/handlers/aws-lambda" },
          { title: "Redirect", href: "/docs/handlers/redirect" },
          {
            title: "OpenAPI Spec Handler",
            href: "/docs/handlers/openapi",
          },
          {
            title: "Internal Route Handlers",
            href: "/docs/handlers/system-handlers",
          },
        ],
      },
      {
        title: "Developer Portal",
        links: [
          {
            title: "Overview",
            href: "/docs/articles/developer-portal",
          },
          { title: "Setup", href: "/docs/articles/dev-portal-setup" },
          {
            title: "OpenAPI Specifications",
            href: "/docs/articles/dev-portal-configuration",
          },
          {
            title: "Authentication",
            href: "/docs/articles/dev-portal-auth",
          },
          {
            title: "Supabase Auth",
            href: "/docs/articles/dev-portal-supabase-auth",
          },
          { title: "Theming", href: "/docs/articles/dev-portal-theme" },
          {
            title: "Custom Pages",
            href: "/docs/articles/dev-portal-adding-pages",
          },
          {
            title: "Sidebar Configuration",
            href: "/docs/articles/dev-portal-configuring-sidebar",
          },
          {
            title: "Config (dev-portal.json)",
            href: "/docs/articles/dev-portal-json",
          },
          {
            title: "Create an API Key Consumer on Login",
            href: "/docs/articles/dev-portal-create-consumer-on-auth",
          },
        ],
      },
      {
        title: "Programming API",
        links: [
          {
            title: "ZuploRequest",
            href: "/docs/articles/zuplo-request",
          },
          {
            title: "Environment Variables",
            href: "/docs/articles/environment-variables",
          },
          {
            title: "ZuploContext",
            href: "/docs/articles/zuplo-context",
          },
          {
            title: "Web Standard APIs",
            href: "/docs/articles/web-standard-apis",
          },
          {
            title: "Web Crypto",
            href: "/docs/articles/web-crypto-apis",
          },
          {
            title: "Node Modules",
            href: "/docs/articles/node-modules",
          },
          {
            title: "Problem Details Helper",
            href: "/docs/articles/http-problems",
          },
          { title: "Code Reuse", href: "/docs/articles/reusing-code" },
          { title: "ZoneCache", href: "/docs/articles/zone-cache" },
          {
            title: "Clone Request/Response",
            href: "/docs/articles/safely-clone-a-request-or-response",
          },
          {
            title: "Runtime Behaviors",
            href: "/docs/articles/runtime-behaviors",
          },
          {
            title: "zp-body-removed",
            href: "/docs/articles/zp-body-removed",
          },
          { title: "Audit Log", href: "/docs/articles/audit-log" },
          {
            title: "Runtime Extensions",
            href: "/docs/articles/runtime-extensions",
          },
          {
            title: "Custom Not Found Handler",
            href: "/docs/articles/not-found-handler",
          },
        ],
      },
      {
        title: "Zuplo CLI",
        links: [
          {
            title: "Installing the Zuplo CLI",
            href: "/docs/cli/installation",
          },
          { title: "Analytics", href: "/docs/cli/analytics" },
          { title: "Authentication", href: "/docs/cli/authentication" },
          { title: "Conversion Commands", href: "/docs/cli/convert" },
          {
            title: "Deployment Commands",
            href: "/docs/cli/deployments",
          },
          { title: "Test Command", href: "/docs/cli/test" },
          { title: "Tunnel Commands", href: "/docs/cli/tunnels" },
          {
            title: "Environment Variables Commands",
            href: "/docs/cli/variables",
          },
        ],
      },
    ],
  },
  {
    title: "Product Info",
    links: [
      { title: "Support Plans", href: "/docs/articles/support" },
      { title: "Changelog", href: "https://zuplo.com/changelog" },
      { title: "Security", href: "/docs/articles/security" },
      { title: "Trust & Compliance", href: "https://trust.zuplo.com" },
    ],
  },
];
