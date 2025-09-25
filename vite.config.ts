import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import { microfrontends } from "@vercel/microfrontends/experimental/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@/src": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Source map generation must be turned on
  },

  plugins: [
    microfrontends(),
    // Put the Sentry vite plugin after all other plugins
    process.env.VERCEL &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "zuplo",
        project: "docs",
      }),
  ],
});
