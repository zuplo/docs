import BundlesTable from "@/components/BundlesTable";
import { DocsLayout } from "@/components/DocsLayout";

export const metadata = {
  title: "Node Modules",
};

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: metadata.title }} sections={[]}>
      <p>
        Zuplo generally supports node modules, but to ensure the security and
        performance of each API Gateway we must approve each module. This
        process only takes a few hours so if you need something new please reach
        out to use on twitter <a href="https://twitter.com/zuplo">@zuplo</a> or
        through email <a href="mailto:whatzup@zuplo.com">whatzup@zuplo.com</a>.
      </p>
      <p>Below are the currently installed modules.</p>
      <BundlesTable />
    </DocsLayout>
  );
}
