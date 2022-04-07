import { AppProps } from "next/app";
import { Router } from "next/router";
import Script from "next/script";
import { GOOGLE_ANALYTICS_KEY, SEGMENT_WRITE_KEY } from "../lib/analytics";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  Router.events.on("routeChangeComplete", (url) => {
    void window.analytics?.page(url);
    window.dataLayer?.push({
      event: "pageview",
      page: url,
    });
  });
  return (
    <>
      {SEGMENT_WRITE_KEY ? (
        <Script
          id="segment"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !(function(){var analytics=(window.analytics=window.analytics||[]);if (!analytics.initialize)if (analytics.invoked)window.console &&console.error &&console.error("Segment snippet included twice.");else {analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware",];analytics.factory=function (e) {return function () {var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics;};};for (var e=0; e < analytics.methods.length; e++) {var key=analytics.methods[e];analytics[key]=analytics.factory(key);}analytics.load=function (key, e) {var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://sg.zuplo.com/a/v1/" + key + "/index.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t, n);analytics._loadOptions=e;};analytics._writeKey="${SEGMENT_WRITE_KEY}";analytics._cdn="https://sg.zuplo.com";analytics.SNIPPET_VERSION="4.15.3";
            analytics.load("${SEGMENT_WRITE_KEY}", {integrations: {Intercom: { hideDefaultLauncher: true },"Segment.io": { apiHost: "sg.zuplo.com/v1" },},});
            analytics.page();
            }})();
          `,
          }}
        />
      ) : null}
      {GOOGLE_ANALYTICS_KEY ? (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_KEY}`}
          ></Script>
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || []; 
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_KEY}');`,
            }}
          />
        </>
      ) : null}
      <Component {...pageProps} />
    </>
  );
}
