import * as shiki from "shiki";
import { CodeGroup } from "./Code";

export async function Fence({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  const highlighter = await shiki.getHighlighter({
    theme: "github-dark",
  });

  const html = highlighter.codeToHtml(children, { lang: language });
  return (
    <CodeGroup
      code={children}
      title={""}
      backgroundColor={highlighter.getBackgroundColor()}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeGroup>
  );
}
