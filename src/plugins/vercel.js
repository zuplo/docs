module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "docusaurus-plugin-vercel",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              src: `/_vercel/insights/script.js`,
              referrerpolicy: "origin",
            },
          },
        ],
      };
    },
  };
};
