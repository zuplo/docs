import { promises as fs } from "fs";
import { join } from "path";

const directoryPath = new URL("../docs/dev-portal/zudoku", import.meta.url)
  .pathname;

const warningNote = `

:::warning

This documentation is for the preview version of the Dev Portal. If you are
not part of the preview program, please refer to the [current Dev Portal docs](/docs/articles/developer-portal).

:::
`;

async function updateDocs(dir: string) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        let content = await fs.readFile(filePath, "utf8");

        content = content.replace(new RegExp("Zudoku ", "g"), "Dev Portal ");

        // Insert text after frontmatter
        const frontmatterEndIndex = content.indexOf("---", 3) + 3;
        if (frontmatterEndIndex > 2) {
          content =
            content.slice(0, frontmatterEndIndex) +
            warningNote +
            content.slice(frontmatterEndIndex);
        }

        await fs.writeFile(filePath, content, "utf8");
        console.log(`Updated file: ${filePath}`);
      } else {
        await updateDocs(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing files: ${error}`);
  }
}

updateDocs(directoryPath);
