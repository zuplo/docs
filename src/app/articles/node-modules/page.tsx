import BundlesTable from "@/components/BundlesTable";
import { DocsLayout } from "@/components/DocsLayout";
import Callout from "../../../components/markdown/Callout";

export const metadata = {
  title: "Node Modules",
  description:
    "List of Node Modules supported by Zuplo. To ensure the security and performance, we must approve each module.",
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
        out support by emailing{" "}
        <a href="mailto:support@zuplo.com">support@zuplo.com</a>.
      </p>
      <p>
        Additionally, you can also bundle custom modules inside of your own
        project. This process does require some knowledge of node and npm, but
        it allows you to use any module or version of the module. To learn how
        to bundle your own modules, see the sample{" "}
        <a href="https://github.com/zuplo/zuplo/tree/main/examples/custom-module">
          Custom Modules on Github
        </a>
        .
      </p>
      <Callout type="caution" title="Type Checking Errors">
        <p>
          When referencing a custom module in the Zuplo Portal, you might see
          that the module has a red underline in your code editor. Some modules
          are not typed or their types cannot be bundled to use with the Zuplo
          Portal.
        </p>
        <p>
          You can ignore these errors as they will not affect the functionality
          of the module. Alternatively, if you use{" "}
          <a href="/docs/articles/local-development">local development</a> you
          can install the module locally to enable code completion and type
          checking.
        </p>
      </Callout>

      <p>Below are the currently installed modules.</p>
      <BundlesTable />
    </DocsLayout>
  );
}
