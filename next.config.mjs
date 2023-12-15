import withNavigation from "./src/build/navigation.mjs";
import withSearch from "./src/build/search.mjs";

const protectedRoutes = ["/", "/docs"];

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
  async redirects() {
    return [
      ...protectedRoutes.map((source) => ({
        source,
        destination: "/docs/intro",
        permanent: true,
        basePath: false,
      })),
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withNavigation(withSearch(nextConfig));
