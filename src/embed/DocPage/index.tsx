/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import renderRoutes from "@docusaurus/renderRoutes";
import { matchPath } from "@docusaurus/router";
import {
  DocsSidebarProvider,
  DocsVersionProvider,
  docVersionSearchTag,
  HtmlClassNameProvider,
  ThemeClassNames,
  useDocsSidebar,
} from "@docusaurus/theme-common";
import BackToTopButton from "@theme/BackToTopButton";
import NotFound from "@theme/NotFound";
import SearchMetadata from "@theme/SearchMetadata";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import Layout from "../Layout";
import styles from "./styles.module.css";

function DocPageContent({
  currentDocRoute,
  versionMetadata,
  children,
  sidebarName,
}) {
  const sidebar = useDocsSidebar();
  const { pluginId, version } = versionMetadata;
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }

    setHiddenSidebarContainer((value) => !value);
  }, [hiddenSidebar]);
  return (
    <>
      <SearchMetadata
        version={version}
        tag={docVersionSearchTag(pluginId, version)}
      />
      <Layout>
        <div className={styles.docPage}>
          <BackToTopButton />

          <main
            className={clsx(
              styles.docMainContainer,
              (hiddenSidebarContainer || !sidebar) &&
                styles.docMainContainerEnhanced
            )}
          >
            <div
              className={clsx(
                "container padding-top--md padding-bottom--lg",
                styles.docItemWrapper,
                hiddenSidebarContainer && styles.docItemWrapperEnhanced
              )}
            >
              {children}
            </div>
          </main>
        </div>
      </Layout>
    </>
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
  } // For now, the sidebarName is added as route config: not ideal!

  const sidebarName = currentDocRoute.sidebar;
  const sidebar = sidebarName
    ? versionMetadata.docsSidebars[sidebarName]
    : null;
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.docsPages,
        ThemeClassNames.page.docsDocPage,
        versionMetadata.className
      )}
    >
      <DocsVersionProvider version={versionMetadata}>
        <DocsSidebarProvider sidebar={sidebar ?? null}>
          <DocPageContent
            currentDocRoute={currentDocRoute}
            versionMetadata={versionMetadata}
            sidebarName={sidebarName}
          >
            {renderRoutes(docRoutes, {
              versionMetadata,
            })}
          </DocPageContent>
        </DocsSidebarProvider>
      </DocsVersionProvider>
    </HtmlClassNameProvider>
  );
}
