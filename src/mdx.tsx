import { lazy, Suspense } from "react";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { BundlesTable } from "./BundlesTable";
import { DocusaurusDocsLicense } from "./DocusaurusDocsLicense";
import { EnterpriseFeature } from "./EnterpriseFeature";
import { GithubButton } from "./GithubButton";
import { PolicyOverview } from "./PolicyOverview";
import ZupIt from "./ZupIt.js";

const iconStyle = { display: "inline", verticalAlign: "-0.125em" };

const EmbeddedChat = lazy(() => import("./EmbeddedChat"));

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
    if (typeof window === "undefined") return null;

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
};
