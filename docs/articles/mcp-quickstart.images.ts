/**
 * Verify portal screenshots in docs/articles/mcp-quickstart.mdx
 * Run: npx tsx docs/articles/mcp-quickstart.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "mcp-quickstart",
  [
    {
      imagePath: "mcp-quickstart/import-openapi.png",
      description: "Route Designer with Import OpenAPI button annotated",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
      ],
    },
  ],
  import.meta.filename,
);
