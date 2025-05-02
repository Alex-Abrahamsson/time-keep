import React from "react";
import styles from "./customFooter.module.scss";


export default function CustomFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h1>00:</h1>
        <h1>50:</h1>
        <h1>37</h1>
      </div>
    </footer>
  );
}