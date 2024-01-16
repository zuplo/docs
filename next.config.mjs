import withNavigation from "./src/build/navigation.mjs";
import withPolicies from "./src/build/policies.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/docs",
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
};

export default withPolicies(withNavigation(nextConfig));
