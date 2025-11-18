import { lazy, PropsWithChildren, Suspense } from "react";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { BundlesTable } from "./components/BundlesTable.js";
import { DocusaurusDocsLicense } from "./components/DocusaurusDocsLicense.js";
import { EnterpriseFeature } from "./components/EnterpriseFeature.js";
import { GithubButton } from "./components/GithubButton.js";
import { PolicyOverview } from "./components/PolicyOverview.js";
import ZupIt from "./components/ZupIt.js";
import { LegacyMonetization } from "./components/LegacyMonetization.js";
import { ModalScreenshot } from "./components/ModalScreenshot.js";
import { BrowserScreenshot } from "./components/BrowserScreenshot.js";
import {
  TutorialModeSelector,
  TutorialMode,
} from "./components/TutorialModeSelector.js";
import { QuickstartPicker } from "./components/QuickstartPicker.js";
import { Image } from "./components/Image.js";
import {
  CliCommand,
  CliCommandGroup,
  CliIntro,
  CliDoc,
} from "./components/CliCommand.js";
import { YouTubeEmbed } from "./components/YouTubeEmbed.js";

const iconStyle = { display: "inline", verticalAlign: "-0.125em" };

const EmbeddedChat = lazy(() => import("./components/EmbeddedChat.js"));

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
          <Image
            {...props}
            className="border border-[#eaecef] overflow-hidden rounded-sm"
          />
        </Framed>
      );
    }
    return (
      <Image
        {...props}
        className="border border-[#eaecef] overflow-hidden rounded-sm"
      />
    );
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
  CliCommand,
  CliCommandGroup,
  CliIntro,
  CliDoc,
  YouTubeEmbed,
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
