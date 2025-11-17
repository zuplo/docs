import { useState, useEffect } from "react";
import { Head } from "zudoku/components";
import { useSearchParams } from "zudoku/router";
import { guides } from "../guides";
import { categories } from "../../sidebar.guides";

export const GuidesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Sync state with URL on mount and when URL changes
  useEffect(() => {
    const categoriesParam = searchParams.get("categories");
    const urlCategories = categoriesParam
      ? categoriesParam.split(",").filter(Boolean)
      : [];
    setSelectedCategories(urlCategories);
  }, [searchParams]);

  // Update URL when categories change (but not on initial load)
  const updateCategories = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
    if (newCategories.length > 0) {
      setSearchParams(
        { categories: newCategories.join(",") },
        { replace: true },
      );
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    updateCategories(newCategories);
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
        <h1 className="text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl">
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
                  key={category.slug}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.slug)}
                    onChange={() => toggleCategory(category.slug)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm">{category.label}</span>
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
              <div className="py-12 text-muted-foreground">
                No guides found matching the selected filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};
