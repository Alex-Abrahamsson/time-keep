import React, { useEffect, useState } from 'react';
import Style from './rightSideContainer.module.scss';
import { AssignmentType } from '@/types/types';
import TimeSheet from '../timeSheet/timeSheet';

interface RightSideContainerProps {
    headerText: string;
    children: React.ReactNode;
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
        // If shouldExpand is true, expand the right side container
        if (shouldExpand) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    }, [shouldExpand]);

    return (
        <div className={Style.rightSideContainer}>
            <div className={Style.rightSideContainerHeader}>
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
                    >
                        {isExpanded
                            ? 'D\nö\nl\nj'
                            : 'V\ni\ns\na'}
                    </button>
                    {isExpanded && <TimeSheet assignment={assignment} />}
                </div>
            </div>
            <div className={Style.rightSideContainerFooter}>
                <p>© 2025 AbraCode</p>
            </div>
        </div>
    );
}
