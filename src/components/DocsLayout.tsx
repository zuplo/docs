import { DocsContainer } from "@/components/DocsContainer";
import { DocsHeader } from "@/components/DocsHeader";
import { PrevNextLinks } from "@/components/PrevNextLinks";
import { Prose } from "@/components/Prose";
import { TableOfContents } from "@/components/TableOfContents";
import ArticleRate from "@/components/shared/article/Rate";
import ArticleSupport from "@/components/shared/article/Support";
import { Section } from "@/lib/types";

export function DocsLayout({
  children,
  frontmatter: { title },
  sections = [],
  useRateSection = true,
}: {
  children: React.ReactNode;
  frontmatter: { title?: string };
  sections?: Array<Section>;
  useRateSection?: boolean;
}) {
  return (
    <>
      <DocsContainer>
        <div className="w-full px-1 md:px-8">
          <article>
            <DocsHeader tableOfContents={sections} title={title} />
            <Prose>{children}</Prose>
          </article>
          {useRateSection && <ArticleRate />}
          <ArticleSupport />
          <PrevNextLinks />
        </div>
      </DocsContainer>
      <TableOfContents tableOfContents={sections} />
    </>
  );
}
