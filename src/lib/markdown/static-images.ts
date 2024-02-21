import path from "path";
import { Parent } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

/**
 * Copies images from the /static folder to /public if they are referenced by a
 * @returns
 */
export default function rehypeStaticImages() {
  return async (root: Parent, vfile: VFile) => {
    const promises: Promise<void>[] = [];
    visit(root, ["element"], (node: any, index, parent) => {
      promises.push(
        (async () => {
          if (node.type === "element" && node.tagName === "img") {
            if (!node.properties.src.startsWith("http")) {
              const publicDir = path.join(process.cwd(), "public");
              let url = path.resolve(
                path.dirname(vfile.path),
                node.properties.src,
              );
              const relativePath = url.replace(publicDir, "");
              if (process.env.USE_IMAGE_CDN) {
                node.properties.src = `https://cdn.zuplo.com/docs${relativePath}`;
                node.properties.srcSet = [
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=320,format=auto/docs${relativePath}   320w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=640,format=auto/docs${relativePath}   640w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=960,format=auto/docs${relativePath}   960w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=1280,format=auto/docs${relativePath} 1280w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=2560,format=auto/docs${relativePath} 2560w`,
                ].join(", ");
              } else {
                node.properties.src = `/docs${relativePath}`;
              }
            }
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
}
