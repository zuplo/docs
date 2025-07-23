import type { CSSProperties, PropsWithChildren, ReactElement } from "react";

interface ModalScreenshotProps {
  overlayOpacity?: number;
  overlayBlur?: number;
  modalPadding?: number;
  modalBorderRadius?: number;
  modalShadow?: string;
  className?: string;
  style?: CSSProperties;
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
  overlayOpacity = 0.3,
  overlayBlur = 8,
  modalPadding = 16,
  modalBorderRadius = 8,
  modalShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
  className = "",
  style,
}: PropsWithChildren<ModalScreenshotProps>): ReactElement {
  const wrapperStyle: CSSProperties = {
    position: "relative",
    display: "block",
    borderRadius: `${modalBorderRadius}px`,
    overflow: "hidden",
    boxShadow: modalShadow,
    margin: "0 auto",
    maxWidth: "90%",
    ...style,
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    backdropFilter: `blur(${overlayBlur}px)`,
    WebkitBackdropFilter: `blur(${overlayBlur}px)`,
    pointerEvents: "none",
  };

  const imageContainerStyle: CSSProperties = {
    position: "relative",
    padding: `${modalPadding}px`,
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
        className={`modal-screenshot-wrapper ${className}`}
        style={wrapperStyle}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .modal-screenshot-wrapper img {
            border: 0 !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .modal-screenshot-wrapper p {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 0 !important;
          }
        `,
          }}
        />
        <div style={overlayStyle} />
        <div style={imageContainerStyle}>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: `${modalBorderRadius}px`,
              overflow: "hidden",
              boxShadow:
                "0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
