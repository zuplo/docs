import GithubButton from "@/components/markdown/GithubButton";
import { MDXProvider } from "@mdx-js/react";
import { ChevronLeftIcon } from "lucide-react";
import { Fence } from "../Fence";
import Callout from "./Callout";
import ZupIt from "./ZupIt";
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
  Callout,
  ZupIt,
  pre: Fence as any,
  // img: (props) => (
  //   // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
  //   <img {...props} className="border border-gray-300 rounded-md" />
  // ),
};

export default components;
