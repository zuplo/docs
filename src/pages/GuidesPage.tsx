import { useState } from "react";
import { Head } from "zudoku/components";

interface Guide {
  id: string;
  title: string;
  description: string;
  categories: string[];
  page: string;
}

const guides: Guide[] = [
  {
    id: "1",
    title: "Adding a response header",
    description: "Learn how to add a response header in your Middleware.",
    categories: ["API & CLI", "Functions"],
    page: "articles/monetization",
  },
  {
    id: "2",
    title: "Block PHP Requests",
    description: "Learn how to block traffic looking for .php vulnerabilities.",
    categories: ["API & CLI", "Edge Network & Caching"],
    page: "articles/block-php-requests",
  },
  {
    id: "3",
    title: "Challenge Cookieless Requests on a Specific Path",
    description:
      "Learn how to challenge specific requests with the Vercel WAF API.",
    categories: ["Edge Network & Caching", "Functions"],
    page: "articles/challenge-cookieless-requests",
  },
  {
    id: "4",
    title: "Challenge cURL Requests",
    description:
      "Learn how to challenge curl requests with the Vercel WAF API.",
    categories: ["API & CLI", "Edge Network & Caching"],
    page: "articles/challenge-curl-requests",
  },
  {
    id: "5",
    title: "Deny non-browser Traffic or Blocklisted ASNs",
    description:
      "Learn how to block traffic from known threats with the Vercel WAF API.",
    categories: ["Edge Network & Caching", "Functions"],
    page: "articles/deny-non-browser-traffic",
  },
  {
    id: "6",
    title: "Deny traffic from a Set of IP Addresses",
    description: "Learn how to deny traffic from specific IP addresses.",
    categories: ["Edge Network & Caching", "API & CLI"],
    page: "articles/deny-ip-addresses",
  },
];

const categories = [
  "Account, Projects & Teams",
  "AI",
  "Analytics",
  "API & CLI",
  "Backends",
  "BotID",
  "Build, Deployment & Git",
  "Databases & CMS",
  "Domains & DNS",
  "Edge Network & Caching",
  "Environment Variables",
  "Frameworks",
  "Functions",
  "Integrations & Logs",
  "Limits, Usage and Pricing",
];

export const GuidesPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const filteredGuides =
    selectedCategories.length === 0
      ? guides
      : guides.filter((guide) =>
          guide.categories.some((cat) => selectedCategories.includes(cat)),
        );

  return (
    <section>
      <Head>
        <title>Guides</title>
      </Head>
      <div className="text-center my-10 md:my-16">
        <h1 className="text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
          Guides
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover step-by-step guides to help you build and deploy with Zuplo.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-5">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Filter Guides</h2>
            <div className="space-y-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="space-y-6">
            {filteredGuides.map((guide) => (
              <a
                key={guide.id}
                href={`/docs/${guide.page}`}
                className="block p-6 border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all bg-background"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground">{guide.description}</p>
              </a>
            ))}
            {filteredGuides.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No guides found matching the selected filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};
