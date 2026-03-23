/**
 * Verify portal screenshots in docs/articles/environments.mdx
 * Run: npx tsx docs/articles/environments.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "environments",
  [
    {
      imagePath: "environments/image.png",
      description: "Branch/environment selector dropdown in bottom status bar",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
      ],
    },
  ],
  import.meta.filename,
);
