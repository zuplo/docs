/**
 * Verify portal screenshots in docs/articles/bypass-policy-for-testing.mdx
 * Run: npx tsx docs/articles/bypass-policy-for-testing.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "bypass-policy-for-testing",
  [
    {
      imagePath: "bypass-policy-for-testing/image.png",
      description: "Create consumer dialog with testApiKey metadata JSON",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
        'Click "Configure" on the API Key Service',
        'Click "Create Consumer" button',
      ],
    },
  ],
  import.meta.filename,
);
