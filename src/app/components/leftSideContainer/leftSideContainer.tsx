'use client';

import React from 'react';
import Style from './leftSideContainer.module.scss';

interface LeftSideContainerProps {
    headerText: string;
    children: React.ReactNode;
}

export default function LeftSideContainer({ headerText, children }: LeftSideContainerProps) {
    return (
        <div className={Style.leftSideContainer}>
            <div className={Style.leftSideContainerHeader}>
                <h1>{headerText}</h1>
                <button className={Style.leftSideAddButton} onClick={() => alert('Add button clicked!')}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-plus-circle"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                </button>
            </div>
            <div className={Style.leftSideContainerBody}>{children}</div>
        </div>
    );
}