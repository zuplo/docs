import { guides as guideMetadata, type Guide } from "../guides.js";
import { guides as guidesNav } from "../../sidebar.guides.js";

// Extract categories and their guide paths from the sidebar navigation structure
const sidebarCategories: { label: string; guides: Guide[] }[] = (
  guidesNav as any[]
)
  .filter((item) => typeof item === "object" && item.type === "category")
  .map((cat) => ({
    label: cat.label as string,
    guides: (cat.items as unknown[])
      .filter((item): item is string => typeof item === "string")
      .map((path) => guideMetadata.find((g) => g.page === path))
      .filter((g): g is Guide => g !== undefined),
  }))
  .filter((cat) => cat.guides.length > 0);

export const GuidesOverview = () => {
  return (
    <div className="space-y-10">
      {sidebarCategories.map((category) => (
        <div key={category.label}>
          <h3>{category.label}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.guides.map((guide) => (
              <a
                key={guide.id}
                href={`/docs/${guide.page}`}
                className="no-underline block p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all group"
              >
                <h4 className="group-hover:text-primary transition-colors">
                  {guide.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed m-0">
                  {guide.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
