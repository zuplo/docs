/**
 * Verify portal screenshots in docs/articles/api-key-administration.mdx
 * Run: npx tsx docs/articles/api-key-administration.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "api-key-administration",
  [
    {
      imagePath: "api-key-administration/image.png",
      description: "Services page showing Metering Service and API Key Service",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
      ],
    },
    {
      imagePath: "api-key-administration/image-1.png",
      description:
        "Services page with environment dropdown open (All, Production, Preview, Working Copy)",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
        "Click on the environment dropdown",
      ],
    },
    {
      imagePath: "api-key-administration/image-2.png",
      description: "API Key Service card with Configure button",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
      ],
    },
    {
      imagePath: "api-key-administration/image-3.png",
      description: "API Key Service consumers page with Create Consumer button",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
        'Click "Configure" on the API Key Service card',
      ],
    },
  ],
  import.meta.filename,
);
