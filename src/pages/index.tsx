import { Redirect } from "@docusaurus/router";
import React from "react";

// This page never gets hit in production,
// this is just a helper for local dev
export default function Home() {
  return <Redirect to="/docs" />;
}
