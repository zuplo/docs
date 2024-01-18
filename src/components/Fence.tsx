import { ReactElement } from "react";
import { compileMdxFragment } from "../lib/markdown/mdx";

export async function Fence({
  children,
  language,
}: {
  children: string | ReactElement;
  language: string;
}) {
  let raw: string;
  let lang: any;
  if (typeof children === "string") {
    raw = children;
    lang = language;
  } else if (children.type === "code") {
    raw = children.props.children;
    lang = children.props.className?.replace("language-", "") ?? "txt";
  } else {
    throw new Error("Invalid use of component");
  }

  const mdx = `\`\`\`${lang}\n${raw}\n\`\`\``;
  const html = await compileMdxFragment(mdx);
  return <>{html}</>;
}
