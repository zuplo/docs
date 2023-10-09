import { DocsLayout } from "@/components/DocsLayout";
import { QuickLink, QuickLinks } from "@/components/QuickLinks";

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: "Zuplo Docs" }} sections={[]}>
      Learn how to use Zuplo to add API-key management, developer documentation,
      and rate-limiting, for any stack.
      <QuickLinks>
        <QuickLink
          title="Test"
          href="/test"
          icon="installation"
          description="Hello world"
        />{" "}
        <QuickLink
          title="Test"
          href="/test"
          icon="installation"
          description="Hello world"
        />
        <QuickLink
          title="Test"
          href="/test"
          icon="installation"
          description="Hello world"
        />
        <QuickLink
          title="Test"
          href="/test"
          icon="installation"
          description="Hello world"
        />
      </QuickLinks>
    </DocsLayout>
  );
}
