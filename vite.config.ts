import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    ViteImageOptimizer({
      exclude: /\.(gif|svg)$/,
    }),
    // Put the Sentry vite plugin after all other plugins
    process.env.VERCEL &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "zuplo",
        project: "docs",
      }),
  ],
});
