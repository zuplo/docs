import React from "react";

// This page never gets hit in production,
// this is just a helper for local dev
export default function Home() {
  return (
    <div>
      <a href="/docs">Debug page only. Go to Docs</a>
    </div>
  );
}
