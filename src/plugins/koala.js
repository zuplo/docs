module.exports = function () {
  const isProd = process.env.NODE_ENV === "production";

  return {
    name: "koala-plugin-fathom",

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }

      return {
        headTags: [
          {
            tagName: "script",
            innerHTML: `!function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://cdn.getkoala.com/v1/pk_32d64a435a311ccc9462e3721dba58cb3e35/sdk.js"),(document.body || document.head).appendChild(n)}();`,
          },
        ],
      };
    },
  };
};
