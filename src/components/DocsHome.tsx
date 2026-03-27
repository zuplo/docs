import {
  PackageIcon,
  BrainIcon,
  BookOpenTextIcon,
  RocketIcon,
  ShieldCheckIcon,
  CodeIcon,
  GearIcon,
  TerminalIcon,
  EyeIcon,
  CloudIcon,
  GitBranchIcon,
  LockIcon,
  CurrencyDollarIcon,
  KeyIcon,
} from "@phosphor-icons/react/dist/ssr";
import MCPIcon from "../icons/MCPServer.js";
import { type ReactNode } from "react";

interface ProductCard {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

interface LinkItem {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

interface Section {
  title: string;
  links: LinkItem[];
}

const products: ProductCard[] = [
  {
    href: "/docs/api-management/introduction",
    icon: <PackageIcon size={22} weight="duotone" />,
    title: "API Management",
    description:
      "Authentication, rate limiting, policies, and more. Build production-ready APIs at scale.",
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50",
  },
  {
    href: "/docs/ai-gateway/introduction",
    icon: <BrainIcon size={22} weight="duotone" />,
    title: "AI Gateway",
    description:
      "Manage multiple AI providers through a single API with observability and cost controls.",
    color:
      "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50",
  },
  {
    href: "/docs/mcp-server/introduction",
    icon: <MCPIcon size={22} />,
    title: "MCP Server",
    description:
      "Connect your APIs to AI assistants using the Model Context Protocol.",
    color:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
  },
  {
    href: "/docs/dev-portal/introduction",
    icon: <BookOpenTextIcon size={22} weight="duotone" />,
    title: "Developer Portal",
    description:
      "Interactive API documentation with built-in testing and self-serve API key management.",
    color:
      "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50",
  },
];

const sections: Section[] = [
  {
    title: "Get started",
    links: [
      {
        href: "/docs/articles/step-1-setup-basic-gateway",
        title: "Quickstart (Portal)",
        description: "Set up your first API gateway in the Zuplo Portal",
        icon: <RocketIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/articles/step-1-setup-basic-gateway-local",
        title: "Quickstart (Local)",
        description: "Set up a gateway using local development with the CLI",
        icon: <TerminalIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/concepts/how-zuplo-works",
        title: "How Zuplo Works",
        description: "Architecture, edge runtime, and deployment model",
        icon: <GearIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/concepts/request-lifecycle",
        title: "Request Lifecycle",
        description: "How requests flow through the gateway pipeline",
        icon: <CodeIcon size={16} weight="duotone" />,
      },
    ],
  },
  {
    title: "Core features",
    links: [
      {
        href: "/docs/policies/overview",
        title: "Policies",
        description:
          "Add authentication, rate limiting, validation, and 60+ more pre-built policies",
        icon: <ShieldCheckIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/concepts/authentication",
        title: "Authentication",
        description: "API keys, JWT, OAuth, mTLS, and more",
        icon: <LockIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/articles/api-key-management",
        title: "API Key Management",
        description:
          "Built-in API key management with self-serve developer access",
        icon: <KeyIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/articles/monetization",
        title: "Monetization",
        description:
          "Charge for API usage with built-in billing and subscriptions",
        icon: <CurrencyDollarIcon size={16} weight="duotone" />,
      },
    ],
  },
  {
    title: "Deploy and operate",
    links: [
      {
        href: "/docs/concepts/source-control-and-deployment",
        title: "Source Control & Deployments",
        description:
          "Git-based workflows with GitHub, GitLab, Bitbucket, or Azure DevOps",
        icon: <GitBranchIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/articles/hosting-options",
        title: "Hosting Options",
        description:
          "Managed edge, managed dedicated, or self-hosted deployments",
        icon: <CloudIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/articles/logging",
        title: "Observability",
        description:
          "Integrate with Datadog, New Relic, Splunk, and other providers",
        icon: <EyeIcon size={16} weight="duotone" />,
      },
      {
        href: "/docs/programmable-api/overview",
        title: "Programming API",
        description:
          "Extend Zuplo with TypeScript using the request pipeline and runtime APIs",
        icon: <CodeIcon size={16} weight="duotone" />,
      },
    ],
  },
];

export function DocsHome() {
  return (
    <div className="not-prose">
      {/* Subtitle */}
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
        Build, secure, and scale APIs with a fully-managed, programmable API
        gateway. Deploy globally in seconds with Git-based workflows.
      </p>

      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        {products.map((product) => (
          <a
            key={product.href}
            href={product.href}
            className="group no-underline flex gap-4 items-start p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all bg-white dark:bg-gray-900/50"
          >
            <div className={`shrink-0 rounded-lg p-2.5 ${product.color}`}>
              {product.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors m-0">
                {product.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 m-0 mt-0.5 leading-relaxed">
                {product.description}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Feature sections */}
      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {section.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group no-underline flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {link.icon && (
                  <div className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {link.icon}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="font-medium text-[14px] text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                    {link.title}
                  </span>
                  <span className="block text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {link.description}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
