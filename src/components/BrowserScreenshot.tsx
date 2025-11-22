import type { PropsWithChildren, ReactElement } from "react";

interface BrowserScreenshotProps {
  url?: string;
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
  size,
}: PropsWithChildren<BrowserScreenshotProps>): ReactElement {
  const marginClass = size ? (marginClasses[size] ?? "mx-auto") : "mx-auto";

  return (
    <div
      className={`[&>p]:m-0 [&>p]:p-0 [&>p>img]:m-0 [&>p>img]:p-0 my-8 ${marginClass}`}
    >
      <div className="overflow-hidden mx-auto max-w-[90%] rounded-lg shadow-lg border border-border bg-card [&_img]:!border-0 [&_img]:!rounded-none [&_img]:!p-0 [&_img]:!m-0 [&_img]:!block [&_img]:!max-w-full [&_img]:!h-auto [&_p]:!m-0 [&_p]:!p-0 [&_p]:!leading-[0]">
        <div className="h-10 flex items-center px-4 gap-4 relative bg-gray-100 dark:bg-gray-900">
          <div className="flex gap-2 items-center">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#FE5F57" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#FEBB2E" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#26C941" }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer opacity-60 text-gray-600 dark:text-gray-400">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z"
                />
              </svg>
            </div>
            <div className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer opacity-60 text-gray-600 dark:text-gray-400">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                />
              </svg>
            </div>
            <div className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer opacity-60 text-gray-600 dark:text-gray-400">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.00002 1.25C5.33749 1.25 3.02334 2.73677 1.84047 4.92183L1.48342 5.58138L2.80253 6.29548L3.15958 5.63592C4.09084 3.91566 5.90986 2.75 8.00002 2.75C10.4897 2.75 12.5941 4.40488 13.2713 6.67462H11.8243H11.0743V8.17462H11.8243H15.2489C15.6631 8.17462 15.9989 7.83883 15.9989 7.42462V4V3.25H14.4989V4V5.64468C13.4653 3.06882 10.9456 1.25 8.00002 1.25ZM1.50122 10.8555V12.5V13.25H0.0012207V12.5V9.07538C0.0012207 8.66117 0.337007 8.32538 0.751221 8.32538H4.17584H4.92584V9.82538H4.17584H2.72876C3.40596 12.0951 5.51032 13.75 8.00002 13.75C10.0799 13.75 11.8912 12.5958 12.8266 10.8895L13.1871 10.2318L14.5025 10.9529L14.142 11.6105C12.9539 13.7779 10.6494 15.25 8.00002 15.25C5.05453 15.25 2.53485 13.4313 1.50122 10.8555Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 max-w-xs h-7 rounded-full px-3 flex items-center justify-center text-[13px] font-sans bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <span className="text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">
              {url}
            </span>
          </div>
        </div>
        <div className="bg-card block">{children}</div>
      </div>
    </div>
  );
}
