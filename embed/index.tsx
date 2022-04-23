import * as fs from "fs/promises";
import { JSDOM } from "jsdom";
import * as path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import QuickstartPicker from "./quickstart-picker";

async function run() {
  const embedPath = path.resolve(__dirname, "../build/embed/");
  const embedQuickstartPath = path.join(embedPath, "quickstarts");
  const quickstartsPath = path.resolve(__dirname, "../build/docs/quickstarts/");
  const quickstartDirs = await fs.readdir(quickstartsPath);

  await fs.mkdir(embedPath, { recursive: true });

  await fs.copyFile(
    path.join(__dirname, "styles.css"),
    path.join(embedPath, "styles.css")
  );
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

        const title = article.querySelector("h1").textContent;
        article.querySelector("header").remove();

        const links = article.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
          links[i].setAttribute("target", "_blank");
        }

        const outputDir = path.join(embedQuickstartPath, dir);
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, "index.html");
        await render(outputPath, {
          title,
          content: article.innerHTML,
          slug: `/quickstart/${dir}`,
          defaultCssUrl: css.getAttribute("href"),
          embedCssUrl: "/embed/styles.css",
        });
      }
    })
  );
}

interface PageProps {
  title: string;
  content: string;
  slug: string;
  defaultCssUrl: string;
  embedCssUrl: string;
}

async function render(outputPath: string, props: PageProps) {
  let html = ReactDOMServer.renderToStaticMarkup(<Page {...props} />);
  let htmlWDoc = "<!DOCTYPE html>" + html;
  await fs.writeFile(outputPath, htmlWDoc);
  console.log(`Wrote ${outputPath}`);
}

function Page({ title, content, slug, defaultCssUrl, embedCssUrl }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Zuplo Quickstarts | {title}</title>
        <link rel="stylesheet" href={defaultCssUrl} />
        <link rel="stylesheet" href={embedCssUrl} />
        <link rel="canonical" href={`https://zuplo.com/docs${slug}`} />
        <link rel="icon" href="https://cdn.zuplo.com/www/favicon.png"></link>
      </head>
      <body>
        <div className="container">
          <article>
            <h1>{title}</h1>
            <p>
              Zuplo isn't your average gateway. It's a{" "}
              <strong>programmable gateway</strong> that is the easiest way to
              share and secure your APIs. Choose your getting started guide:
            </p>
            <QuickstartPicker slug={slug} />
            <div
              className="theme-doc-markdown markdown"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </article>
        </div>
      </body>
    </html>
  );
}

run().catch(console.error);
