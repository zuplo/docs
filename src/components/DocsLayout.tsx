import { DocsContainer } from "@/components/DocsContainer";
import { DocsHeader } from "@/components/DocsHeader";
import { PrevNextLinks } from "@/components/PrevNextLinks";
import { Prose } from "@/components/Prose";
import { TableOfContents } from "@/components/TableOfContents";
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
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </DocsContainer>
      <TableOfContents tableOfContents={sections} />
    </>
  );
}
