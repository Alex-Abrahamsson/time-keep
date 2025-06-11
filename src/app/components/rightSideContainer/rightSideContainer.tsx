import React, { useState } from 'react';
import Style from './rightSideContainer.module.scss';
import { AssignmentType } from '@/types/types';
import TimeSheet from '../timeSheet/timeSheet';

interface RightSideContainerProps {
    headerText: string;
    children: React.ReactNode;
    assignment: AssignmentType[];
}

export default function RightSideContainer({
    headerText,
    children,
    assignment,
}: RightSideContainerProps) {
    const [isExpanded, setIsExpanded] = useState(false); // Dold som standard

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
