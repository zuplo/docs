/// <reference lib="es2022" />

export async function migrateContent(content, fsPath) {
  return replaceAdmonitions(content, fsPath)
    .replaceAll("import GithubSetup from './\\_github-setup.md';", ``)
    .replaceAll("<GithubSetup />", `{% partial file="_github-setup.md" /%}`)
    .replaceAll(
      /<Screenshot\s+src="(.*?)"(?:\s+alt="(.*?)")?(?:\s+size="(.*?)")?\s*\/>/gm,
      "![$2]($1)",
    )
    .replaceAll("<!-- -->", "")
    .replaceAll("../../static/", "/docs/")
    .replaceAll("./media/", "/docs/media/");
}

/**
 *
 * @param {string} content
 */
function replaceAdmonitions(content, fsPath) {
  const lines = content.split("\n");

  const outputLines = [];
  let i = 0;
  do {
    if (lines[i].trim().startsWith(":::")) {
      let leadingSpaces = "";
      for (const char of lines[i]) {
        if (char === " ") {
          leadingSpaces += " ";
        }
      }

      let type = lines[i].replace(":::", "").trim();
      let title;
      let space = type.indexOf(" ");
      if (space > -1) {
        title = type.substring(space).trim();
        type = type.substring(0, space).trim();
      }
      const body = [];
      let nextLine = lines[++i];
      do {
        if (!nextLine.trim().startsWith(":::")) {
          body.push(nextLine);
        }
        nextLine = lines[++i];
      } while (!nextLine.trim().startsWith(":::"));
      const callout = `${leadingSpaces}{% callout type="${type}"${
        title ? ` title="${title}"` : ""
      } %}\n\n${leadingSpaces}${body
        .join("\n")
        .trim()}\n\n${leadingSpaces}{% /callout %}`;
      outputLines.push(callout);
    } else {
      outputLines.push(lines[i]);
    }
    i++;
  } while (i < lines.length - 1);

  return outputLines.join("\n");
}
