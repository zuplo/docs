module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "docusaurus-plugin-zaraz",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              src: `https://za.zuplo.com/i.js`,
              referrerpolicy: "origin",
            },
          },
        ],
      };
    },
  };
};
