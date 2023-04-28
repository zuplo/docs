module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "docusaurus-plugin-hubspot",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              src: `https://js.hs-scripts.com/21624128.js`,
              id: "hs-script-loader",
              defer: true,
              async: true,
            },
          },
        ],
      };
    },
  };
};
