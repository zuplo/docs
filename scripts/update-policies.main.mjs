import arg from "arg";
import { run, watch } from "./update-policies.mjs";

const args = arg({
  // Types
  "--watch": Boolean,
});

if (args["--watch"]) {
  watch().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
