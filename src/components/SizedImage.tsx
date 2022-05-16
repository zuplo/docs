import React from "react";

const SizedImage = ({
  src,
  alt,
  maxWidth,
}: {
  src: string;
  alt: string;
  maxWidth: number;
}) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    style={{
      maxWidth: maxWidth,
      marginRight: "auto",
      marginLeft: "auto",
      display: "inherit",
    }}
  />
);

export default SizedImage;
