import type { SidebarEntry } from "zudoku";
import { errors } from "./generated/errors";
import zudokuSidebar from "./sidebar.zudoku.json";

export const docs: SidebarEntry = [
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
      {
        type: "category",
        label: "Observability",
        items: [
          "articles/metrics-plugins",
          "articles/opentelemetry",
          "articles/monitoring-your-gateway",
        ],
      },
      {
        type: "category",
        label: "Plugins and Logging",
        items: [
          "articles/log-plugins",
          "articles/log-plugin-akamai-api-security",
          "articles/log-plugin-azure-event-hubs",
          "articles/log-plugin-hydrolix-traffic-peak",
          "articles/log-plugin-azure-blob",
          "articles/log-plugin-vmware-log-insight",
          "articles/log-plugin-loki-logging",
          "articles/log-plugin-gcp-logging",
          "articles/custom-logging-example",
          "articles/log-export",
        ],
      },
      "articles/testing",
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
      id: "articles/developer-portal",
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
      "articles/open-api",

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
      id: "cli/overview",
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
          id: "articles/accounts/members-and-roles",
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
          "articles/accounts/billing",
        ],
      },
      {
        type: "category",
        label: "Single Sign On",
        link: {
          type: "doc",
          id: "articles/sso",
        },
        items: [
          "articles/sso-okta",
          "articles/sso-faq",
          "articles/sso-azure-ad",
        ],
      },
      {
        type: "doc",
        id: "articles/limits",
      },
      {
        type: "category",
        link: "errors",
        label: "Errors",
        items: errors.map((error) => ({
          type: "doc",
          id: `errors/${error.id}`,
          label: error.title.split("(").slice(0, 1).join(""),
        })),
      },

      {
        type: "doc",
        id: "articles/security",
      },
      {
        type: "doc",
        id: "articles/support",
      },
      {
        type: "link",
        label: "Trust & Compliance",
        href: "https://trust.zuplo.com",
      },
      {
        type: "link",
        label: "Changelog",
        href: "https://zuplo.com/changelog",
      },
    ],
  },
];

export const programming: SidebarEntry = [
  {
    type: "category",
    label: "Core Concepts",
    items: [
      "articles/zuplo-request",
      "articles/zuplo-context",
      "articles/web-standard-apis",
      "articles/web-crypto-apis",
      "articles/node-modules",

      "articles/context-data",
      "articles/route-raw",

      "articles/reusing-code",

      "articles/zuplo-id-token",
      "articles/safely-clone-a-request-or-response",
      "articles/runtime-behaviors",
      "articles/zp-body-removed",
      "articles/audit-log",
      "articles/custom-cors-policy",
      "articles/zuplo-json",
      "articles/compatibility-dates",
    ],
  },
  {
    type: "category",
    label: "Error Handling",
    items: ["articles/http-problems", "articles/not-found-handler"],
  },
  {
    type: "category",
    label: "Extensions & Hooks",
    items: ["articles/hooks", "articles/runtime-extensions"],
  },
  {
    type: "category",
    label: "Cache & Data Loading",
    items: [
      "articles/cache",
      "articles/zone-cache",
      "articles/background-loader",
      "articles/background-dispatcher",
    ],
  },
];

export const policies: SidebarEntry = [
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
      "policies/aserto-authz-inbound",
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
      "policies/require-origin-inbound",
      "policies/request-size-limit-inbound",
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
      "handlers/redirect",
      "handlers/openapi",
      "handlers/system-handlers",
      "handlers/websocket-handler",
    ],
  },
];

export const devPortal: SidebarEntry = [
  {
    type: "category",
    label: "Getting started",
    icon: "sparkles",
    items: [
      "dev-portal/introduction",
      "dev-portal/migration",
      "dev-portal/updating",
    ],
  },
  ...(zudokuSidebar as SidebarEntry),
];
