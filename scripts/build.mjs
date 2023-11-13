import esbuild from "esbuild";
import path from "path";

esbuild.buildSync({
  entryPoints: [path.resolve(process.cwd(), "./scripts/update-policies.tsx")],
  bundle: true,
  platform: "node",
  packages: "external",
  format: "esm",
  outfile: path.resolve(process.cwd(), "./scripts/update-policies.mjs"),
});
