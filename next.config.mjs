import withNavigation from "./src/build/navigation.mjs";
import withPolicies from "./src/build/policies.mjs";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/docs",
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
  transpilePackages: ["lucide-react"],
  swcMinify: true,
  reactStrictMode: true,
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
};

export default withPolicies(withNavigation(nextConfig));
