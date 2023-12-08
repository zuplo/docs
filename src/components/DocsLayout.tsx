import { DocsContainer } from "@/components/DocsContainer";
import { DocsHeader } from "@/components/DocsHeader";
import { PrevNextLinks } from "@/components/PrevNextLinks";
import { Prose } from "@/components/Prose";
import { TableOfContents } from "@/components/TableOfContents";
import ArticleRate from "@/components/shared/article/Rate";
import ArticleSupport from "@/components/shared/article/Support";
import { Section } from "@/lib/interfaces";

export function DocsLayout({
  children,
  frontmatter: { title },
  sections,
}: {
  children: React.ReactNode;
  frontmatter: { title?: string };
  sections: Section[];
}) {
  return (
    <>
      <DocsContainer>
        <div className="w-full px-1 md:px-8">
          <article>
            <DocsHeader title={title} />
            <Prose>{children}</Prose>
          </article>
          <ArticleRate />
          <ArticleSupport />
          <PrevNextLinks />
        </div>
      </DocsContainer>
      <TableOfContents tableOfContents={sections} />
    </>
  );
}
