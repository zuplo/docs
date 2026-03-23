/**
 * Verify portal screenshots in docs/articles/accounts/zuplo-api-keys.mdx
 * Run: npx tsx docs/articles/accounts/zuplo-api-keys.images.ts
 */
import { imageTest } from "../../../scripts/lib/image-test.ts";

await imageTest(
  "zuplo-api-keys",
  [
    {
      imagePath: "zuplo-api-keys/image.png",
      description: "Account Settings > API Keys page showing API key entries",
      navigationSteps: [
        'Click on the account settings gear icon or navigate to account "Settings"',
        'Click "API Keys" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
