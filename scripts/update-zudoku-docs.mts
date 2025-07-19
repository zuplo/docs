import { promises as fs } from "fs";
import { join } from "path";

const directoryPath = new URL("../docs/dev-portal/zudoku", import.meta.url)
  .pathname;

// const warningNote = `

// :::warning

// This documentation is for the latest version of the Dev Portal. If you are
// using the legacy developer portal, please refer to the
// [docs](/docs/legacy/dev-portal/overview).

// :::
// `;

const IGNORE_FILES = ["quickstart.md"];

async function updateDocs(dir: string) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        let content = await fs.readFile(filePath, "utf8");

        content = content
          .replace(new RegExp("Zudoku ", "g"), "Dev Portal ")
          // Rewrite internal links to start with /dev-portal/zudoku/
          .replace(/(?<=\]\()\//g, "/dev-portal/zudoku/");

        // // Insert text after frontmatter
        // const frontmatterEndIndex = content.indexOf("---", 3) + 3;
        // if (frontmatterEndIndex > 2) {
        //   // If we have a title, then just add the warning note after the frontmatter
        //   if (
        //     content.indexOf("title: ") >= 0 &&
        //     content.indexOf("title: ") < frontmatterEndIndex
        //   ) {
        //     content =
        //       content.slice(0, frontmatterEndIndex) +
        //       warningNote +
        //       content.slice(frontmatterEndIndex);
        //   } else if (content.indexOf("# ")) {
        //     const titleEndIndex = content.indexOf("\n", content.indexOf("# "));
        //     content =
        //       content.slice(0, titleEndIndex) +
        //       "\n" +
        //       warningNote +
        //       content.slice(titleEndIndex);
        //   }
        // } else {
        //   content = warningNote + content;
        // }

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
