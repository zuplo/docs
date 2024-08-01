import { DocsLayout } from "@/components/DocsLayout";
import { Metadata } from "next";
import Link from "next/link";
import {
  CustomTOCList,
  CustomTOCListContent,
  CustomTOCListHead,
  CustomTOCListSection,
} from "../components/CustomTOCList";

export const metadata: Metadata = {
  title: "Zuplo Docs",
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
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
          </CustomTOCListContent>
        </CustomTOCListSection>
        <CustomTOCListSection>
          <CustomTOCListHead>Getting Started</CustomTOCListHead>
          <CustomTOCListContent>
            <Link href="/articles/step-1-setup-basic-gateway">
              Step 1 - Setup Basic Gateway
            </Link>
            <Link href="/articles/step-2-add-rate-limiting">
              Step 2 - Rate Limiting
            </Link>
            <Link href="/articles/step-3-add-api-key-auth">
              Step 3 - API Key Auth
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
