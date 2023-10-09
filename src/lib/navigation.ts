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
      { title: "What is Zuplo?", href: "/articles/what-is-zuplo" },
      {
        title: "Who uses Zuplo, and why?",
        href: "/articles/who-uses-and-why",
      },
      {
        title: "Zuplo in your stack",
        href: "/articles/zuplo-in-your-stack",
      },
    ],
  },
  {
    title: "Getting Started",
    links: [
      {
        title: "Step 1 - Setup a Basic Gateway",
        href: "/articles/step-1-setup-basic-gateway",
      },
      {
        title: "Step 2 - API Key Authentication",
        href: "/articles/step-2-add-api-key-auth",
      },
      {
        title: "Step 3 - Rate Limiting",
        href: "/articles/step-3-add-rate-limiting",
      },
      {
        title: "Step 4 - Deploying to the Edge",
        href: "/articles/step-4-deploying-to-the-edge",
      },
    ],
  },
  {
    title: "Getting to Production",
    links: [
      { title: "Environments", href: "/articles/environments" },
      {
        title: "GitHub Integration",
        href: "/articles/github-source-control",
      },
      {
        title: "Securing your backend",
        href: "/articles/securing-your-backend",
      },
      {
        title: "Custom Domains",
        href: "/articles/custom-domains",
      },
      { title: "Testing", href: "/articles/testing" },
      {
        title: "Zuplo in your stack",
        href: "/articles/zuplo-in-your-stack",
      },
      { title: "Log Plugins", href: "/articles/log-plugins" },
    ],
  },
  {
    title: "API Keys",
    links: [
      { title: "Overview", href: "/articles/api-key-management" },
      {
        title: "Authentication",
        href: "/articles/api-key-authentication",
      },
      {
        title: "End User Access",
        href: "/articles/api-key-end-users",
      },
      { title: "Using the API", href: "/articles/api-key-api" },
      {
        title: "React Component",
        href: "/articles/api-key-react-component",
      },
      {
        title: "Leak Detection",
        href: "/articles/api-key-leak-detection",
      },
      {
        title: "Service Limits",
        href: "/articles/api-key-service-limits",
      },
      {
        title: "Buckets & Environments",
        href: "/articles/api-key-buckets",
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
            href: "/articles/local-development",
          },
          {
            title: "Configuring your IDE for Local Development",
            href: "/articles/configure-ide-for-local-development",
          },
        ],
      },
      { title: "Custom CI/CD", href: "/articles/custom-ci-cd" },
      {
        title: "Rename/Move Project",
        href: "/articles/rename-or-move-project",
      },
      {
        title: "Add project collaborators",
        href: "/articles/add-project-collaborators",
      },
      {
        title: "Multiple Auth Policies",
        href: "/articles/multiple-auth-policies",
      },
      {
        title: "Archiving requests to storage",
        href: "/articles/archiving-requests-to-storage",
      },
      {
        title: "Per user rate-limiting using a database and the ZoneCache",
        href: "/articles/per-user-rate-limits-using-db",
      },
      {
        title: "Rick and Morty Developer Portal and Documentation",
        href: "/articles/rick-and-morty-api-developer-portal-example",
      },
      {
        title: "How to check an incoming IP address",
        href: "/articles/check-ip-address",
      },
      {
        title: "Custom Logging Policy",
        href: "/articles/custom-logging-example",
      },
      {
        title: "Custom Log Level",
        href: "/articles/custom-log-level",
      },
      {
        title: "Advanced Path Matching",
        href: "/articles/advanced-path-matching",
      },
      {
        title: "Lazy Load Configuration",
        href: "/articles/lazy-load-configuration-into-cache",
      },
      {
        title: "Handling FormData",
        href: "/articles/handling-form-data",
      },
      {
        title: "Testing GraphQL Queries",
        href: "/articles/testing-graphql",
      },
      {
        title: "Secure a GCP Backend with Zuplo Upstream Auth",
        href: "/articles/gke-with-upstream-auth-policy",
      },
    ],
  },
  {
    title: "Reference",
    links: [
      {
        title: "Handlers",
        links: [
          { title: "URL Forward", href: "/handlers/url-forward" },
          { title: "URL Rewrite", href: "/handlers/url-rewrite" },
          {
            title: "Custom Handler",
            href: "/handlers/custom-handler",
          },
          { title: "AWS Lambda", href: "/handlers/aws-lambda" },
          { title: "Redirect", href: "/handlers/redirect" },
          {
            title: "OpenAPI Spec Handler",
            href: "/handlers/openapi",
          },
          {
            title: "Internal Route Handlers",
            href: "/handlers/system-handlers",
          },
        ],
      },
      {
        title: "Developer Portal",
        links: [
          {
            title: "Overview",
            href: "/articles/developer-portal",
          },
          { title: "Setup", href: "/articles/dev-portal-setup" },
          {
            title: "OpenAPI Specifications",
            href: "/articles/dev-portal-configuration",
          },
          {
            title: "Authentication",
            href: "/articles/dev-portal-auth",
          },
          {
            title: "Supabase Auth",
            href: "/articles/dev-portal-supabase-auth",
          },
          { title: "Theming", href: "/articles/dev-portal-theme" },
          {
            title: "Custom Pages",
            href: "/articles/dev-portal-adding-pages",
          },
          {
            title: "Sidebar Configuration",
            href: "/articles/dev-portal-configuring-sidebar",
          },
          {
            title: "Config (dev-portal.json)",
            href: "/articles/dev-portal-json",
          },
          {
            title: "Create an API Key Consumer on Login",
            href: "/articles/dev-portal-create-consumer-on-auth",
          },
        ],
      },
      {
        title: "Programming API",
        links: [
          {
            title: "ZuploRequest",
            href: "/articles/zuplo-request",
          },
          {
            title: "Environment Variables",
            href: "/articles/environment-variables",
          },
          {
            title: "ZuploContext",
            href: "/articles/zuplo-context",
          },
          {
            title: "Web Standard APIs",
            href: "/articles/web-standard-apis",
          },
          {
            title: "Web Crypto",
            href: "/articles/web-crypto-apis",
          },
          {
            title: "Node Modules",
            href: "/articles/node-modules",
          },
          {
            title: "Problem Details Helper",
            href: "/articles/http-problems",
          },
          { title: "Code Reuse", href: "/articles/reusing-code" },
          { title: "ZoneCache", href: "/articles/zone-cache" },
          {
            title: "Clone Request/Response",
            href: "/articles/safely-clone-a-request-or-response",
          },
          {
            title: "Runtime Behaviors",
            href: "/articles/runtime-behaviors",
          },
          {
            title: "zp-body-removed",
            href: "/articles/zp-body-removed",
          },
          { title: "Audit Log", href: "/articles/audit-log" },
          {
            title: "Runtime Extensions",
            href: "/articles/runtime-extensions",
          },
          {
            title: "Custom Not Found Handler",
            href: "/articles/not-found-handler",
          },
        ],
      },
      {
        title: "Zuplo CLI",
        links: [
          {
            title: "Installing the Zuplo CLI",
            href: "/cli/installation",
          },
          { title: "Analytics", href: "/cli/analytics" },
          { title: "Authentication", href: "/cli/authentication" },
          { title: "Conversion Commands", href: "/cli/convert" },
          {
            title: "Deployment Commands",
            href: "/cli/deployments",
          },
          { title: "Test Command", href: "/cli/test" },
          { title: "Tunnel Commands", href: "/cli/tunnels" },
          {
            title: "Environment Variables Commands",
            href: "/cli/variables",
          },
        ],
      },
    ],
  },
  {
    title: "Product Info",
    links: [
      { title: "Support Plans", href: "/articles/support" },
      { title: "Changelog", href: "https://zuplo.com/changelog" },
      { title: "Security", href: "/articles/security" },
      { title: "Trust & Compliance", href: "https://trust.zuplo.com" },
    ],
  },
];
