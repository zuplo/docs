import type { Link } from "mdast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

/**
 * Removes the md extension from links that reference the file path
 * @returns
 */
export default function remarkTransformLink(): Transformer {
  return async (root, vfile) => {
    const promises: Promise<void>[] = [];
    visit(root, "link", (node: Link, index, parent) => {
      promises.push(
        (async () => {
          if (node.url.endsWith(".md")) {
            node.url = node.url.replace(".md", "");
          }
        })(),
      );
    });
    await Promise.all(promises);
  };
}
