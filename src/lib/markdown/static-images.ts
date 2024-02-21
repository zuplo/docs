import { Root } from "mdast";
import path from "path";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

/**
 * Copies images from the /static folder to /public if they are referenced by a
 * @returns
 */
const rehypeStaticImages: Plugin<[], Root, Root> =
  () => async (root, vfile: VFile) => {
    const promises: Promise<void>[] = [];
    visit(root, ["element"], (node: any, index, parent) => {
      promises.push(
        (async () => {
          if (
            node.type === "element" &&
            node.tagName === "img" &&
            node.properties
          ) {
            if (!node.properties.src.startsWith("http")) {
              const publicDir = path.join(process.cwd(), "public");
              let url = path.resolve(
                path.dirname(vfile.path),
                node.properties.src,
              );
              const relativePath = url.replace(publicDir, "");
              if (process.env.USE_IMAGE_CDN) {
                node.properties.src = `https://cdn.zuplo.com/docs${relativePath}`;
              } else {
                node.properties.src = `/docs${relativePath}`;
              }
            }

            if (node.properties.src.startsWith("https://cdn.zuplo.com/")) {
              const url = new URL(node.properties.src);
              node.properties.srcSet = [
                `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=640,format=auto${url.pathname}   640w`,
                `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=960,format=auto${url.pathname}   960w`,
                `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=1280,format=auto${url.pathname} 1280w`,
                `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=2560,format=auto${url.pathname} 2560w`,
              ].join(", ");
            }
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
export default rehypeStaticImages;
