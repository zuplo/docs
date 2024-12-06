import { lazy, Suspense } from "react";
import type { ZudokuConfig } from "zudoku";
import { CogIcon, CopyIcon, FileTextIcon, ListEndIcon } from "zudoku/icons";
import { policies, sidebar } from "./sidebar.js";
import { BundlesTable } from "./src/BundlesTable";
import { EnterpriseFeature } from "./src/EnterpriseFeature";
import { GithubButton } from "./src/GithubButton";
import { HeadNavigation } from "./src/HeadNavigation";
import { PolicyOverview } from "./src/PolicyOverview";
import ZupIt from "./src/ZupIt.js";

const iconStyle = { display: "inline", verticalAlign: "-0.125em" };

const EmbeddedChat = lazy(() => import("./src/EmbeddedChat"));

const mdxComponents = {
  Screenshot: (props: any) => <img {...props} />,
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
  BundlesTables: () => <BundlesTable />,
};

const config: ZudokuConfig = {
  basePath: "/docs",
  page: {
    pageTitle: "Zuplo Docs",
    logoUrl: "https://portal.zuplo.com/zuplo.svg",
  },
  metadata: {
    title: "%s - Zuplo Docs",
    description: "Zuplo Documentation",
    generator: "Zudoku",
  },
  redirects: [
    {
      from: "/",
      to: "/articles/what-is-zuplo",
    },
  ],
  theme: {
    dark: {
      primary: "315.53 100% 50%",
      background: "0 0% 0%",
      border: "216 28.74% 17.06",
    },
    light: {
      primary: "316 91% 45%",
      background: "0 0 100%",
      border: "220 13.04% 90.98%",
    },
  },
  UNSAFE_slotlets: {
    "head-navigation-start": HeadNavigation,
  },
  search: {
    type: "inkeep",
    apiKey: "499c156cf7a9798343949c8bb5665ac95e48132c6d68c42e",
    integrationId: "clot3asdz0000s601nc8jwnzx",
    organizationId: "org_dDOlt2uJlMWM8oIS",
    primaryBrandColor: "#ff00bd",
    organizationDisplayName: "Zuplo",
  },
  topNavigation: [
    {
      id: "docs",
      label: "Documentation",
    },
    {
      id: "policies",
      label: "Policies & Handlers",
    },
    {
      id: "api",
      label: "API Reference",
    },
  ],
  sidebar: {
    docs: sidebar,
    policies: policies,
  },
  mdx: {
    components: mdxComponents,
  },
  apis: {
    type: "url",
    input: "https://developer-api-main-5b4bb7c.d2.zuplo.dev/openapi",
    navigationId: "api",
  },
  docs: [
    { files: "/docs/**/*.{md,mdx}" },
    { files: "/generated/**/*.{md,mdx}" },
  ],
};

export default config;
