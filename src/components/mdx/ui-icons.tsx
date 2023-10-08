import {
  BoltIcon,
  CogIcon,
  EyeIcon,
  PresentationChartLineIcon,
  RectangleGroupIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { FC } from "react";
import { FileText, List } from "react-feather";

const styles = {
  height: "19px",
  width: "19px",

  verticalAlign: "text-top",
};

export const CodeEditorTabIcon: FC = () => <FileText style={styles} />;

export const ApiTestConsoleTabIcon: FC = () => <BoltIcon style={styles} />;

export const LiveLogsTabIcon: FC = () => <RssIcon style={styles} />;

export const DashboardTabIcon: FC = () => (
  <PresentationChartLineIcon style={styles} />
);

export const BuildStatusTabIcon: FC = () => <List style={styles} />;

export const SettingsTabIcon: FC = () => <CogIcon style={styles} />;

export const DeveloperPortalIcon: FC = () => (
  <RectangleGroupIcon style={styles} />
);

export const CopyIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    style={{ ...styles, rotate: "90deg" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export const ShowIcon: FC = () => <EyeIcon style={styles} />;

export const GitHubIcon: FC = () => (
  <svg
    style={{ height: "21px", width: "21px", verticalAlign: "middle" }}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
    ></path>
  </svg>
);
