import React from "react";
import styles from "./Screenshot.module.css";

const Screenshot = ({
  src,
  alt,
  maxWidth,
}: {
  src: string;
  alt: string;
  maxWidth: string;
}) => {
  const mw = maxWidth ?? "80%";
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={styles["screenshot"]}
      style={{
        maxWidth: mw,
      }}
    />
  );
};

export default Screenshot;
