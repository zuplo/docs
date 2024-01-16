// Source: https://github.com/hasura/graphql-engine
// Apache License Version 2.0, January 2004

import { PropsWithChildren } from "react";
import styles from "./CustomTOCList.module.css";

const CustomTOCList = ({ children }: PropsWithChildren) => (
  <div className={styles["toc-list"]}>{children}</div>
);

const CustomTOCListSection = ({ children }: PropsWithChildren) => (
  <div className={styles["toc-list-section"]}>{children}</div>
);

const CustomTOCListHead = ({ children }: PropsWithChildren) => (
  <div className={styles["toc-list-head"]}>{children}</div>
);

const CustomTOCListContent = ({ children }: { children: any[] }) => (
  <ul className={styles["toc-list-content"]}>
    {children.map((child, index) => (
      <li key={`toc-lc-${index}`}>{child}</li>
    ))}
  </ul>
);

export {
  CustomTOCList,
  CustomTOCListContent,
  CustomTOCListHead,
  CustomTOCListSection,
};
