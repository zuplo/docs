/**
 * Verify portal screenshots in docs/articles/step-1-setup-basic-gateway.mdx
 * Run: npx tsx docs/articles/step-1-setup-basic-gateway.images.ts
 */
import { imageTest } from "../../scripts/lib/image-test.ts";

await imageTest(
  "step-1-setup-basic-gateway",
  [
    {
      imagePath: "step-1-setup-basic-gateway/image.png",
      description: "Route Designer empty state — no operations configured yet",
      navigationSteps: [
        "Click on the first project",
        'Click "Code" in the navigation',
        'Click "routes.oas.json" in the file tree',
      ],
    },
    {
      imagePath: "step-1-setup-basic-gateway/set-env-var.png",
      description: "Settings > Environment Variables page",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Environment Variables" in the sidebar',
      ],
    },
    {
      imagePath: "step-1-setup-basic-gateway/env-var.png",
      description:
        "Environment variable creation dialog (Name, Value, Secret toggle)",
      navigationSteps: [
        "Click on the first project",
        'Click "Settings" in the navigation',
        'Click "Environment Variables" in the sidebar',
        'Click "Add new variable" button',
      ],
    },
  ],
  import.meta.filename,
);
