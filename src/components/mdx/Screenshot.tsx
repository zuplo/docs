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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className={styles["screenshot"] + " " + styles[`screenshot-${size}`]}
    />
  );
};

export default Screenshot;
