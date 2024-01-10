import withMarkdoc from "@markdoc/next.js";
import withNavigation from "./src/build/navigation.mjs";
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/docs",
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
};

export default withNavigation(
  withMarkdoc({ schemaPath: "./src/markdoc" })(nextConfig),
);
