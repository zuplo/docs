import { ReactElement } from "react";
import * as shiki from "shiki";
import { CodeGroup } from "./Code";

export async function Fence({
  children,
  language,
}: {
  children: string | ReactElement;
  language: string;
}) {
  const highlighter = await shiki.getHighlighter({
    theme: "github-dark",
  });

  let code: string;
  let lang: string;
  if (typeof children === "string") {
    code = children;
    lang = language;
  } else if (children.type === "code") {
    code = children.props.children;
    lang = children.props.className?.replace("language-", "") ?? "txt";
  } else {
    throw new Error("Invalid use of component");
  }

  const html = highlighter.codeToHtml(code, { lang });
  return (
    <CodeGroup
      code={code}
      title={""}
      backgroundColor={highlighter.getBackgroundColor()}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeGroup>
  );
}
