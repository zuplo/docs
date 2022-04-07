import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="icon"
            type="image/x-icon"
            href="https://cdn.zuplo.com/www/favicon.png"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="crossorigin"
          />
          <link
            rel="preconnect"
            href="https://cdn.zuplo.com"
            crossOrigin="crossorigin"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;200;300;400;500;700&display=swap"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.zuplo.com/static/fonts/esbuild/woff2/ES-Build-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.zuplo.com/static/fonts/esbuild/woff2/ES-Build-Medium.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.zuplo.com/static/fonts/esbuild/woff2/ES-Build-SemiBold.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.zuplo.com/static/fonts/esbuild/woff2/ES-Build-Bold.woff2"
            as="font"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
