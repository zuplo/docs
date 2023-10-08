import { JSONSchema7 } from "json-schema";

export interface PolicyMeta {
  name: string;
  isPreview: boolean;
  isPaidAddOn: boolean;
  isDeprecated: boolean;
  fakePolicyUrl: string | undefined;
  href: string;
  id: string;
  icon: string;
  introMd: string;
  docMd: string;
}

export interface PolicySchema extends JSONSchema7 {
  isPreview?: boolean;
  isDeprecated?: boolean;
  isPaidAddOn?: boolean;
  fakePolicyUrl?: string;
}
