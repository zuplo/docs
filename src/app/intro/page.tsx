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

  const gettingStartedItems: Array<QuickLinkItem> = [
    {
      id: nanoid(),
      title: "Step 1 - Setup Basic Gateway",
      href: "/articles/step-1-setup-basic-gateway",
      icon: "installation",
    },
    {
      id: nanoid(),
      title: "Step 2 - API Key Auth",
      href: "/articles/step-2-add-api-key-auth",
      icon: "installation",
    },
    {
      id: nanoid(),
      title: "Step 3 - Rate Limiting",
      href: "/articles/step-3-add-rate-limiting",
      icon: "installation",
    },
    {
      id: nanoid(),
      title: "Step 4 - Deploying to the Edge",
      href: "/articles/step-4-deploying-to-the-edge",
      icon: "installation",
    },
  ];

  return (
    <DocsLayout frontmatter={{ title: "Zuplo Docs" }} useRateSection={false}>
      Learn how to use Zuplo to add API-key management, developer documentation,
      and rate-limiting, for any stack.
      <h2>Overview</h2>
      <QuickLinks items={overviewItems} />
      <h2>Getting Started</h2>
      <QuickLinks items={gettingStartedItems} />
    </DocsLayout>
  );
}
