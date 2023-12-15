import { DocsLayout } from "@/components/DocsLayout";
import Link from "next/link";

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: "Zuplo CLI" }} useRateSection={false}>
      <p>
        The Zuplo CLI, <code>zup</code>, provides convenient tooling for common
        tasks that you might want to automate. You can use it to deploy zups
        through CI/CD, create and update environment variables, manage your
        tunnels, and more! It is powered by the{" "}
        <Link
          href="https://dev.zuplo.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink underline transition-colors hover:text-pink-hover"
        >
          Zuplo Developer API
        </Link>{" "}
        , which you can also call directly, if you want to create your own
        tooling.
      </p>
    </DocsLayout>
  );
}
