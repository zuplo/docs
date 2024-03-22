import { DocsLayout } from "@/components/DocsLayout";
import { Metadata } from "next";
import InkeepEmbeddedChat from "./embedded";

export const metadata: Metadata = {
  title: "Ask AI Chatbot",
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: "Ask AI Chatbot" }} sections={[]}>
      <div className="h-full w-full lg:h-[1000px]">
        <InkeepEmbeddedChat />
      </div>
    </DocsLayout>
  );
}
