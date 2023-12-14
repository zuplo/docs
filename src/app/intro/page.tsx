import { DocsLayout } from "@/components/DocsLayout";
import { QuickLink, QuickLinks } from "@/components/QuickLinks";
import { QuickLinkItem } from "@/lib/types";
import { nanoid } from "nanoid";

export default async function Page() {
  const overviewItems: Array<QuickLinkItem> = [
    {
      id: nanoid(),
      title: "What is Zuplo?",
      href: "/articles/what-is-zuplo",
      icon: "installation",
    },
    {
      id: nanoid(),
      title: "Who uses Zuplo, and why?",
      href: "/articles/who-uses-and-why",
      icon: "installation",
    },
    {
      id: nanoid(),
      title: "Zuplo in your stack",
      href: "/articles/zuplo-in-your-stack",
      icon: "installation",
    },
  ];

  return (
    <DocsLayout
      frontmatter={{ title: "Zuplo Docs" }}
      sections={[]}
      useRateSection={false}
    >
      Learn how to use Zuplo to add API-key management, developer documentation,
      and rate-limiting, for any stack.
      <h2>Overview</h2>
      <QuickLinks>
        {overviewItems.map((item) => (
          <QuickLink
            key={item.id}
            title={item.title}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </QuickLinks>
    </DocsLayout>
  );
}
