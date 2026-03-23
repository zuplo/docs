/**
 * Verify portal screenshots in docs/articles/accounts/managing-project-members.mdx
 * Run: npx tsx docs/articles/accounts/managing-project-members.images.ts
 */
import { imageTest } from "../../../scripts/lib/image-test.ts";

await imageTest(
  "managing-project-members",
  [
    {
      imagePath: "managing-project-members/image-1.png",
      description:
        "Settings > Members & Access page showing project members and roles",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Members & Access" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
