import React, { lazy, Suspense } from "react";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { BundlesTable } from "./BundlesTable.js";
import { DocusaurusDocsLicense } from "./DocusaurusDocsLicense.js";
import { EnterpriseFeature } from "./EnterpriseFeature.js";
import { GithubButton } from "./GithubButton.js";
import { PolicyOverview } from "./PolicyOverview.js";
import ZupIt from "./ZupIt.js";

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
  img: (props: any) => {
    let srcSet;

    if (
      import.meta.env.PROD &&
      props.src &&
      !props.srcSet &&
      !props.src.endsWith(".svg") &&
      !props.src.endsWith(".gif")
    ) {
      try {
        const path = /^https?:/.test(props.src)
          ? new URL(props.src).pathname
          : props.src;

        srcSet = [
          `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=640,format=auto${path}   640w`,
          `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=960,format=auto${path}   960w`,
          `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=1280,format=auto${path} 1280w`,
          `https://cdn.zuplo.com/cdn-cgi/image/fit=contain,width=2560,format=auto${path} 2560w`,
        ].join(", ");
      } catch (e) {
        console.error("Error parsing URL", props.src);
      }
    }

    return <img {...props} srcSet={srcSet} />;
  },
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
