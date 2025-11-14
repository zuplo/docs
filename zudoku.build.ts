import { removeExtensions } from "zudoku/processors/removeExtensions";
import type { ZudokuBuildConfig } from "zudoku";
const buildConfig: ZudokuBuildConfig = {
  processors: [
    // Remove specific extensions
    removeExtensions({
      keys: ["x-internal", "x-deprecated"],
    }),
    // Remove extensions based on a custom filter
    removeExtensions({
      shouldRemove: (key) => key.startsWith("x-zuplo"),
    }),
  ],
};
export default buildConfig;
