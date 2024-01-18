import { DocsLayout } from "@/components/DocsLayout";
import { Props } from "@/components/QuickLinks";
import Link from "next/link";
import {
  CustomTOCList,
  CustomTOCListContent,
  CustomTOCListHead,
  CustomTOCListSection,
} from "../components/CustomTOCList";

export default async function Page() {
  const overviewItems: Props[] = [
    {
      title: "What is Zuplo?",
      href: "/articles/what-is-zuplo",
      icon: "installation",
      description: "",
    },
    {
      title: "Who uses Zuplo, and why?",
      href: "/articles/who-uses-and-why",
      icon: "installation",
      description: "",
    },
    {
      title: "Zuplo in your stack",
      href: "/articles/zuplo-in-your-stack",
      icon: "installation",
      description: "",
    },
  ];

  const gettingStartedItems: Props[] = [
    {
      title: "Step 1 - Setup Basic Gateway",
      href: "/articles/step-1-setup-basic-gateway",
      icon: "installation",
      description: "",
    },
    {
      title: "Step 2 - API Key Auth",
      href: "/articles/step-2-add-api-key-auth",
      icon: "installation",
      description: "",
    },
    {
      title: "Step 3 - Rate Limiting",
      href: "/articles/step-3-add-rate-limiting",
      icon: "installation",
      description: "",
    },
    {
      title: "Step 4 - Deploying to the Edge",
      href: "/articles/step-4-deploying-to-the-edge",
      icon: "installation",
      description: "",
    },
  ];

  return (
    <DocsLayout frontmatter={{ title: "Zuplo Docs" }} sections={[]}>
      <p>
        Learn how to use Zuplo to add API-key management, developer
        documentation, and rate-limiting, for any stack.
      </p>
      <CustomTOCList>
        <CustomTOCListSection>
          <CustomTOCListHead>OVERVIEW</CustomTOCListHead>
          <CustomTOCListContent>
            <Link href="/articles/what-is-zuplo">What is Zuplo?</Link>
            <Link href="/articles/who-uses-and-why">
              Who uses Zuplo, and why?
            </Link>
            <Link href="/articles/zuplo-in-your-stack">
              Zuplo in your stack
            </Link>
          </CustomTOCListContent>
        </CustomTOCListSection>
        <CustomTOCListSection>
          <CustomTOCListHead>Getting Started</CustomTOCListHead>
          <CustomTOCListContent>
            <Link href="/articles/step-1-setup-basic-gateway">
              Step 1 - Setup Basic Gateway
            </Link>
            <Link href="/articles/step-2-add-api-key-auth">
              Step 2 - API Key Auth
            </Link>
            <Link href="/articles/step-3-add-rate-limiting">
              Step 3 - Rate Limiting
            </Link>
            <Link href="/articles/step-4-deploying-to-the-edge">
              Step 4 - Deploying to the Edge
            </Link>
          </CustomTOCListContent>
        </CustomTOCListSection>
      </CustomTOCList>
    </DocsLayout>
  );
}
