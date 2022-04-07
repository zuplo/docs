import * as fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import EmbedPage from "./page";
import * as path from "path";
import { JSDOM } from "jsdom";

const buildDir = path.resolve(__dirname, "../build");
const outputDir = path.resolve(__dirname, "dist");
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

const qsPath = path.resolve(buildDir, "docs/quickstarts");
const qsDirs = fs.readdirSync(qsPath);
qsDirs.forEach((dir) => {
  const htmlPath = path.resolve(qsPath, dir, "index.html");
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html);
    const el = dom.window.document.querySelector("div.markdown");
    if (!el) {
      throw new Error("Cannot find markdown div");
    }
    const slug = `/embed/quickstarts/${dir}`;
    const qsOutputPath = path.join(outputDir, `/quickstarts/${dir}`);
    console.log(qsOutputPath);
    fs.mkdirSync(qsOutputPath, { recursive: true });
    render(el.innerHTML, slug, path.join(qsOutputPath, "index.html"));
  }
});

// render();

function render(content: string, slug: string, outputPath: string) {
  let html = ReactDOMServer.renderToStaticMarkup(
    <Page content={content} slug={slug} />
  );
  let htmlWDoc = "<!DOCTYPE html>" + html;
  fs.writeFileSync(outputPath, htmlWDoc);
  console.log(`Wrote ${outputPath}`);
}

function Page({ content, slug }: { content: string; slug: string }) {
  const { VERCEL_GIT_COMMIT_SHA } = process.env;
  const cssUrl = `/embed/index.${VERCEL_GIT_COMMIT_SHA ?? "local"}.css`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Zuplo Quickstarts</title>
        <link rel="stylesheet" href={cssUrl} />
        <link
          rel="canonical"
          href={`https://zuplo.com/docs/quickstarts/${slug.replace(
            "/embed/",
            "/docs/"
          )}`}
        />
      </head>
      <body>
        <EmbedPage content={content} slug={slug} />
      </body>
    </html>
  );
}
