import * as fs from "fs/promises";
import { JSDOM } from "jsdom";
import * as path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";

async function run() {
  const embedPath = path.resolve(__dirname, "../build/embed/");
  const embedQuickstartPath = path.join(embedPath, "quickstarts");
  const quickstartsPath = path.resolve(__dirname, "../build/docs/quickstarts/");
  const quickstartDirs = await fs.readdir(quickstartsPath);

  await fs.mkdir(embedPath, { recursive: true });
  await Promise.all(
    quickstartDirs.map(async (dir) => {
      const dirPath = path.join(quickstartsPath, dir);
      if ((await fs.stat(dirPath)).isDirectory()) {
        const htmlPath = path.join(dirPath, "index.html");
        const dom = await JSDOM.fromFile(htmlPath);
        const {
          window: { document },
        } = dom;
        const article = document.querySelector("article div.markdown");
        const css = document.querySelector('link[rel="stylesheet"]');

        const links = article.getElementsByTagName("a");

        for (let i = 0; i < links.length; i++) {
          const href = links[i]
            .getAttribute("href")
            .replace("/docs/quickstarts/", "/embed/quickstarts/");

          if (href.startsWith("/embed/quickstarts/")) {
            links[i].setAttribute("href", href);
          } else {
            links[i].setAttribute("target", "_blank");
          }
        }

        const outputDir = path.join(embedQuickstartPath, dir);
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, "index.html");
        await render(outputPath, {
          content: article.innerHTML,
          slug: `/quickstart/${dir}`,
          cssUrl: css.getAttribute("href"),
        });
      }
    })
  );
}

interface PageProps {
  content: string;
  slug: string;
  cssUrl: string;
}

async function render(outputPath: string, props: PageProps) {
  let html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
  let htmlWDoc = "<!DOCTYPE html>" + html;
  await fs.writeFile(outputPath, htmlWDoc);
  console.log(`Wrote ${outputPath}`);
}

function Page({ content, slug, cssUrl }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Zuplo Quickstarts</title>
        <link rel="stylesheet" href={cssUrl} />
        <link rel="canonical" href={`https://zuplo.com/docs${slug}`} />
        <link rel="icon" href="https://cdn.zuplo.com/www/favicon.png"></link>
        <style>
          {`
          html {
            font-size: 150%;
          }
          
          h1 {
            padding-top: 20px;
            padding-bottom: 10px;
            margin-bottom: 0;
          }
          article {
            padding-bottom: 20px;
          }        
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <article
            className="theme-doc-markdown markdown"
            dangerouslySetInnerHTML={{ __html: content }}
          ></article>
        </div>
      </body>
    </html>
  );
}

run().catch(console.error);
