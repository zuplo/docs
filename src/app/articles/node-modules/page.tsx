import { DocsLayout } from "@/components/DocsLayout";
import { Bundle } from "@/lib/types";
import { readFile } from "fs/promises";
import { Metadata } from "next";
import Link from "next/link";
import { join } from "path";

export const metadata: Metadata = {
  title: "Node Modules",
};

export default async function Page() {
  const data = (
    (await readFile(join(process.cwd(), "./bundles.json"), "utf-8").then(
      JSON.parse,
    )) as { bundles: Bundle[] }
  ).bundles.filter((bundle) => bundle.public);

  return (
    <DocsLayout frontmatter={{ title: "Node Modules" }}>
      <p>
        Zuplo generally supports node modules, but to ensure the security and
        performance of each API Gateway we must approve each module. This
        process only takes a few hours so if you need something new please reach
        out to use on twitter{" "}
        <Link href="https://twitter.com/zuplo">@zuplo</Link> or through email
        <Link href="mailto:whatzup@zuplo.com">whatzup@zuplo.com</Link>
      </p>

      <p>Below are the currently installed modules.</p>

      <table>
        <thead>
          <tr>
            <td>Module</td>
            <td>Version</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          {data.map((bundle) => (
            <tr key={bundle.name}>
              <td>
                <a
                  href={
                    bundle.url ?? `https://www.npmjs.com/package/${bundle.name}`
                  }
                >
                  {bundle.name}
                </a>
              </td>
              <td>{bundle.version}</td>
              <td>{bundle.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DocsLayout>
  );
}
