/** @type {import('next').NextConfig} */
module.exports = {
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
  redirects: async () => [
    {
      source: "/",
      destination: "/docs",
      statusCode: 308,
    },
  ],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
