import React from 'react';
import styles from './pageContainer.module.scss';

export default function pageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.page}>
            {children}
        </div>
    );
}
