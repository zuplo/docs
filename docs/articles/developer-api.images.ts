/**
 * Verify portal screenshots in docs/articles/developer-api.mdx
 * Run: npx tsx docs/articles/developer-api.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "developer-api",
  [
    {
      imagePath: "developer-api/b2cd0a7b-64f0-4e5d-90eb-c9efcf97d34a.png",
      description: "Account Settings > API Keys page",
      navigationSteps: [
        'Click on the account settings gear icon or navigate to account "Settings"',
        'Click "API Keys" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
