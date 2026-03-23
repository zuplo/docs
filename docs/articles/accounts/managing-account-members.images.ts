/**
 * Verify portal screenshots in docs/articles/accounts/managing-account-members.mdx
 * Run: npx tsx docs/articles/accounts/managing-account-members.images.ts
 */
import { imageTest } from "../../../scripts/lib/image-test.ts";

await imageTest(
  "managing-account-members",
  [
    {
      imagePath: "managing-account-members/image.png",
      description:
        "Account Settings > Members page with invite form and member list",
      navigationSteps: [
        'Click on the account settings gear icon or navigate to account "Settings"',
        'Click "Members" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
