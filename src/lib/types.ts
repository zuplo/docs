import { JSONSchema7 } from "json-schema";
import { Icon } from "@/components/Icon";
import { NavigationType } from "@/lib/enums/navigation-type";

export type PolicyMeta = {
  name: string;
  isPreview: boolean;
  isPaidAddOn: boolean;
  isDeprecated: boolean;
  fakePolicyUrl?: string;
  href: string;
  id: string;
  icon: string;
};

export type PolicySchema = JSONSchema7 & {
  isPreview?: boolean;
  isDeprecated?: boolean;
  isPaidAddOn?: boolean;
  fakePolicyUrl?: string;
  isCustom?: boolean;
};

export type Section = {
  id: string;
  title: string;
  level: number;
  children: Array<Section>;
};

export type Bundle = {
  name: string;
  version: string;
  types: string;
  files: Array<string>;
  description: string;
  url: string;
  public: boolean;
};

export type NavCategory = {
  label: string;
  href?: string;
  type?: NavigationType;
  isExternal?: boolean;
  items?: Array<NavCategory>;
};

export type QuickLinkItem = {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
};
