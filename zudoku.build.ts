import { removeExtensions } from "zudoku/processors/removeExtensions";
import type { ZudokuBuildConfig } from "zudoku";
import type { PluggableList } from "unified";
import { remarkIf } from "./src/remark-if.js";

const buildConfig: ZudokuBuildConfig = {
  remarkPlugins: (defaultPlugins: PluggableList) => [
    ...defaultPlugins,
    [remarkIf, { mode: "zuplo" }],
  ],
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
