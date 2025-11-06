import type { PropsWithChildren, ReactElement } from "react";

interface ModalScreenshotProps {
  size?: "sm" | "md" | "lg";
}

const marginClasses = {
  sm: "mx-32",
  md: "mx-16",
  lg: "mx-8",
};

export function ModalScreenshot({
  children,
  size,
}: PropsWithChildren<ModalScreenshotProps>): ReactElement {
  const marginClass = size ? (marginClasses[size] ?? "mx-auto") : "mx-auto";

  return (
    <div
      className={`[&>p]:m-0 [&>p]:p-0 [&>p>img]:m-0 [&>p>img]:p-0 my-8 ${marginClass}`}
    >
      <div className="relative block rounded-lg overflow-hidden shadow-2xl mx-auto max-w-[90%] [&_img]:!border-0 [&_img]:!rounded-none [&_img]:!p-0 [&_img]:!m-0 [&_img]:!block [&_img]:!max-w-full [&_img]:!h-auto [&_p]:!m-0 [&_p]:!p-0 [&_p]:!leading-[0]">
        <div className="absolute inset-0 backdrop-blur-lg pointer-events-none bg-black/30 dark:bg-white/20" />
        <div className="relative p-4 block">
          <div className="relative z-10 rounded-lg overflow-hidden shadow-lg border border-border">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
