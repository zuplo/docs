import { guides } from "../src/guides.js";
import { categories } from "../sidebar.guides.js";

// Collect all categories used in guides
const usedCategories = new Set<string>();
for (const guide of guides) {
  for (const category of guide.categories) {
    usedCategories.add(category);
  }
}

// Find categories that are defined but never used
const unusedCategories = categories.filter(
  (cat) => !usedCategories.has(cat.slug),
);

// Print results
console.log(`${"=".repeat(60)}`);
console.log(`Category Usage Report`);
console.log(`${"=".repeat(60)}`);
console.log(`\nTotal categories defined: ${categories.length}`);
console.log(`Total categories used: ${usedCategories.size}`);
console.log(`Total categories unused: ${unusedCategories.length}`);

if (unusedCategories.length > 0) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Unused Categories:`);
  console.log(`${"=".repeat(60)}`);
  for (const category of unusedCategories) {
    console.log(`  - ${category.slug} (${category.label})`);
  }
  console.log(
    `\n💡 Tip: Consider removing unused categories or adding guides for them.`,
  );
} else {
  console.log(`\n✅ All categories are being used!`);
}

console.log(`${"=".repeat(60)}\n`);

// Optional: Show usage count per category
console.log(`Category Usage Counts:`);
console.log(`${"=".repeat(60)}`);

const categoryUsageCount = new Map<string, number>();
for (const guide of guides) {
  for (const category of guide.categories) {
    categoryUsageCount.set(
      category,
      (categoryUsageCount.get(category) || 0) + 1,
    );
  }
}

// Sort by usage count (descending)
const sortedCategories = categories
  .map((cat) => ({
    ...cat,
    count: categoryUsageCount.get(cat.slug) || 0,
  }))
  .sort((a, b) => b.count - a.count);

for (const category of sortedCategories) {
  const bar = "█".repeat(category.count);
  console.log(
    `  ${category.slug.padEnd(25)} ${String(category.count).padStart(2)} ${bar}`,
  );
}

console.log(`${"=".repeat(60)}\n`);
