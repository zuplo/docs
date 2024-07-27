import Script from "next/script";
import { GOOGLE_TAG_MANAGER_ID, KOALA_URL } from "../lib/env";

export function Analytics() {
  return (
    <>
      {GOOGLE_TAG_MANAGER_ID && (
        <>
          <Script
            id="gtm"
            async
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://ta.zuplo.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`,
            }}
          />
        </>
      )}
      {GOOGLE_TAG_MANAGER_ID && (
        <Script id="gtm2">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GOOGLE_TAG_MANAGER_ID}', {'allow_enhanced_conversions':true});`}
        </Script>
      )}
      {KOALA_URL && (
        <Script
          id="koala-analytics"
          strategy="afterInteractive"
          async
          dangerouslySetInnerHTML={{
            __html: `
          window.koalaSettings = { host: '${KOALA_URL}' };
          !function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","${KOALA_URL}/v1/pk_32d64a435a311ccc9462e3721dba58cb3e35/sdk.js"),(document.body || document.head).appendChild(n)}();`,
          }}
        />
      )}
    </>
  );
}
