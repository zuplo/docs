import { JSONSchema7 } from "json-schema";

export interface NavCategory {
  label: string;
  items: (NavCategory | NavItem)[];
}

export interface NavItem {
  label: string;
  href: string;
}

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
  files: {
    iconSvg?: string;
    introMd?: string;
    docMd?: string;
    policyTs?: string;
  };
}
