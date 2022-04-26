/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import {
  PageMetadata,
  ThemeClassNames,
  useKeyboardNavigation,
} from "@docusaurus/theme-common";
import ErrorPageContent from "@theme/ErrorPageContent";
import LayoutProviders from "@theme/LayoutProviders";
import clsx from "clsx";
import React from "react";
import "./styles.css";
export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    // not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
  useKeyboardNavigation();
  return (
    <LayoutProviders>
      <PageMetadata title={title} description={description} />

      <div className={clsx(ThemeClassNames.wrapper.main, wrapperClassName)}>
        <ErrorBoundary fallback={ErrorPageContent}>{children}</ErrorBoundary>
      </div>
    </LayoutProviders>
  );
}
