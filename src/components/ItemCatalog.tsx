import { useLocation } from "@docusaurus/router";
import React from "react";
import styles from "./ItemCatalog.module.css";

export default function ItemCatalog({
  items,
}: {
  items: { id: string; name: string; icon: string; href: string }[];
}) {
  const location = useLocation();

  return (
    <div className={styles["catalog-list"]}>
      {items
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item, index) => (
          <a key={item.id} href={item.href}>
            <div
              className={`${styles["catalog-item"]} ${
                location.pathname === item.href
                  ? styles["catalog-item-active"]
                  : undefined
              }`}
            >
              <div className={styles["catalog-item-head"]}>
                <img src={item.icon} width={48} height={48} />
              </div>
              <div className={styles["catalog-item-title"]}>{item.name}</div>
            </div>
          </a>
        ))}
    </div>
  );
}
