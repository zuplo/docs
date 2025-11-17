// Custom loader to handle non-JS asset imports in Node.js
const assetExtensions = [
  ".css",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
];

export async function load(url, context, nextLoad) {
  // If it's an asset file, return an empty module
  if (assetExtensions.some((ext) => url.endsWith(ext))) {
    return {
      format: "module",
      shortCircuit: true,
      source: "export default {};",
    };
  }

  // Otherwise, use the default loader
  return nextLoad(url, context);
}
