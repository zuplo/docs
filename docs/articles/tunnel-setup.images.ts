/**
 * Verify portal screenshots in docs/articles/tunnel-setup.mdx
 * Run: npx tsx docs/articles/tunnel-setup.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "tunnel-setup",
  [
    {
      imagePath: "tunnel-setup/0c91be91-a591-4cef-ac29-d266e8a3181e.png",
      description:
        "Route handling view showing Path, Method, Policies, Handler sections",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json" in the file tree',
        "Click on the first route",
      ],
    },
    {
      imagePath: "tunnel-setup/16b93099-511d-435b-af85-167fab5814b2.png",
      description:
        "URL Rewrite handler config with TUNNEL_BASE_URL environment variable",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json" in the file tree',
        "Click on the first route",
      ],
    },
  ],
  import.meta.filename,
);
