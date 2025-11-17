import { guides } from "../src/guides.js";
import { categories } from "../sidebar.guides.js";

// Group guides by category
const guidesByCategory = new Map<
  string,
  Array<{ title: string; id: string }>
>();

for (const guide of guides) {
  for (const category of guide.categories) {
    if (!guidesByCategory.has(category)) {
      guidesByCategory.set(category, []);
    }
    guidesByCategory.get(category)!.push({
      title: guide.title,
      id: guide.id,
    });
  }
}

// Print detailed breakdown
console.log("CURRENT CATEGORY BREAKDOWN");
console.log("=".repeat(80));

// Sort by usage count
const sortedCategories = Array.from(guidesByCategory.entries()).sort(
  (a, b) => b[1].length - a[1].length,
);

for (const [categorySlug, guidesList] of sortedCategories) {
  const categoryInfo = categories.find((c) => c.slug === categorySlug);
  console.log(
    `\n### ${categoryInfo?.label} (${categorySlug}) - ${guidesList.length} guides`,
  );
  console.log("-".repeat(80));
  for (const guide of guidesList) {
    console.log(`  - ${guide.title}`);
  }
}

// Show unused categories
console.log("\n\n### UNUSED CATEGORIES");
console.log("-".repeat(80));
const usedSlugs = new Set(guidesByCategory.keys());
for (const category of categories) {
  if (!usedSlugs.has(category.slug)) {
    console.log(`  - ${category.label} (${category.slug})`);
  }
}

console.log("\n");
