import GithubButton from "@/components/markdown/GithubButton";
import { MDXProvider } from "@mdx-js/react";
import { ChevronLeftIcon } from "lucide-react";
import { Fence } from "../Fence";
import Callout from "./Callout";
import {
  ApiTestConsoleTabIcon,
  BuildStatusTabIcon,
  CodeEditorTabIcon,
  CopyIcon,
  DashboardTabIcon,
  DeveloperPortalIcon,
  GitHubIcon,
  LiveLogsTabIcon,
  SettingsTabIcon,
  ShowIcon,
} from "./ui-icons";
import BundlesTable from "../BundlesTable";

const components: React.ComponentProps<typeof MDXProvider>["components"] = {
  ChevronLeftIcon,
  CodeEditorTabIcon,
  ApiTestConsoleTabIcon,
  LiveLogsTabIcon,
  DashboardTabIcon,
  BuildStatusTabIcon,
  SettingsTabIcon,
  DeveloperPortalIcon,
  CopyIcon,
  ShowIcon,
  GitHubIcon,
  GithubButton,
  BundlesTable,
  Callout,
  pre: Fence as any,
  img: (props) => (
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    <img {...props} className="border border-gray-300 rounded-md" />
  ),
};

export default components;
