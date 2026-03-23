/**
 * Verify portal screenshots in docs/articles/step-2-add-rate-limiting.mdx
 * Run: npx tsx docs/articles/step-2-add-rate-limiting.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "step-2-add-rate-limiting",
  [
    {
      imagePath: "step-2-add-rate-limiting/image.png",
      description: "Route with Policies section and URL Forward handler",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
      ],
    },
    {
      imagePath: "step-2-add-rate-limiting/image-1.png",
      description: "Choose Policy dialog showing rate limiting options",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
        'Click "Add Policy" in the Request section',
      ],
    },
  ],
  import.meta.filename,
);
