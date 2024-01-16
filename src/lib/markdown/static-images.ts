import type { Image } from "mdast";
import path from "path";
import { Parent } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
/**
 * Removes the md extension from links that reference the file path
 * @returns
 */
export default function remarkStaticImage() {
  return async (root: Parent, vfile: VFile) => {
    const promises: Promise<void>[] = [];
    visit(root, "image", (node: Image, index, parent) => {
      promises.push(
        (async () => {
          if (!node.url.startsWith("http")) {
            const staticPath = path.join(process.cwd(), "public");
            let url = path.resolve(path.dirname(vfile.path), node.url);
            if (url.startsWith(staticPath)) {
              node.url = path.join("/docs", url.replace(staticPath, ""));
            } else {
              // throw new Error(
              //   `Images must be in the 'public' folder. The image '${
              //     node.url
              //   }' in file '${vfile.path.replace(
              //     process.cwd(),
              //     "",
              //   )}' could not be resolved.`,
              // );
            }
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
}
