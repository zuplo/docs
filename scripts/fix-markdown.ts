export const fixMarkdown = (content: string) =>
  content
    .replaceAll(/\.mdx?(#.*?)?\)/gm, "$1)")
    // replace outdated directives with correct syntax
    .replaceAll(/:::\s([^\n]+)/gm, ":::$1")
    // /^(.*?)\s*{#([\w-]+)}$
    // replace custom slug ids:
    .replaceAll(/^(#+.*?)\s*{#([\w-]+)}/gm, "$1")
    .replaceAll(
      /:::(tip|info|note|caution|warning|danger)\s([^\n]+)/gm,
      ':::$1{title="$2"}',
    )
    .replaceAll(/:::\w+{title="[^"]*"}/g, (m) => m.replaceAll(/\n/g, ""));
