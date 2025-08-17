'use client';

import React, { useEffect, useState } from 'react';
import Style from './rightSideContainer.module.scss';
import { AssignmentType } from '@/types/types';
import TimeSheet from '../timeSheet/timeSheet';

interface RightSideContainerProps {
    headerText: string; // Kan göras striktare om specifika värden används
    children: React.ReactNode; // Kan typas som React.ReactElement om det är en specifik komponent
    assignment: AssignmentType[];
    shouldExpand: boolean;
}

export default function RightSideContainer({
    headerText,
    children,
    assignment,
    shouldExpand,
}: RightSideContainerProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsExpanded(shouldExpand);
    }, [shouldExpand]);

    return (
        <div className={Style.rightSideContainer}>
            <div
                className={Style.rightSideContainerHeader}
                role='region'
                aria-label='Huvudrubrik för högerpanelen'
            >
                <h1>{headerText}</h1>
            </div>
            <div className={Style.rightSideContainerBody}>
                <div className={Style.rightSideLeftContainerBody}>
                    {children}
                </div>
                <div
                    className={
                        isExpanded
                            ? Style.rightSideRightContainerBody
                            : Style.rightSideRightContainerBodyCollapsed
                    }
                >
                    <button
                        className={Style.toggleButton}
                        onClick={() => setIsExpanded((prev) => !prev)}
                        aria-expanded={isExpanded}
                        aria-label={
                            isExpanded
                                ? 'Dölj tidrapportpanel'
                                : 'Visa tidrapportpanel'
                        }
                    >
                        {isExpanded ? (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <polyline points='9 18 15 12 9 6' />
                            </svg>
                        ) : (
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <polyline points='15 18 9 12 15 6' />
                            </svg>
                        )}
                    </button>
                    {isExpanded ? (
                        <TimeSheet assignment={assignment} />
                    ) : null}
                </div>
            </div>
            <div
                className={Style.rightSideContainerFooter}
                role='contentinfo'
                aria-label='Sidfot för högerpanelen'
            >
                <p>© 2025 AbraCode</p>
            </div>
        </div>
    );
}
