/**
 * Verify portal screenshots in docs/articles/rename-or-move-project.mdx
 * Run: npx tsx docs/articles/rename-or-move-project.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "rename-or-move-project",
  [
    {
      imagePath: "rename-or-move-project/image.png",
      description:
        "Settings > Source Control showing Connected Git Repository and disconnect option",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Source Control" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
