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
    // "./src/plugins/vercel",
    "./src/plugins/koala",
    "./src/plugins/hubspot",
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "changelog",
        blogTitle: "Zuplo Changelog",
        blogSidebarCount: "ALL",
        blogSidebarTitle: "Changelog",
        routeBasePath: "changelog",
        path: "./changelog",
        showReadingTime: false,
        postsPerPage: 20,
        archiveBasePath: null,
      },
    ],
    "@docusaurus/theme-mermaid",
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
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/zuplo/docs/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/docs/conferences/**"],
        },
        gtag: {
          trackingID: "G-FJ4E4W746T",
          anonymizeIP: true,
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
        //externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "/docs/search",

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
          {
            to: "/docs/intro",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
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
                to: "/blog",
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
