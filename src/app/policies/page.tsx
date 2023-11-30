import { Metadata } from "next";
import Link from "next/link";
import { DocsHeader } from "../../components/DocsHeader";
import { getAllPolicies } from "../../lib/policies";

export const metadata: Metadata = {
  title: "Policies",
};

export default async function Page() {
  const policies = await getAllPolicies();

  return (
    <div className="prose min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-4">
      <DocsHeader title="Policies" />
      <p>
        Zuplo includes policies for any solution you need for securing and
        sharing your API. See the{" "}
        <Link href="/policies">policy introduction</Link> to learn about using
        policies.
      </p>

      <p>
        The <Link href="/articles/custom-cors-policy">CORS policy</Link> is a
        special type of policy that is configured separately. Check out details
        <Link href="/articles/custom-cors-policy">here</Link>.
      </p>

      <ul
        role="list"
        className="not-prose mt-8 grid list-none grid-cols-1 gap-6 pl-0 sm:grid-cols-2 lg:grid-cols-3"
      >
        {policies
          .sort((a, b) => a.meta.name.localeCompare(b.meta.name))
          .map((item, index) => (
            <li
              key={item.meta.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg border border-gray-500 bg-white pl-0 hover:bg-gray-100"
            >
              <a key={item.meta.id} href={item.meta.href}>
                <div className="flex flex-col">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.meta.icon}
                    width={48}
                    height={48}
                    className="mx-auto my-3"
                    alt={item.meta.name}
                  />

                  <div className="mx-auto mb-3 text-center">
                    {item.meta.name}
                  </div>
                </div>
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
