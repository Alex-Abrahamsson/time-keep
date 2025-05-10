'use client';

import React, { useState } from 'react';
import Style from './leftSideContainer.module.scss';
import AddAssignmentModal from '@/app/modals/addAssignment/addAssignmentModal';
import { User } from '@/context/authContext';

interface LeftSideContainerProps {
    headerText: string;
    children: React.ReactNode;
    user: User;
}

export default function LeftSideContainer({ headerText, children, user }: LeftSideContainerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true); // Visa modalen
    };

    const closeModal = () => {
        setIsModalOpen(false); // Stäng modalen
    };

    return (
        <div className={Style.leftSideContainer}>
            <div className={Style.leftSideContainerHeader}>
                <h1>{headerText}</h1>
                <button className={Style.leftSideAddButton} onClick={() => openModal()}>
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
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                </button>
            </div>
            <div className={Style.leftSideContainerBody}>{children}</div>
            {isModalOpen && <AddAssignmentModal user={user} onClose={closeModal} />}
        </div>
    );
}