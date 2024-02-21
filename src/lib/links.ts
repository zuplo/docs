import { LinkData } from "@/lib/interfaces";

export const docsLink: LinkData = {
  href: "/",
  name: "Docs",
};

export const wwwLink: LinkData = {
  href: "https://zuplo.com",
  name: "Website",
};

export const pricingLink: LinkData = {
  href: `${wwwLink.href}/pricing`,
  name: "Pricing",
};

export const blogLink: LinkData = {
  href: `${wwwLink.href}/blog`,
  name: "Blog",
};

export const signInLink: LinkData = {
  href: "https://portal.zuplo.com/",
  name: "Sign In",
};

export const customStories: LinkData = {
  name: "Customer Stories",
  href: `${wwwLink.href}/resources`,
};

export const changeLogLink: LinkData = {
  href: `${wwwLink.href}/changelog`,
  name: "Changelog",
};

export const comparisonLinks: Array<LinkData> = [
  {
    href: `${wwwLink.href}/api-gateways/kong-alternative-zuplo`,
    name: "vs. Kong",
  },
  {
    href: `${wwwLink.href}/api-gateways/azure-api-management-alternative-zuplo`,
    name: "vs. Azure API Management",
  },
  {
    href: `${wwwLink.href}/api-gateways/apigee-alternative-zuplo`,
    name: "vs. Apigee",
  },
  {
    href: `${wwwLink.href}/api-gateways/tyk-api-management-alternative-zuplo`,
    name: "vs. Tyk",
  },
  {
    href: `${wwwLink.href}/api-gateways/solo-alternative-zuplo`,
    name: "vs. Solo.io",
  },
  {
    href: `${wwwLink.href}/api-gateways/aws-api-gateway-alternative-zuplo`,
    name: "vs. AWS API Gateway",
  },
].sort((l1, l2) => l1.name.localeCompare(l2.name));

export const featuresLinks: Array<LinkData> = [
  {
    href: `${wwwLink.href}/features/api-key-management`,
    name: "API Key Management",
    shortDescription: "Create and manage API keys.",
  },
  {
    href: `${wwwLink.href}/features/developer-portal`,
    name: "Developer Portal",
    shortDescription: "Beautiful API documentation.",
  },
  {
    href: `${wwwLink.href}/features/multi-cloud`,
    name: "Multi-cloud",
    shortDescription: "Route to any backend",
  },
  {
    href: `${wwwLink.href}/features/open-api`,
    name: "OpenAPI Native",
    shortDescription: "Import and start instantly.",
  },
  {
    href: `${wwwLink.href}/features/programmable`,
    name: "Programmable",
    shortDescription: "Customize it your way.",
  },
  {
    href: `${wwwLink.href}/features/rate-limiting`,
    name: "Rate Limiting",
    shortDescription: "Control number of requests.",
  },
  {
    href: `${wwwLink.href}/features/unlimited-environments`,
    name: "Unlimited Environments",
    shortDescription: "Deploy in seconds from git",
  },
  {
    href: "/policies",
    name: "Policies",
    shortDescription: "Add policies to your APIs.",
  },
].sort((l1, l2) => l1.name.localeCompare(l2.name));

export const docsRepoBaseEditLink: LinkData = {
  href: "https://github.com/zuplo/docs/edit/main",
  name: "Zuplo Documentation",
};
