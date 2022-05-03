const { existsSync } = require("fs");
const fs = require("fs/promises");
const path = require("path");

// Checks that the pre-build actions have been run

function exitWithError(error) {
  console.error(error);
  console.warn("You must run 'npm run local' before you can start the site.");
  process.exit(1);
}

async function run() {
  // Check @zuplo/policies is recent
  const nodeModulesPath = path.resolve(__dirname, "../node_modules");
  const zuploPoliciesPkgPath = path.join(
    nodeModulesPath,
    "@zuplo/policies/package.json"
  );

  if (!existsSync(zuploPoliciesPkgPath)) {
    return exitWithError("The @zuplo/policies module is not installed.");
  }

  const policiesStat = await fs.stat(zuploPoliciesPkgPath);
  console.log(policiesStat);

  // Check reference docs are synced
  const referenceIndexDocPath = path.resolve(
    __dirname,
    "../reference/index.md"
  );
  if (!existsSync(referenceIndexDocPath)) {
    return exitWithError("Reference documents have not been synced");
  }

  // Check bundle.json exist
  const bundleJsonPath = path.resolve(
    __dirname,
    "../src/components/bundles.json"
  );
  if (!existsSync(bundleJsonPath)) {
    return exitWithError("Bundles have not been synced.");
  }
}

run().catch(console.error);
