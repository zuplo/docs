import type { Link } from "mdast";
import { Node } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
/**
 * Removes the md extension from links that reference the file path
 * @returns
 */
export default function remarkTransformLink() {
  return async (root: Node, vfile: VFile) => {
    visit(root, "link", (node: Link, index, parent) => {
      if (node.url.endsWith(".md")) {
        node.url = node.url.replace(".md", "");
      }
    });
  };
}
