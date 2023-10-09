import withSearch from "./src/markdoc/search.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  basePath: "/docs",
  images: {
    deviceSizes: [576, 640, 760, 828, 992, 1180, 1440],
    imageSizes: [96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.zuplo.com",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withSearch(nextConfig);
