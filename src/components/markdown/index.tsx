import GithubButton from "@/components/markdown/GithubButton";
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

const components = {
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
  pre: Fence,
};

export default components;
