import Pre from "@/components/Pre";
import { MDXProvider } from "@mdx-js/react";
import Callout from "./Callout";
import { Card, CardGroup } from "./Card";
import Icon from "./Icon";
import { EnterpriseFeature } from "./Plans";
import ZupIt from "./ZupIt";

const components: React.ComponentProps<typeof MDXProvider>["components"] = {
  Icon,
  EnterpriseFeature,
  Callout,
  ZupIt,
  Card,
  CardGroup,
  pre: Pre,
  // pre: Fence as any,
  img: (props) => (
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    <img {...props} className="border border-gray-300 rounded-md" />
  ),
};

export default components;
