import withMarkdoc from "@markdoc/next.js";

import withSearch from "./src/markdoc/search.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withSearch(
  withMarkdoc({ schemaPath: "./src/markdoc" })(nextConfig),
);
