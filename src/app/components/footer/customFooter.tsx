import React from "react";
import styles from "./customFooter.module.scss";


export default function CustomFooter() {
  return (
    <footer className={styles.footer}>
        <div className={styles.footerContainer}>
            <p>© 2025 AbraCode</p>
        </div>
    </footer>
  );
}