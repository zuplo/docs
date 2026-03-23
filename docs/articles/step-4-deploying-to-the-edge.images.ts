/**
 * Verify portal screenshots in docs/articles/step-4-deploying-to-the-edge.mdx
 * Run: npx tsx docs/articles/step-4-deploying-to-the-edge.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "step-4-deploying",
  [
    {
      imagePath: "step-4-deploying-to-the-edge/image.png",
      description: "Branch/environment selector dropdown in bottom status bar",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
      ],
    },
    {
      imagePath: "step-4-deploying-to-the-edge/image-1.png",
      description:
        "Settings > Source Control page with Connect to GitHub button",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Source Control" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
