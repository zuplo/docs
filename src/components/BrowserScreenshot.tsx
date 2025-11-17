import type { CSSProperties, PropsWithChildren, ReactElement } from "react";

interface BrowserScreenshotProps {
  url?: string;
  browserTheme?: "light" | "dark";
  browserShadow?: string;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg";
}

const marginClasses = {
  sm: "mx-32",
  md: "mx-16",
  lg: "mx-8",
};

export function BrowserScreenshot({
  children,
  url = "https://example.com",
  browserTheme = "light",
  browserShadow = "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)",
  borderRadius = 8,
  className = "",
  style,
  size,
}: PropsWithChildren<BrowserScreenshotProps>): ReactElement {
  const isDark = browserTheme === "dark";

  const browserWindowStyle: CSSProperties = {
    borderRadius: `${borderRadius}px`,
    overflow: "hidden",
    boxShadow: browserShadow,
    backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
    margin: "0 auto",
    maxWidth: "90%",
    ...style,
  };

  const browserBarStyle: CSSProperties = {
    height: "40px",
    backgroundColor: isDark ? "#262626" : "#f6f6f6",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    gap: "16px",
    position: "relative" as const,
  };

  const trafficLightStyle: CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const dotStyle: CSSProperties = {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  };

  const navigationStyle: CSSProperties = {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  };

  const navButtonStyle: CSSProperties = {
    width: "14px",
    height: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    opacity: 0.6,
  };

  const urlBarStyle: CSSProperties = {
    flex: 1,
    maxWidth: "320px",
    height: "28px",
    backgroundColor: isDark ? "#1a1a1a" : "#fafafa",
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
    borderRadius: "20px",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    color: isDark ? "#888888" : "#666666",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  const contentStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    display: "block",
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
      <div
        className={`browser-screenshot-wrapper ${className}`}
        style={browserWindowStyle}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .browser-screenshot-wrapper img {
            border: 0 !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .browser-screenshot-wrapper p {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 0 !important;
          }
        `,
          }}
        />
        <div style={browserBarStyle}>
          <div style={trafficLightStyle}>
            <div
              style={{
                ...dotStyle,
                backgroundColor: "#FE5F57",
              }}
            />
            <div
              style={{
                ...dotStyle,
                backgroundColor: "#FEBB2E",
              }}
            />
            <div
              style={{
                ...dotStyle,
                backgroundColor: "#26C941",
              }}
            />
          </div>
          <div style={navigationStyle}>
            <div style={navButtonStyle}>
              <svg viewBox="0 0 16 16" fill={isDark ? "#888888" : "#666666"}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z"
                />
              </svg>
            </div>
            <div style={navButtonStyle}>
              <svg viewBox="0 0 16 16" fill={isDark ? "#888888" : "#666666"}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                />
              </svg>
            </div>
            <div style={navButtonStyle}>
              <svg viewBox="0 0 16 16" fill={isDark ? "#888888" : "#666666"}>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.00002 1.25C5.33749 1.25 3.02334 2.73677 1.84047 4.92183L1.48342 5.58138L2.80253 6.29548L3.15958 5.63592C4.09084 3.91566 5.90986 2.75 8.00002 2.75C10.4897 2.75 12.5941 4.40488 13.2713 6.67462H11.8243H11.0743V8.17462H11.8243H15.2489C15.6631 8.17462 15.9989 7.83883 15.9989 7.42462V4V3.25H14.4989V4V5.64468C13.4653 3.06882 10.9456 1.25 8.00002 1.25ZM1.50122 10.8555V12.5V13.25H0.0012207V12.5V9.07538C0.0012207 8.66117 0.337007 8.32538 0.751221 8.32538H4.17584H4.92584V9.82538H4.17584H2.72876C3.40596 12.0951 5.51032 13.75 8.00002 13.75C10.0799 13.75 11.8912 12.5958 12.8266 10.8895L13.1871 10.2318L14.5025 10.9529L14.142 11.6105C12.9539 13.7779 10.6494 15.25 8.00002 15.25C5.05453 15.25 2.53485 13.4313 1.50122 10.8555Z"
                />
              </svg>
            </div>
          </div>
          <div style={urlBarStyle}>
            <span
              style={{
                fontSize: "13px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {url}
            </span>
          </div>
        </div>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
