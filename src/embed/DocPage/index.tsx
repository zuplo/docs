/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import renderRoutes from "@docusaurus/renderRoutes";
import { matchPath } from "@docusaurus/router";
import {
  DocsVersionProvider,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BackToTopButton from "@theme/BackToTopButton";
import NotFound from "@theme/NotFound";
import clsx from "clsx";
import React from "react";
import Layout from "../Layout";
import styles from "./styles.module.css";

function DocPageContent({ currentDocRoute, versionMetadata, children }) {
  const { pluginId, version } = versionMetadata;
  return (
    <Layout>
      <div className={styles.docPage}>
        <BackToTopButton />

        <main
          className={clsx(
            styles.docMainContainer,
            styles.docMainContainerEnhanced
          )}
        >
          <div
            className={clsx(
              "container padding--lg padding-bottom--xl",
              styles.docItemWrapper,
              styles.docItemWrapperEnhanced
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default function DocPage(props) {
  const {
    route: { routes: docRoutes },
    versionMetadata,
    location,
  } = props;
  const currentDocRoute = docRoutes.find((docRoute) =>
    matchPath(location.pathname, docRoute)
  );

  if (!currentDocRoute) {
    return <NotFound />;
  }

  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.docsPages,
        ThemeClassNames.page.docsDocPage,
        versionMetadata.className
      )}
    >
      <DocsVersionProvider version={versionMetadata}>
        <DocPageContent
          currentDocRoute={currentDocRoute}
          versionMetadata={versionMetadata}
        >
          {renderRoutes(docRoutes, {
            versionMetadata,
          })}
        </DocPageContent>
      </DocsVersionProvider>
    </HtmlClassNameProvider>
  );
}
