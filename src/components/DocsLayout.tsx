import { DocsHeader } from "@/components/DocsHeader";
import { PrevNextLinks } from "@/components/PrevNextLinks";
import { Prose } from "@/components/Prose";
import { TableOfContents } from "@/components/TableOfContents";
import { Section } from "@/lib/interfaces";
import { DocsFooter } from "./DocsFooter";

export function DocsLayout({
  children,
  frontmatter: { title },
  sections,
  filepath,
}: {
  children: React.ReactNode;
  frontmatter: { title?: string };
  sections: Array<Section>;
  filepath?: string;
}) {
  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-12 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
          {filepath && <DocsFooter filepath={filepath} />}
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={sections} />
    </>
  );
}
