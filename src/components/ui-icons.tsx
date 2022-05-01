import {
  CogIcon,
  LightningBoltIcon,
  PresentationChartLineIcon,
  RssIcon,
} from "@heroicons/react/outline";
import React, { FC } from "react";
import { FileText, List } from "react-feather";

const styles = {
  height: "19px",
  width: "19px",
  marginBottom: "-2px",
};

export const CodeEditorTabIcon: FC = () => {
  return <FileText style={styles} />;
};
export const ApiTestConsoleTabIcon: FC = () => {
  return <LightningBoltIcon style={styles} />;
};
export const LiveLogsTabIcon: FC = () => {
  return <RssIcon style={styles} />;
};
export const DashboardTabIcon: FC = () => {
  return <PresentationChartLineIcon style={styles} />;
};
export const BuildStatusTabIcon: FC = () => {
  return <List style={styles} />;
};
export const SettingsTabIcon: FC = () => {
  return <CogIcon style={styles} />;
};
