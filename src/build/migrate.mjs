export async function migrateContent(content) {
  return content
    .replace(
      /\s*:::([a-z]+)(?:\s+(.*?)\n){1}(\n.*?\n)\s*:::/gs,
      `\n\n{% callout type="$1" title="$2" %}\n\n$3\n\n{% /callout %}`,
    )
    .replace(
      /\s*:::([a-z]+)(\n.*?\n)\s*:::/gs,
      `\n\n{% callout type="$1" %}\n\n$2\n\n{% /callout %}`,
    )
    .replace(
      /<Screenshot src="(.*?)"(?:\s+alt="(.*?)")?(?:\s+size="(.*?)")?\s*\/>/gm,
      "![$2]($1)",
    );
}
