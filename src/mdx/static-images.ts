import { Root } from "mdast";
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
            node.properties &&
            node.properties.src
          ) {
            const originalSrc = node.properties.src;

            // Skip external URLs
            if (originalSrc.startsWith("http")) {
              return;
            }

            // Normalize the path
            let relativePath = originalSrc;
            if (originalSrc.startsWith("/")) {
              relativePath = `/docs${originalSrc}`;
            } else {
              // Extract the /media/... portion of the path
              const mediaMatch = originalSrc.match(/\/media\/.*$/);
              if (mediaMatch) {
                relativePath = mediaMatch[0];
              } else {
                const fullPath = new URL(originalSrc, `file://${vfile.path}`)
                  .pathname;
                const mediaPathMatch = fullPath.match(/\/media\/.*$/);
                relativePath = mediaPathMatch ? mediaPathMatch[0] : fullPath;
              }
            }

            // Set the source based on CDN usage
            if (process.env.USE_IMAGE_CDN === "true") {
              const cdnUrl = new URL(relativePath, "https://cdn.zuplo.com")
                .toString()
                .replace("/public/media/", "/media/");

              node.properties.src = cdnUrl;

              // Add srcSet for non-vector images
              if (!cdnUrl.endsWith(".svg") && !cdnUrl.endsWith(".gif")) {
                const cdnPathname = new URL(cdnUrl).pathname;
                node.properties.srcSet = [
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=640,format=auto${cdnPathname}   640w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=960,format=auto${cdnPathname}   960w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=1280,format=auto${cdnPathname} 1280w`,
                  `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=2560,format=auto${cdnPathname} 2560w`,
                ].join(", ");
              }
            } else {
              node.properties.src = relativePath;
            }
          }
        })(),
      );
    });
    await Promise.all(promises);
  };

export default rehypeStaticImages;
