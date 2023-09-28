// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
    "./src/plugins/fathom",
    "./src/plugins/koala",
    "./src/plugins/hubspot",
    [
      "@docusaurus/theme-mermaid",
      {
        redirects: [
          {
            to: "/articles/local-development-preview",
            from: "/articles/local-development",
          },
        ],
      },
    ],
  ],
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
              return `https://github.com/zuplo/docs/tree/main/policies/${policyId}`;
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
        googleTagManager: {
          containerId: "GTM-W4TRDM8",
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
                href: "https://discord.gg/W36Ddfcd",
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
