import type { Navigation } from "zudoku";
import { errors } from "./generated/errors";
import zudokuSidebar from "./sidebar.zudoku.json";

export const docs: Navigation = [
  {
    type: "category",
    label: "Introduction",
    items: [
      "articles/what-is-zuplo",
      "articles/who-uses-and-why",
      "articles/hosting-options",
    ],
    collapsed: false,
  },
  {
    type: "category",
    label: "Getting Started",
    items: [
      "articles/step-1-setup-basic-gateway",
      "articles/step-2-add-rate-limiting",
      "articles/step-3-add-api-key-auth",
      "articles/step-4-deploying-to-the-edge",
      "articles/bonus-dynamic-rate-limiting",
    ],
    collapsed: false,
  },
  {
    type: "category",
    label: "Core Concepts",
    items: ["articles/routing", "articles/open-api"],
  },
  {
    type: "category",
    label: "Projects",
    items: [
      "articles/environment-variables",
      {
        type: "category",
        label: "Custom Domains",
        link: "articles/custom-domains",
        items: ["articles/fastly-zuplo-host-setup"],
      },
    ],
  },
  {
    type: "category",
    label: "Deployments",
    items: [
      "articles/environments",
      {
        type: "category",
        label: "Source Control",
        link: "articles/source-control",
        items: [
          "articles/source-control-setup-github",
          "articles/source-control-setup-bitbucket",
          "articles/source-control-setup-gitlab",
          "articles/rename-or-move-project",
        ],
      },
      {
        type: "category",
        label: "Continuous Deployment",
        items: [
          "articles/custom-ci-cd",
          "articles/update-zup-in-github-action",
        ],
      },

      "articles/testing",
    ],
  },
  {
    type: "category",
    label: "AI",
    items: ["ai/mcp"],
  },
  {
    type: "category",
    label: "Observability",
    items: [
      {
        type: "category",
        label: "Logging",
        link: "articles/logging",
        items: [
          "articles/log-plugin-gcp",
          "articles/log-plugin-loki",
          "articles/log-plugin-vmware-log-insight",
          "articles/log-plugin-aws-cloudwatch",
          "articles/log-plugin-datadog",
          "articles/log-plugin-dynatrace",
          "articles/log-plugin-new-relic",
          "articles/log-plugin-splunk",
          "articles/log-plugin-sumo",
          "articles/custom-logging-example",
        ],
      },
      {
        type: "category",
        label: "Data & Security",
        items: [
          "articles/plugin-akamai-api-security",
          "articles/plugin-azure-blob",
          "articles/plugin-azure-event-hubs",
          "articles/plugin-hydrolix-traffic-peak",
        ],
      },
      "articles/metrics-plugins",
      "articles/opentelemetry",
      "articles/monitoring-your-gateway",
    ],
  },
  {
    type: "category",
    label: "Local Development",
    items: [
      "articles/local-development",
      "articles/local-development-routes-designer",
      "articles/local-development-installing-packages",
      "articles/local-development-services",
      "articles/local-development-debugging",
      "articles/local-development-env-variables",
      "articles/tsconfig",
      "articles/local-development-troubleshooting",
    ],
  },
  {
    label: "Networking & Infrastructure",
    type: "category",
    items: [
      {
        type: "category",
        label: "Securing Your Backend",
        link: "articles/securing-your-backend",
        items: [
          "articles/gke-with-upstream-auth-policy",
          {
            type: "category",
            label: "Secure Tunnel",
            link: "articles/secure-tunnel",
            items: ["articles/tunnel-setup", "articles/tunnel-troubleshooting"],
          },
        ],
      },
      {
        type: "category",
        label: "Web Application Firewalls",
        link: "articles/waf-ddos",
        items: ["articles/waf-ddos-fastly", "articles/waf-ddos-aws-waf-shield"],
      },
      "articles/cloudflare-settings",
    ],
  },
  {
    type: "category",
    label: "Managed Dedicated",
    link: "dedicated/overview",
    items: [
      "dedicated/getting-started",
      "dedicated/source-control",
      "dedicated/architecture",
      "dedicated/networking",
      "dedicated/custom-domains",
      {
        type: "category",
        label: "Akamai",
        items: ["dedicated/akamai/cdn"],
      },
    ],
  },
  {
    type: "category",
    label: "Monetization",
    link: "articles/monetization",
    items: [
      {
        type: "category",
        label: "Quick Start",
        items: [
          "articles/monetization-dev-portal-setup",
          "articles/monetization-webhook-setup",
          "articles/monetization-policy-setup",
        ],
      },
      {
        type: "category",
        label: "Reference",
        items: [
          "articles/monetization-glossary",
          "articles/monetization-programmatic-quotas",
          "articles/stripe-monetization-plugin",
          "articles/monetization-subscription",
          "articles/monetization-limitations",
        ],
      },
    ],
  },
  {
    type: "category",
    label: "API Keys",
    link: "articles/api-key-management",
    items: [
      "articles/api-key-administration",
      "articles/api-key-authentication",
      "articles/api-key-end-users",
      "articles/api-key-api",
      "articles/api-key-react-component",
      "articles/api-key-leak-detection",
      "articles/api-key-service-limits",
      "articles/api-key-buckets",
    ],
  },
  {
    type: "category",
    label: "Developer Portal",
    link: {
      type: "doc",
      file: "articles/developer-portal",
    },
    items: [
      "articles/dev-portal-setup",
      "articles/dev-portal-configuration",
      {
        type: "category",
        label: "Authentication",
        link: "articles/dev-portal-auth",
        items: [
          "articles/dev-portal-auth0-auth",
          "articles/dev-portal-clerk-auth",
          "articles/dev-portal-keycloak-auth",
          "articles/dev-portal-supabase-auth",
        ],
      },
      "articles/dev-portal-theme",
      "articles/dev-portal-adding-pages",
      "articles/dev-portal-configuring-sidebar",
      "articles/dev-portal-json",
      "articles/dev-portal-create-consumer-on-auth",
      "articles/dev-portal-inject-html",
    ],
  },
  {
    type: "category",
    label: "How to Guides",
    items: [
      "articles/versioning-on-zuplo",
      "articles/multiple-auth-policies",
      "articles/archiving-requests-to-storage",
      "articles/per-user-rate-limits-using-db",
      "articles/rick-and-morty-api-developer-portal-example",
      "articles/check-ip-address",
      "articles/advanced-path-matching",
      "articles/lazy-load-configuration-into-cache",
      "articles/handling-form-data",
      "articles/testing-graphql",
      "articles/bypass-policy-for-testing",
      "articles/graphql-security",
      "articles/add-api-to-backstage",
      "articles/use-openapi-extension-data",
      "articles/non-standard-ports",
      "articles/convert-urls-to-openapi",
    ],
  },
  {
    type: "category",
    label: "Zuplo CLI",
    link: {
      type: "doc",
      file: "cli/overview",
    },
    items: [
      "cli/installation",
      "cli/analytics",
      "cli/authentication",
      "cli/convert",
      "cli/deployments",
      "cli/project",
      "cli/test",
      "cli/tunnels",
      "cli/variables",
      "cli/local-development",
      "cli/connectivity",
    ],
  },
  {
    type: "category",
    label: "Resources",
    items: [
      {
        type: "category",
        label: "Members & Roles",
        link: {
          type: "doc",
          file: "articles/accounts/members-and-roles",
        },
        items: [
          "articles/accounts/roles-and-permissions",
          "articles/accounts/managing-account-members",
          "articles/accounts/managing-project-members",
        ],
      },
      {
        type: "category",
        label: "Account Settings",
        items: [
          "articles/accounts/zuplo-api-keys",
          "articles/accounts/default-api-key",
          "articles/accounts/billing",
          "articles/accounts/delete-account",
        ],
      },
      {
        type: "category",
        label: "User Settings",
        items: [
          "articles/users/profile",
          "articles/users/multifactor-authentication",
        ],
      },
      {
        type: "category",
        label: "Single Sign On",
        link: {
          type: "doc",
          file: "articles/sso",
        },
        items: [
          "articles/sso-okta",
          "articles/sso-azure-ad",
          "articles/sso-faq",
        ],
      },
      {
        type: "doc",
        file: "articles/limits",
      },
      {
        type: "category",
        link: "errors",
        label: "Errors",
        items: errors.map((error) => ({
          type: "doc",
          file: `errors/${error.id}`,
          label: error.title.split("(").slice(0, 1).join(""),
        })),
      },

      {
        type: "doc",
        file: "articles/security",
      },
      {
        type: "doc",
        file: "articles/support",
      },
      {
        type: "link",
        label: "Trust & Compliance",
        to: "https://trust.zuplo.com",
      },
      {
        type: "link",
        label: "Changelog",
        to: "https://zuplo.com/changelog",
      },
    ],
  },
];

export const programming: Navigation = [
  {
    type: "doc",
    file: "programmable-api/index",
    label: "Overview",
  },

  {
    type: "category",
    label: "Request & Context",
    items: ["programmable-api/zuplo-request", "programmable-api/zuplo-context"],
  },
  {
    type: "category",
    label: "Configuration",
    items: [
      "programmable-api/zuplo-json",
      "programmable-api/compatibility-dates",
      "programmable-api/environment",
    ],
  },
  {
    type: "category",
    label: "Caching APIs",
    items: [
      "programmable-api/zone-cache",
      "programmable-api/memory-zone-read-through-cache",
      "programmable-api/streaming-zone-cache",
      "programmable-api/cache",
    ],
  },
  {
    type: "category",
    label: "Data Management",
    items: [
      "programmable-api/context-data",
      "programmable-api/background-loader",
      "programmable-api/background-dispatcher",
    ],
  },
  {
    type: "category",
    label: "Extensions & Hooks",
    items: ["programmable-api/runtime-extensions", "programmable-api/hooks"],
  },
  {
    type: "category",
    label: "Error Handling",
    items: [
      "programmable-api/runtime-errors",
      "programmable-api/not-found-handler",
      "programmable-api/http-problems",
      "programmable-api/problem-response-formatter",
    ],
  },
  {
    type: "category",
    label: "Logging & Observability",
    items: [
      "programmable-api/logger",
      "programmable-api/console-logging",
      "programmable-api/audit-log",
    ],
  },
  {
    type: "category",
    label: "Types and Interfaces",
    items: [
      "programmable-api/request-user",
      "programmable-api/custom-cors-policy",
    ],
  },
  {
    type: "category",
    label: "Web Standards",
    items: [
      "programmable-api/web-standard-apis",
      "programmable-api/web-crypto-apis",
    ],
  },
  {
    type: "category",
    label: "Advanced Topics",
    items: [
      "programmable-api/node-modules",
      "programmable-api/reusing-code",
      "programmable-api/route-raw",
      "programmable-api/safely-clone-a-request-or-response",
      "programmable-api/runtime-behaviors",
      "programmable-api/zp-body-removed",
      "programmable-api/zuplo-id-token",
    ],
  },
];

export const policies: Navigation = [
  {
    type: "category",
    label: "Overview",
    items: ["policies/overview", "articles/policies"],
  },
  {
    type: "category",
    label: "Authentication",
    items: [
      "policies/api-key-inbound",
      "policies/auth0-jwt-auth-inbound",
      "policies/clerk-jwt-auth-inbound",
      "policies/cognito-jwt-auth-inbound",
      "policies/web-bot-auth-inbound",
      "policies/firebase-jwt-inbound",
      "policies/okta-jwt-auth-inbound",
      "policies/open-id-jwt-auth-inbound",
      "policies/propel-auth-jwt-inbound",
      "policies/supabase-jwt-auth-inbound",
      "policies/curity-phantom-token-inbound",
      "policies/basic-auth-inbound",
      "policies/mtls-auth-inbound",
      "policies/ldap-auth-inbound",
      "policies/hmac-auth-inbound",
    ],
  },
  {
    type: "category",
    label: "Authorization",
    items: [
      "policies/authzen-inbound",
      "policies/okta-fga-authz-inbound",
      "policies/openfga-authz-inbound",
      "policies/axiomatics-authz-inbound",
      "policies/jwt-scopes-inbound",
      "policies/acl-policy-inbound",
      "policies/rbac-policy-inbound",
      "policies/geo-filter-inbound",
      "policies/ip-restriction-inbound",
    ],
  },
  {
    type: "category",
    label: "Security & Validation",
    items: [
      "policies/rate-limit-inbound",
      "policies/complex-rate-limit-inbound",
      "policies/audit-log-inbound",
      "policies/request-validation-inbound",
      "policies/bot-detection-inbound",
      "policies/prompt-injection-outbound",
      "policies/require-origin-inbound",
      "policies/request-size-limit-inbound",
      "policies/secret-masking-outbound",
      "policies/stripe-webhook-verification-inbound",
    ],
  },
  {
    type: "category",
    label: "Metrics, Billing & Quotas",
    items: [
      "policies/quota-inbound",
      "policies/moesif-inbound",
      "policies/monetization-inbound",
      "policies/amberflo-metering-inbound",
      "policies/readme-metrics-inbound",
    ],
  },
  {
    type: "category",
    label: "Testing",
    items: [
      "policies/ab-test-inbound",
      "policies/mock-api-inbound",
      "policies/sleep-inbound",
    ],
  },
  {
    type: "category",
    label: "Request Modification",
    items: [
      "policies/transform-body-inbound",
      "policies/remove-headers-inbound",
      "policies/clear-headers-inbound",
      "policies/change-method-inbound",
      "policies/formdata-to-json-inbound",
      "policies/remove-query-params-inbound",
      "policies/set-headers-inbound",
      "policies/set-body-inbound",
      "policies/set-query-params-inbound",
    ],
  },
  {
    type: "category",
    label: "Response Modification",
    items: [
      "policies/transform-body-outbound",
      "policies/remove-headers-outbound",
      "policies/clear-headers-outbound",
      "policies/set-headers-outbound",
      "policies/set-status-outbound",
      "policies/xml-to-json-outbound",
      "policies/replace-string-outbound",
    ],
  },
  {
    type: "category",
    label: "Upstream Authentication",
    items: [
      "policies/upstream-azure-ad-service-auth-inbound",
      "policies/upstream-gcp-service-auth-inbound",
      "policies/upstream-gcp-federated-auth-inbound",
      "policies/upstream-gcp-jwt-inbound",
      "policies/upstream-firebase-admin-auth-inbound",
      "policies/upstream-firebase-user-auth-inbound",
    ],
  },
  {
    type: "category",
    label: "Async & Archival",
    items: [
      "policies/archive-request-azure-storage-inbound",
      "policies/archive-request-gcp-storage-inbound",
      "policies/archive-request-aws-s3-inbound",
      "policies/archive-response-azure-storage-outbound",
      "policies/archive-response-aws-s3-outbound",
    ],
  },
  {
    type: "category",
    label: "GraphQL",
    items: [
      "policies/graphql-disable-introspection-inbound",
      "policies/graphql-complexity-limit-inbound",
    ],
  },
  {
    type: "category",
    label: "Other",
    items: [
      "policies/composite-inbound",
      "policies/brownout-inbound",
      "policies/caching-inbound",
      "policies/custom-code-inbound",
      "policies/custom-code-outbound",
      "articles/custom-audit-log-policy",
    ],
  },

  {
    type: "category",
    label: "Handlers",

    items: [
      "handlers/url-forward",
      "handlers/url-rewrite",
      "handlers/custom-handler",
      "handlers/aws-lambda",
      "handlers/mcp-server",
      "handlers/redirect",
      "handlers/openapi",
      "handlers/system-handlers",
      "handlers/websocket-handler",
    ],
  },
];

export const devPortal: Navigation = [
  {
    type: "category",
    label: "Getting started",
    icon: "sparkles",
    items: [
      "dev-portal/introduction",
      "dev-portal/migration",
      "dev-portal/updating",
      "dev-portal/node-modules",
    ],
  },
  ...(zudokuSidebar as Navigation),
];
