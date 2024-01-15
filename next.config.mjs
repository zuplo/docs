import withMarkdoc from "@markdoc/next.js";
import withNavigation from "./src/build/navigation.mjs";
import withPolicies from "./src/build/policies.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/docs",
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
};

export default withPolicies(
  withNavigation(
    withMarkdoc({
      schemaPath: "./src/markdoc",
      nextjsExports: ["title", "metadata", "revalidate"],
    })(nextConfig),
  ),
);
