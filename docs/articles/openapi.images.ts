/**
 * Verify portal screenshots in docs/articles/openapi.mdx
 * Run: npx tsx docs/articles/openapi.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "openapi",
  [
    {
      imagePath: "open-api/image.png",
      description: "Route Designer tab in Code view showing routes list",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json" in the file tree',
      ],
    },
    {
      imagePath: "open-api/image-1.png",
      description: "OpenAPI tab with Import/Export buttons",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json" in the file tree',
        'Click the "OpenAPI" tab or view next to "Route Designer"',
      ],
    },
  ],
  import.meta.filename,
);
