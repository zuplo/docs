/**
 * Verify portal screenshots in docs/articles/step-3-add-api-key-auth.mdx
 * Run: npx tsx docs/articles/step-3-add-api-key-auth.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "step-3-add-api-key-auth",
  [
    {
      imagePath: "step-3-add-api-key-auth/image.png",
      description: "Route Designer with policies attached (rate-limit-inbound)",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
      ],
    },
    {
      imagePath: "step-3-add-api-key-auth/image-2.png",
      description: "Services page showing Metering and API Key services",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
      ],
    },
    {
      imagePath: "step-3-add-api-key-auth/image-3.png",
      description: "Create new consumer dialog",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
        'Click "Configure" on the API Key Service',
        'Click "Create Consumer"',
      ],
    },
  ],
  import.meta.filename,
);
