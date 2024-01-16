import { cp, stat } from "fs/promises";
import type { Image } from "mdast";
import path from "path";
import { Parent } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
/**
 * Copies images from the /static folder to /public if they are referenced by a document
 * @returns
 */
export default function remarkStaticImage() {
  return async (root: Parent, vfile: VFile) => {
    const promises: Promise<void>[] = [];
    visit(root, "image", (node: Image, index, parent) => {
      promises.push(
        (async () => {
          if (!node.url.startsWith("http")) {
            const imageUrl = node.url.replace("/docs/", "/");
            const publicBasePath = path.join(process.cwd(), "public");
            const staticBasePath = path.join(process.cwd(), "static");
            const publicImagePath = path.join(publicBasePath, imageUrl);
            const staticImagePath = path.join(staticBasePath, imageUrl);
            try {
              await stat(publicImagePath);
            } catch (err) {
              try {
                await stat(staticImagePath);
              } catch (err) {
                throw new Error(
                  `The image '${imageUrl}' referenced in '${vfile.path}' could not be found on the file system.`,
                );
              }
              await cp(staticImagePath, publicImagePath);
            }
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
}
