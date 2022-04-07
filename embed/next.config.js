// eslint-disable-next-line no-undef
module.exports = {
  async redirects() {
    return [
      {
        source: "/embed/quickstarts",
        destination: "/embed/quickstarts/proxy-public-api",
        permanent: false,
      },
    ];
  },
};
