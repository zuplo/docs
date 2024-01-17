import type { Image } from "mdast";
import path from "path";
import { Parent } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
/**
 * Copies images from the /static folder to /public if they are referenced by a
 * @returns
 */
export default function remarkStaticImage() {
  return async (root: Parent, vfile: VFile) => {
    visit(root, "image", (node: Image, index, parent) => {
      if (!node.url.startsWith("http")) {
        const publicDir = path.join(process.cwd(), "public");
        let url = path.resolve(path.dirname(vfile.path), node.url);
        const relativePath = url.replace(publicDir, "");
        if (process.env.USE_IMAGE_CDN) {
          node.url = `https://cdn.zuplo.com/docs${relativePath}`;
        } else {
          node.url = `/docs${relativePath}`;
        }
      }
    });
  };
}
