import { JSONSchema7 } from "json-schema";

export type NavItem = {
  label: string;
  href?: string;
  items?: Array<NavItem>;
};

export interface Policy {
  policyId: string;
  schema: JSONSchema7 & {
    isPreview?: boolean;
    isCustom?: boolean;
    isDeprecated?: false;
    isPaidAddOn?: false;
    isUnlisted?: false;
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
}

export interface LinksCategory {
  name: string;
  links: Array<LinkData>;
}
