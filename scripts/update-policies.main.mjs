import { run } from "./update-policies.mjs";
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
