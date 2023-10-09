import type { Image } from "mdast";
import path from "path";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

/**
 * Removes the md extension from links that reference the file path
 * @returns
 */
export default function remarkStaticImage(): Transformer {
  return async (root, vfile) => {
    const promises: Promise<void>[] = [];
    visit(root, "image", (node: Image, index, parent) => {
      promises.push(
        (async () => {
          if (node.url.startsWith(".")) {
            const staticPath = path.join(process.cwd(), "public");
            const url = path.resolve(path.dirname(vfile.path), node.url);
            if (!url.startsWith(staticPath)) {
              throw new Error(
                `Images must be in the 'public' folder. The image '${
                  node.url
                }' in file '${vfile.path.replace(
                  process.cwd(),
                  "",
                )}' could not be resolved.`,
              );
            }
            node.url = url.replace(staticPath, "");
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
}
