import { DocsLayout } from "@/components/DocsLayout";
import { getContentFromDir } from "@/lib/content";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zuplo Errors",
  alternates: {
    canonical: "/errors",
  },
};

export default async function Page() {
  const errorPages = await getContentFromDir("errors");
  return (
    <DocsLayout frontmatter={{ title: `Zuplo Errors` }} sections={[]}>
      <p>
        We hope you don&apos;t run into any errors, but if you do, Zuplo
        provides detailed error messages to help you diagnose and fix the
        problem.
      </p>

      <div role="list" className="mt-8" data-testid="policies-grid">
        {Object.values(errorPages).map((errorPage) => (
          <li key={errorPage.slug.join()}>
            <Link href={errorPage.href}>{errorPage.data.title}</Link>
          </li>
        ))}
      </div>
    </DocsLayout>
  );
}
