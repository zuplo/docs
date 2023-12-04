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
      <div className="sticky top-[4.75rem] -ml-0.5 flex h-[calc(100vh-10rem)] min-w-0 max-w-2xl overflow-y-auto overflow-x-hidden py-[60px] lg:max-w-none">
        <div className="px-8">
          <article>
            <DocsHeader title={title} />
            <Prose>{children}</Prose>
          </article>
          <PrevNextLinks />
        </div>
        <TableOfContents tableOfContents={sections} />
      </div>
    </>
  );
}
