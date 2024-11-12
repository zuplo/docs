import { JSONSchema7 } from "json-schema";

export type NavItem = {
  label: string;
  href?: string;
  hideItems?: boolean;
  items?: Array<NavItem>;
  isExpandedByDefault?: boolean;
};

export interface Policy {
  policyId: string;
  schema: JSONSchema7 & {
    isBeta?: boolean;
    isCustom?: boolean;
    isDeprecated?: boolean;
    isPaidAddOn?: boolean;
    isEnterprise?: boolean;
    isHidden?: boolean;
    isInternal?: boolean;
    deprecatedMessage?: string;
  };
  icon: string;
  files: {
    iconSvg?: string;
    introMd?: string;
    docMd?: string;
    policyTs?: string;
  };
}

export type Section = {
  id: string;
  title: string;
  level: number;
  children: Array<Section>;
};

export interface LinkData {
  name: string;
  href: string;
  shortDescription?: string;
  event?: EventName;
}

export interface LinksCategory {
  name: string;
  links: Array<LinkData>;
}

export type EventName =
  | "sign-in-clicked"
  | "start-free-cta-clicked"
  | "pricing-clicked"
  | "book-demo-cta-clicked";
