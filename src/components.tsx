import React, { lazy, Suspense } from "react";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { BundlesTable } from "./BundlesTable.js";
import { DocusaurusDocsLicense } from "./DocusaurusDocsLicense.js";
import { EnterpriseFeature } from "./EnterpriseFeature.js";
import { GithubButton } from "./GithubButton.js";
import { PolicyOverview } from "./PolicyOverview.js";
import ZupIt from "./ZupIt.js";

type _react = typeof React;

const iconStyle = { display: "inline", verticalAlign: "-0.125em" };

const EmbeddedChat = lazy(() => import("./EmbeddedChat.js"));

export const mdxComponents = {
  Screenshot: (props: any) => <img {...props} />,
  DocusaurusDocsLicense,
  GithubButton,
  ZupIt: (props: any) => <ZupIt {...props} />,
  CodeEditorTabIcon: () => <FileTextIcon style={iconStyle} size={18} />,
  SettingsTabIcon: () => <CogIcon style={iconStyle} size={18} />,
  CopyIcon: () => <CopyIcon style={iconStyle} size={18} />,
  EnvironmentVariablePicker: () => (
    <ListEndIcon
      style={{ display: "inline", verticalAlign: "-0.125em" }}
      size={18}
    />
  ),
  PolicyOverview,
  EnterpriseFeature,
  EmbeddedChat: () => {
    return (
      <Suspense fallback={<div>Loading…</div>}>
        <EmbeddedChat />
      </Suspense>
    );
  },
  BundlesTable: () => <BundlesTable />,
  ZuploIngressWithManagedDedicated: lazy(
    () => import("./diagrams/ZuploIngressWithManagedDedicated.js"),
  ),
  CustomerIngressWithManagedDedicated: lazy(
    () => import("./diagrams/CustomerIngressWithManagedDedicated.js"),
  ),
  ManagedDedicatedArchitecture: lazy(
    () => import("./diagrams/ManagedDedicatedArchitecture.js"),
  ),
  ManagedDedicatedDeploymentArchitecture: lazy(
    () => import("./diagrams/ManagedDedicatedDeploymentArchitecture.js"),
  ),
  ManagedDedicatedMultiRegionArchitecture: lazy(
    () => import("./diagrams/ManagedDedicatedMultiRegionArchitecture.js"),
  ),
  ManagedDedicatedEnvironmentsArchitecture: lazy(
    () => import("./diagrams/ManagedDedicatedEnvironmentsArchitecture.js"),
  ),
};
