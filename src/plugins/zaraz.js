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
              src: `/_a/i.js`,
              referrerpolicy: "origin",
            },
          },
        ],
      };
    },
  };
};
