import React from "react";

const StyledImage = ({
  src,
  alt,
  maxWidth,
  screenshot,
}: {
  src: string;
  alt: string;
  maxWidth: number;
  screenshot: boolean;
}) => {
  const mw = maxWidth ?? "100%";
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      style={{
        maxWidth: mw,
        marginRight: "auto",
        marginLeft: "auto",
        display: "inherit",
        width: "auto",
        border: screenshot ? "1px solid #eaeaea" : undefined,
        borderRadius: screenshot ? "8px" : undefined,
      }}
    />
  );
};

export default StyledImage;
