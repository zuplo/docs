import Link from "next/link";
import { DocsHeader } from "../../../components/DocsHeader";
import { getAllPolicies } from "../../../lib/policies";

export default async function Page() {
  const policies = await getAllPolicies();

  return (
    <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-4 prose">
      <DocsHeader title="Policies" />
      <p>
        Zuplo includes policies for any solution you need for securing and
        sharing your API. See the{" "}
        <Link href="/docs/policies">policy introduction</Link> to learn about
        using policies.
      </p>

      <p>
        The <Link href="/docs/articles/custom-cors-policy">CORS policy</Link> is
        a special type of policy that is configured separately. Check out
        details
        <Link href="/docs/articles/custom-cors-policy">here</Link>.
      </p>

      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 not-prose pl-0 list-none"
      >
        {policies
          .sort((a, b) => a.meta.name.localeCompare(b.meta.name))
          .map((item, index) => (
            <li
              key={item.meta.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border hover:bg-gray-100 border-gray-500 pl-0"
            >
              <a key={item.meta.id} href={item.meta.href}>
                <div className="flex flex-col">
                  <img
                    src={item.meta.icon}
                    width={48}
                    height={48}
                    className="mx-auto my-3"
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
