/**
 * Verify portal screenshots in docs/articles/versioning-on-zuplo.mdx
 * Run: npx tsx docs/articles/versioning-on-zuplo.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "versioning-on-zuplo",
  [
    {
      imagePath: "versioning-on-zuplo/multiple-openapi-files.png",
      description: "File tree showing multiple routes-v1/v2.oas.json files",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
      ],
    },
  ],
  import.meta.filename,
);
