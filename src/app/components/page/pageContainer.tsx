import React from 'react';
import styles from './pageContainer.module.scss';
import CustomFooter from '../footer/customFooter';

export default function pageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.page}>
            {children}
            <CustomFooter />
        </div>
    );
}
