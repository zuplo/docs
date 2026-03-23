/**
 * Verify portal screenshots in docs/articles/custom-domains.mdx
 * Run: npx tsx docs/articles/custom-domains.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "custom-domains",
  [
    {
      imagePath: "custom-domains/image.png",
      description:
        "Settings > Custom Domains page with Add New Custom Domain button",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Custom Domains" in the sidebar',
      ],
    },
  ],
  import.meta.filename,
);
