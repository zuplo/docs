import vercelSkewProtection from "vite-plugin-vercel-skew-protection";

export default {
  plugins: [
    process.env.VERCEL_SKEW_PROTECTION_ENABLED === "1" &&
      vercelSkewProtection(),
  ].filter(Boolean),
};
