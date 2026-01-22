import type { Navigation } from "zudoku";
import zudokuSidebar from "./sidebar.zudoku.json";
import cliSidebar from "./sidebar.cli.json";

const policies: Navigation = [
  "policies/overview",
  "articles/policies",
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
      "policies/web-bot-auth-inbound",
      "policies/bot-detection-inbound",
      "policies/prompt-injection-outbound",
      "policies/require-origin-inbound",
      "policies/request-size-limit-inbound",
      "policies/secret-masking-outbound",
      "policies/stripe-webhook-verification-inbound",
      "policies/akamai-ai-firewall",
    ],
  },
  {
    type: "category",
    label: "Metrics, Billing & Quotas",
    items: [
      "policies/quota-inbound",
      "policies/moesif-inbound",
      "policies/amberflo-metering-inbound",
      "policies/readme-metrics-inbound",
      "policies/openmeter-inbound",
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
      "policies/query-param-to-header-inbound",
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
      "articles/oauth-authentication",
      "policies/upstream-azure-ad-service-auth-inbound",
      "policies/upstream-gcp-service-auth-inbound",
      "policies/upstream-gcp-federated-auth-inbound",
      "policies/upstream-gcp-jwt-inbound",
      "policies/upstream-firebase-admin-auth-inbound",
      "policies/upstream-firebase-user-auth-inbound",
      "policies/upstream-zuplo-jwt-auth-inbound",
    ],
  },
  {
    type: "category",
    label: "Archival",
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
      "policies/graphql-introspection-filter-outbound",
      "policies/graphql-complexity-limit-inbound",
    ],
  },
  {
    type: "category",
    label: "Other",
    items: [
      "policies/composite-inbound",
      "policies/composite-outbound",
      "policies/brownout-inbound",
      "policies/caching-inbound",
      "policies/semantic-cache-inbound",
      "policies/custom-code-inbound",
      "policies/custom-code-outbound",
      "articles/custom-audit-log-policy",
    ],
  },
];

const programming: Navigation = [
  {
    type: "doc",
    file: "programmable-api/overview",
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
      "programmable-api/jwt-service-plugin",
      "programmable-api/oauth-protected-resource-plugin",
    ],
  },
];

export const apiGateway: Navigation = [
  "api-management/introduction",
  {
    type: "category",
    label: "Getting Started",
    items: [
      {
        type: "category",
        label: "Develop using the Portal",
        items: [
          "articles/step-1-setup-basic-gateway",
          "articles/step-2-add-rate-limiting",
          "articles/step-3-add-api-key-auth",
          "articles/step-4-deploying-to-the-edge",
          "articles/step-5-dynamic-rate-limiting",
          "articles/mcp-quickstart",
        ],
        collapsed: false,
      },
      {
        type: "category",
        label: "Develop Locally",
        items: [
          "articles/step-1-setup-basic-gateway-local",
          "articles/step-2-add-rate-limiting-local",
          "articles/step-3-add-api-key-auth-local",
        ],
        collapsed: false,
      },
    ],
    collapsed: false,
  },
  {
    type: "category",
    label: "Development",
    items: [
      "articles/development-options",
      "articles/routing",
      "articles/openapi",
      "articles/update-zup-in-github-action",
      "articles/environments",
      "articles/branch-based-deployments",
      "articles/environment-variables",
      "articles/testing",
      "articles/terraform",
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
    ],
  },
  {
    type: "category",
    label: "Source Control & Deployments",
    items: [
      "articles/source-control",
      {
        type: "category",
        label: "GitHub",
        items: [
          "articles/source-control-setup-github",
          "articles/github-deployment-testing",
          {
            type: "category",
            label: "Custom CI/CD",
            link: "articles/custom-ci-cd-github",
            items: [
              "articles/ci-cd-github/basic-deployment",
              "articles/ci-cd-github/deploy-and-test",
              "articles/ci-cd-github/pr-preview-environments",
              "articles/ci-cd-github/local-testing",
              "articles/ci-cd-github/tag-based-releases",
              "articles/ci-cd-github/multi-stage-deployment",
              "articles/ci-cd-github/cleanup-on-branch-delete",
            ],
          },
        ],
      },
      {
        type: "category",
        label: "GitLab",
        items: [
          "articles/source-control-setup-gitlab",
          {
            type: "category",
            label: "CI/CD Pipelines",
            link: "articles/custom-ci-cd-gitlab",
            items: [
              "articles/ci-cd-gitlab/basic-deployment",
              "articles/ci-cd-gitlab/deploy-and-test",
              "articles/ci-cd-gitlab/mr-preview-environments",
              "articles/ci-cd-gitlab/local-testing",
              "articles/ci-cd-gitlab/tag-based-releases",
              "articles/ci-cd-gitlab/multi-stage-deployment",
            ],
          },
        ],
      },
      {
        type: "category",
        label: "Bitbucket",
        items: [
          "articles/source-control-setup-bitbucket",
          {
            type: "category",
            label: "CI/CD Pipelines",
            link: "articles/custom-ci-cd-bitbucket",
            items: [
              "articles/ci-cd-bitbucket/basic-deployment",
              "articles/ci-cd-bitbucket/deploy-and-test",
              "articles/ci-cd-bitbucket/pr-preview-environments",
              "articles/ci-cd-bitbucket/local-testing",
              "articles/ci-cd-bitbucket/tag-based-releases",
              "articles/ci-cd-bitbucket/multi-stage-deployment",
            ],
          },
        ],
      },
      {
        type: "category",
        label: "Azure DevOps",
        items: [
          "articles/source-control-setup-azure",
          {
            type: "category",
            label: "CI/CD Pipelines",
            link: "articles/custom-ci-cd-azure",
            items: [
              "articles/ci-cd-azure/basic-deployment",
              "articles/ci-cd-azure/deploy-and-test",
              "articles/ci-cd-azure/pr-preview-environments",
              "articles/ci-cd-azure/local-testing",
              "articles/ci-cd-azure/tag-based-releases",
              "articles/ci-cd-azure/multi-stage-deployment",
            ],
          },
        ],
      },
      {
        type: "category",
        label: "CircleCI",
        link: "articles/custom-ci-cd-circleci",
        items: [
          "articles/ci-cd-circleci/basic-deployment",
          "articles/ci-cd-circleci/deploy-and-test",
          "articles/ci-cd-circleci/pr-preview-environments",
          "articles/ci-cd-circleci/local-testing",
          "articles/ci-cd-circleci/tag-based-releases",
          "articles/ci-cd-circleci/multi-stage-deployment",
        ],
      },
      "articles/custom-ci-cd",
      "articles/rename-or-move-project",
    ],
  },
  {
    type: "category",
    label: "Policies",
    items: policies,
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
  {
    type: "category",
    label: "Monetization",
    items: [
      "articles/monetization",
      "articles/monetization-enterprise",
      {
        type: "category",
        label: "Monetization API (Preview)",
        items: [
          "articles/monetization/index",
          "articles/monetization/api-access",
          "articles/monetization/meters",
          "articles/monetization/features",
          {
            type: "category",
            label: "Plans",
            items: [
              "articles/monetization/plans",
              "articles/monetization/rate-cards",
              "articles/monetization/pricing-models",
              "articles/monetization/plan-examples",
            ],
          },
        ],
      },
    ],
  },
  {
    type: "category",
    label: "MCP Server",
    items: [
      "mcp-server/introduction",
      "mcp-server/tools",
      "mcp-server/prompts",
      "mcp-server/resources",
      "mcp-server/testing",
      "mcp-server/graphql",
      "mcp-server/custom-tools",
      "mcp-server/openai-apps-sdk",
    ],
  },
  {
    type: "category",
    label: "Observability",
    items: [
      {
        type: "category",
        label: "Logging",
        items: [
          "articles/logging",
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
          "articles/log-request-response-data",
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
      "articles/performance-testing",
    ],
  },
  {
    label: "Networking & Infrastructure",
    type: "category",
    items: [
      {
        type: "category",
        label: "Custom Domains",
        items: ["articles/custom-domains", "articles/fastly-zuplo-host-setup"],
      },
      {
        type: "category",
        label: "Securing Your Backend",
        items: [
          "articles/securing-your-backend",
          "articles/securing-backend-mtls",
          "articles/gke-with-upstream-auth-policy",
          {
            type: "category",
            label: "Secure Tunnel",
            items: [
              "articles/secure-tunnel",
              "articles/tunnel-setup",
              "articles/tunnel-troubleshooting",
            ],
          },
        ],
      },
      {
        type: "category",
        label: "Web Application Firewalls",
        items: [
          "articles/waf-ddos",
          "articles/zuplo-waf",
          "articles/waf-ddos-fastly",
          "articles/waf-ddos-akamai",
          "articles/waf-ddos-aws-waf-shield",
        ],
      },
      "articles/ddos-protection",
    ],
  },
  {
    type: "category",
    label: "API Keys",
    items: [
      "articles/api-key-management",
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
];

export const aiGateway: Navigation = [
  "ai-gateway/introduction",
  "ai-gateway/getting-started",
  "ai-gateway/universal-api",
  {
    type: "category",
    label: "Providers",
    items: [
      "ai-gateway/providers",
      "ai-gateway/managing-providers",
      "ai-gateway/custom-providers",
    ],
  },
  {
    type: "category",
    label: "Teams",
    items: ["ai-gateway/teams", "ai-gateway/managing-teams"],
  },
  {
    type: "category",
    label: "Apps",
    items: ["ai-gateway/apps", "ai-gateway/managing-apps"],
  },

  {
    type: "category",
    label: "Guardrails & Policies",
    items: [
      "ai-gateway/policies/akamai-ai-firewall",
      "ai-gateway/policies/comet-opik-tracing",
      "ai-gateway/policies/galileo-tracing",
    ],
  },
  {
    type: "category",
    label: "Integrations",
    items: [
      "ai-gateway/integrations/ai-sdk",
      "ai-gateway/integrations/claude-code",
      "ai-gateway/integrations/codex",
      "ai-gateway/integrations/goose",
      "ai-gateway/integrations/langchain",
      "ai-gateway/integrations/openai",
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
      "dev-portal/local-development",
      "dev-portal/updating",
      "dev-portal/node-modules",
    ],
  },
  ...(zudokuSidebar as Navigation).map((item) => {
    if (typeof item === "object" && item.type === "category") {
      if (item.label === "Guides") {
        return {
          ...item,
          items: [
            ...item.items,
            "dev-portal/dev-portal-create-consumer-on-auth",
          ],
        };
      }
    }
    return item;
  }),
];

export const platform: Navigation = [
  // {
  //   type: "category",
  //   label: "Use Cases",
  //   collapsed: false,
  //   items: [
  //     {
  //       type: "link",
  //       to: "/foo",
  //       label: "Protect Your API",
  //     },
  //   ],
  // },
  {
    type: "category",
    label: "Hosting Options",
    collapsed: false,
    items: [
      "articles/hosting-options",
      {
        type: "category",
        label: "Managed Dedicated",
        items: [
          "dedicated/overview",
          "dedicated/source-control",
          "dedicated/architecture",
          "dedicated/networking",
          "dedicated/custom-domains",
          "dedicated/federated-gateways",
          {
            type: "category",
            label: "Akamai",
            items: [
              "dedicated/akamai/architecture",
              "dedicated/akamai/cdn",
              "dedicated/akamai/caching",
              "dedicated/akamai/ai-powered-applications",
            ],
          },
        ],
      },
      {
        type: "doc",
        label: "Managed Edge",
        file: "managed-edge/overview",
      },
      {
        type: "doc",
        label: "Self Hosted",
        file: "self-hosted/overview",
      },
    ],
  },
  {
    type: "category",
    label: "Account Management",
    collapsed: false,
    items: [
      {
        type: "category",
        label: "Members & Roles",
        items: [
          "articles/accounts/members-and-roles",
          "articles/accounts/roles-and-permissions",
          "articles/accounts/managing-account-members",
          "articles/accounts/managing-project-members",
        ],
      },
      {
        type: "category",
        label: "Account Settings",
        items: [
          "articles/accounts/enterprise-sso",
          "articles/accounts/zuplo-api-keys",
          "articles/accounts/default-api-key",
          "articles/accounts/billing",
          "articles/accounts/delete-account",
          "articles/accounts/audit-logs",
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
    ],
  },

  {
    type: "category",
    label: "Programming API",
    items: programming,
  },
  {
    type: "category",
    label: "Zuplo CLI",
    items: [
      "cli/overview",
      "cli/create-zuplo-api",
      "cli/authentication",
      "cli/global-options",
      "cli/connectivity",
      ...cliSidebar,
    ],
  },
  {
    type: "doc",
    file: "articles/limits",
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
];
