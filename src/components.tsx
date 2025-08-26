import { lazy, PropsWithChildren, Suspense } from "react";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { BundlesTable } from "./BundlesTable.js";
import { DocusaurusDocsLicense } from "./DocusaurusDocsLicense.js";
import { EnterpriseFeature } from "./EnterpriseFeature.js";
import { GithubButton } from "./GithubButton.js";
import { PolicyOverview } from "./PolicyOverview.js";
import ZupIt from "./ZupIt.js";
import { LegacyMonetization } from "./LegacyMonetization.js";
import { ModalScreenshot } from "./ModalScreenshot.js";
import { BrowserScreenshot } from "./BrowserScreenshot.js";
import { TutorialModeSelector, TutorialMode } from "./TutorialModeSelector.js";
import { QuickstartPicker } from "./QuickstartPicker.js";

const iconStyle = { display: "inline", verticalAlign: "-0.125em" };

const EmbeddedChat = lazy(() => import("./EmbeddedChat.js"));

const Image = (props: any) => {
  let srcSet;

  if (
    process.env.NODE_ENV === "production" &&
    props.src &&
    props.src.startsWith("https://cdn.zuplo.com") &&
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

  return (
    <img
      className="border border-[#eaecef] overflow-hidden rounded-sm"
      {...props}
      srcSet={srcSet}
    />
  );
};

const Framed = ({
  size,
  children,
}: { size?: "sm" | "md" | "lg" } & PropsWithChildren) => {
  const marginClasses = {
    sm: "mx-32",
    md: "mx-16",
    lg: "mx-8",
  };
  const marginClass = size
    ? marginClasses[size]
      ? marginClasses[size]
      : "mx-auto"
    : "mx-auto";

  return (
    <div
      className={`[&>p]:m-0 [&>p]:p-0 [&>p>img]:m-0 [&>p>img]:p-0 my-8 ${marginClass}`}
    >
      {children}
    </div>
  );
};

export const mdxComponents = {
  /**
   * This is used in some of the policies
   */
  Screenshot: (props: any) => {
    if (props.size) {
      return (
        <Framed size={props.size}>
          <Image {...props} />
        </Framed>
      );
    }
    return <Image {...props} />;
  },
  Framed,
  CodeType: (props: PropsWithChildren) => (
    <code className="text-green-600">&lt;{props.children}&gt;</code>
  ),
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
  img: Image,
  PolicyOverview,
  EnterpriseFeature,
  LegacyMonetization,
  ModalScreenshot,
  BrowserScreenshot,
  TutorialModeSelector,
  TutorialMode,
  QuickstartPicker,
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
