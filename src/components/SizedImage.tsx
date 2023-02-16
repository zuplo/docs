import React from "react";

const SizedImage = ({
  src,
  alt,
  maxWidth,
}: {
  src: string;
  alt: string;
  maxWidth: number;
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
      }}
    />
  );
};

export default SizedImage;
