// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Zuplo Docs",
  tagline: "The programmable API Gateway",
  url: "https://zuplo.com",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "https://cdn.zuplo.com/www/favicon.png",
  organizationName: "zuplo", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  markdown: {
    mermaid: true,
  },
  plugins: [
    "./src/plugins/koala",
    "./src/plugins/zaraz",
    "@docusaurus/theme-mermaid",
    [
      "posthog-docusaurus",
      {
        apiKey: "phc_xB1aydh7a41MW9TwUtLJjKme4izQiWf9zKbKhpysAiW",
        appUrl: "https://app.posthog.com", // optional
        enableInDevelopment: false, // optional
      },
    ],
  ],
  themes: ["@inkeep/docusaurus/searchBar"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({
            version,
            versionDocsDirPath,
            docPath,
            permalink,
            locale,
          }) => {
            if (docPath.startsWith("policies/")) {
              const policyId = docPath
                .replace("policies/", "")
                .replace(".md", "");
              return `https://github.com/zuplo/docs/issues/new?assignees=&labels=&projects=&template=policies-doc.md&title=[Policy] ${policyId}`;
            }
            return `https://github.com/zuplo/docs/tree/main/docs/${docPath}`;
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/docs/conferences/**"],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "https://cdn.zuplo.com/static/social/img-twitter-header.jpg",
      algolia: {
        // The application ID provided by Algolia
        appId: "E7EUGPZYED",

        // Public API key: it is safe to commit it
        apiKey: "b2b9d3c7d9be346b7754344b8c3bccdd",

        indexName: "ZUPLO_SITE",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        externalUrlRegex: "zuplo\\.com/blog|zuplo\\.com/pricing",

        // Optional: Algolia search parameters
        searchParameters: {},

        //... other Algolia params
      },
      navbar: {
        logo: {
          alt: "Zuplo",
          src: "https://cdn.zuplo.com/static/logos/logo.svg",
          href: "https://zuplo.com",
          target: "_self",
        },
        items: [
          { href: "https://zuplo.com", label: "Home", position: "left" },
          {
            to: "/docs/intro",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://dev.zuplo.com/docs",
            label: "API",
            position: "left",
          },
          { href: "https://zuplo.com/blog", label: "Blog", position: "left" },
          {
            href: "https://portal.zuplo.com",
            label: "Sign In",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Company",
            items: [
              {
                label: "About Us",
                href: "https://zuplo.com/about",
              },
              {
                label: "Pricing",
                href: "https://zuplo.com/pricing",
              },
              {
                label: "Careers",
                href: "https://zuplo.com/careers",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.zuplo.com",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/zuplo",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/75040051/admin/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                href: "https://zuplo.com/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/zuplo",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Zuplo, Inc.`,
      },
      prism: {
        additionalLanguages: [
          "bash",
          "json",
          "typescript",
          "javascript",
          "yaml",
          "css",
        ],
        theme: themes.github,
        darkTheme: themes.dracula,
      },
      inkeepConfig: {
        chatButtonType: "ICON_TEXT",
        baseSettings: {
          apiKey: "499c156cf7a9798343949c8bb5665ac95e48132c6d68c42e",
          integrationId: "clot3asdz0000s601nc8jwnzx",
          organizationId: "org_dDOlt2uJlMWM8oIS",
          primaryBrandColor: "#ff00bd", // required -- your brand color, the widget color scheme is derived from this
          organizationDisplayName: "Zuplo",
          theme: {
            syntaxHighlighter: {
              lightTheme: themes.github,
              darkTheme: themes.dracula,
            },
          },
        },
        // modalSettings: {
        //   // optional settings
        // },
        // searchSettings: {
        //   // optional settings
        // },
        // aiChatSettings: {
        //   // optional settings
        //   botAvatarSrcUrl: "/img/logo.svg", // optional -- use your own bot avatar
        //   quickQuestions: [
        //     "Example question 1?",
        //     "Example question 2?",
        //     "Example question 3?",
        //   ],
        // },
      },
    }),
};

module.exports = config;
