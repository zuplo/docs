// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Zuplo",
  tagline: "The programmable API Gateway",
  url: "https://zuplo.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "https://cdn.zuplo.com/www/favicon.png",
  organizationName: "zuplo", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/zuplo/docs/tree/main/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/zuplo/docs/tree/main/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "Zuplo",
          src: "https://cdn.zuplo.com/static/logos/logo.svg",
          href: "https://zuplo.com",
          target: "_self",
        },
        items: [
          {
            to: "/docs",
            position: "left",
            label: "Docs",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://www.zuplo.com/about",
            label: "About Us",
            position: "right",
            target: "_self",
          },
          {
            href: "https://www.zuplo.com/careers",
            label: "Careers",
            position: "right",
            target: "_self",
          },
          {
            href: "https://github.com/zuplo",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/getting-started",
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
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/zuplo",
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
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
