import BrowserOnly from "@docusaurus/BrowserOnly";
import React from "react";

// This page never gets hit in production,
// this is just a helper for local dev
export default function Home() {
  <BrowserOnly>
    {() => {
      window.location.href = "/docs";
      return <></>;
    }}
  </BrowserOnly>;
  return <div></div>;
}
