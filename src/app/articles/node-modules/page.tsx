import BundlesTable from "@/components/BundlesTable";
import { DocsLayout } from "@/components/DocsLayout";

export const metadata = {
  title: "Node Modules",
  alternates: {
    canonical: `/articles/node-modules`,
  },
};

export default async function Page() {
  return (
    <DocsLayout frontmatter={{ title: metadata.title }} sections={[]}>
      <p>
        Zuplo supports certain node modules, but to ensure the security and
        performance of each API Gateway we must approve each module. This
        process only takes a few hours so if you need something new please reach
        out support by emailing
        <a href="mailto:support@zuplo.com">support@zuplo.com</a>.
      </p>
      <p>
        Additionally, you can also bundle custom modules inside of your own
        project. This process is does require some knowledge of node and npm,
        but it allows you to use any module or version of the module. To learn
        how to bundle your own modules, see the sample{" "}
        <a href="https://github.com/zuplo/zuplo/tree/main/examples/custom-module">
          Custom Modules on Github
        </a>
        .
      </p>
      <p>Below are the currently installed modules.</p>
      <BundlesTable />
    </DocsLayout>
  );
}
