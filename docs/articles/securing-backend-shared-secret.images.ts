/**
 * Verify portal screenshots in docs/articles/securing-backend-shared-secret.mdx
 * Run: npx tsx docs/articles/securing-backend-shared-secret.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "securing-backend-shared-secret",
  [
    {
      imagePath: "securing-backend-shared-secret/image.png",
      description:
        "Environment variable creation dialog (Name, Value, Secret toggle)",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Environment Variables" in the sidebar',
        'Click "Add new variable" button',
      ],
    },
  ],
  import.meta.filename,
);
