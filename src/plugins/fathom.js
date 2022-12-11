module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "docusaurus-plugin-fathom",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              src: `https://fa.zuplo.com/script.js`,
              "data-spa": "auto",
              "data-site": "CCCPOYBW",
              defer: true,
            },
          },
        ],
      };
    },
  };
};
