/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
  useColorMode,
} from "@docusaurus/theme-common";
import useIsBrowser from "@docusaurus/useIsBrowser";
import DocItemFooter from "@theme/DocItemFooter";
import DocPaginator from "@theme/DocPaginator";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocVersionBanner from "@theme/DocVersionBanner";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import clsx from "clsx";
import React, { useEffect } from "react";
import styles from "./styles.module.css";

function DocItemMetadata(props) {
  const { content: DocContent } = props;
  const { metadata, frontMatter, assets } = DocContent;
  const { keywords } = frontMatter;
  const { description, title } = metadata;
  const image = assets.image ?? frontMatter.image;
  return (
    <PageMetadata
      {...{
        title,
        description,
        keywords,
        image,
      }}
    />
  );
}

function DocItemContent(props) {
  const { content: DocContent } = props;
  const { metadata, frontMatter } = DocContent;
  const {
    hide_title: hideTitle,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const { title } = metadata; // We only add a title if:
  // - user asks to hide it with front matter
  // - the markdown content does not already contain a top-level h1 heading

  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();

  // This is a hack to prevent the dark theme on the embeded pages
  // the reason we dont just use setColorMode("light") is because that
  // overrides the color mode the user has set on docs
  useEffect(() => {
    if (isBrowser && colorMode === "dark") {
      console.log("test");
      document.documentElement.removeAttribute("data-theme");
      setTimeout(() => {
        document.documentElement.removeAttribute("data-theme");
      }, 200);
    }
  }, [isBrowser, colorMode]);

  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === "undefined";
  return (
    <div>
      <DocVersionBanner />
      <div className={styles.docItemContainer}>
        <article>
          {/* <DocBreadcrumbs /> */}
          <DocVersionBadge />

          <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
            {/*
               Title can be declared inside md content or declared through
               front matter and added manually. To make both cases consistent,
               the added title is added under the same div.markdown block
               See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
               */}
            {shouldAddTitle && (
              <header>
                <Heading as="h1">{title}</Heading>
              </header>
            )}
            <MDXContent>
              <DocContent />
            </MDXContent>
          </div>

          <DocItemFooter {...props} />
        </article>

        <DocPaginator previous={metadata.previous} next={metadata.next} />
      </div>
    </div>
  );
}

export default function DocItem(props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.unversionedId}`;
  return (
    <HtmlClassNameProvider className={docHtmlClassName}>
      <DocItemMetadata {...props} />
      <DocItemContent {...props} />
    </HtmlClassNameProvider>
  );
}
