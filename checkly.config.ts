import { defineConfig } from "checkly";
import { Frequency } from "checkly/constructs";

const config = defineConfig({
  projectName: "@zuplo/docs",
  logicalId: "zuplo/docs",
  repoUrl: "https://github.com/zuplo/docs",
  checks: {
    frequency: Frequency.EVERY_24H,
    locations: ["eu-central-1"],
    runtimeId: "2023.02",
    checkMatch: "**/__checks__/**/*.check.ts",
    browserChecks: {
      testMatch: "**/__checks__/**/*.spec.ts",
    },
  },
});

export default config;
