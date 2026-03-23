/**
 * Verify portal screenshots in docs/policies/api-key-inbound.mdx
 *
 * NOTE: This doc currently uses CDN images (cdn.zuplo.com). New screenshots
 * should be saved locally to public/media/api-key-inbound/.
 *
 * Run: npx tsx docs/policies/api-key-inbound.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "api-key-inbound",
  [
    {
      imagePath: "api-key-inbound/add-policy.png",
      description: "Route Designer with Add Policy button highlighted",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
      ],
    },
    {
      imagePath: "api-key-inbound/configure-policy.png",
      description: "API Key Authentication policy configuration dialog",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
        'Click "Add Policy" in the Request section',
        'Search for and click "API Key Authentication"',
      ],
    },
    {
      imagePath: "api-key-inbound/test-route.png",
      description: "Test console showing request and response",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
        'Click "Test" button',
      ],
    },
    {
      imagePath: "api-key-inbound/api-key-consumers.png",
      description: "API Key consumers table in Services",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
        'Click "Configure" on the API Key Service',
      ],
    },
    {
      imagePath: "api-key-inbound/route-designer.png",
      description: "Route Designer showing route with API key policy applied",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json"',
        "Click on the first route",
      ],
    },
    {
      imagePath: "api-key-inbound/services.png",
      description: "Services page showing API Key Service card",
      navigationSteps: [
        "Click on the first project",
        'Click "Services" in the navigation',
      ],
    },
  ],
  import.meta.filename,
);
