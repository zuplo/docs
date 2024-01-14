/// <reference lib="es2022" />

export async function migrateContent(content) {
  return replaceAdmonitions(content)
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
function replaceAdmonitions(content) {
  let index;
  let end = 0;
  do {
    index = content.indexOf(":::", end);
    if (index > -1) {
      end = content.indexOf("\n:::", index);
      const lines = content.substring(index, end).split("\n");
      let type = lines[0].replace(":::", "").trim();
      let title;
      let space = type.indexOf(" ");
      if (space > -1) {
        title = type.substring(space).trim();
        type = type.substring(0, space).trim();
      }
      const body = lines.slice(1).join("\n").trim();
      const replacement = `{% callout type="${type}"${
        title ? ` title="${title}"` : ""
      } %}\n\n${body}\n\n{% /callout %}`;
      content =
        content.substring(0, index) + replacement + content.substring(end + 4);
    }
  } while (index > -1 && end > -1);
  return content;
}
