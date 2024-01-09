import React from "react";
import styles from "./Screenshot.module.css";

const Screenshot = ({
  src,
  alt,
  size = "lg",
}: {
  src: string;
  alt: string;
  size: "lg" | "md" | "sm";
}) => {
  return (
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={styles["screenshot"] + " " + styles[`screenshot-${size}`]}
    />
  );
};

export default Screenshot;
