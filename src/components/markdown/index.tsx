import Pre from "@/components/Pre";
import GithubButton from "@/components/markdown/GithubButton";
import { MDXProvider } from "@mdx-js/react";
import Callout from "./Callout";
import ZupIt from "./ZupIt";
import * as UIIcons from "./ui-icons";

const components: React.ComponentProps<typeof MDXProvider>["components"] = {
  ...UIIcons,
  GithubButton,
  Callout,
  ZupIt,
  pre: Pre,
  // pre: Fence as any,
  img: (props) => (
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    <img {...props} className="border border-gray-300 rounded-md" />
  ),
};

export default components;
