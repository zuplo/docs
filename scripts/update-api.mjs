import { writeFileSync } from "fs";

const [response, responseBeta] = await Promise.all([
  fetch("https://dev.zuplo.com/openapi", {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  }),
  fetch("https://dev.zuplo.com/openapi-preview", {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  }),
]);

const dataPreview = await responseBeta.json();
const data = await response.json();

const PREVIEW_WARNING = `<p style="padding: 10px; border-radius: 5px; background-color: #fff3cd; color: #856404; border: 1px solid #ffc107;"><strong>⚠️ Preview:</strong> The Metering APIs are in preview and subject to change.</p>`;

// Add preview warning to operations with Metering tags
function addPreviewWarningToPaths(paths) {
  const result = {};
  for (const [path, pathItem] of Object.entries(paths)) {
    result[path] = {};
    for (const [method, operation] of Object.entries(pathItem)) {
      if (operation.tags?.some((tag) => tag.startsWith("Metering - "))) {
        result[path][method] = {
          ...operation,
          description:
            `${PREVIEW_WARNING}\n\n${operation.description || ""}`.trim(),
        };
      } else {
        result[path][method] = operation;
      }
    }
  }
  return result;
}

// Merge the two OpenAPI specs
const merged = {
  ...data,
  servers: [
    {
      url: "https://dev.zuplo.com",
      description: "Zuplo API",
    },
  ],
  info: {
    ...data.info,
    version: "1.0.0",
    description:
      "This API allows you to manage your Zuplo account, including creating and managing projects, environments, and more.",
  },
  paths: addPreviewWarningToPaths(
    Object.fromEntries(
      Object.entries({
        ...data.paths,
        ...dataPreview.paths,
      }).filter(([path]) => path !== "/openapi-preview"),
    ),
  ),
  components: {
    ...data.components,
    schemas: {
      ...data.components?.schemas,
      ...dataPreview.components?.schemas,
    },
    securitySchemes: {
      ...data.components?.securitySchemes,
      ...dataPreview.components?.securitySchemes,
    },
    parameters: {
      ...data.components?.parameters,
      ...dataPreview.components?.parameters,
    },
    responses: {
      ...data.components?.responses,
      ...dataPreview.components?.responses,
    },
  },
  tags: [...(data.tags || []), ...(dataPreview.tags || [])]
    .filter(
      (tag, index, self) =>
        self.findIndex((t) => t.name === tag.name) === index,
    )
    .sort((a, b) => a.name.localeCompare(b.name)),
};

writeFileSync("./api.json", JSON.stringify(merged, null, 2), "utf-8");
