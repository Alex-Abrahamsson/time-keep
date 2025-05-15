'use client';

import React, { useState, useEffect } from 'react';
import Style from './leftSideContainer.module.scss';
import AddAssignmentModal from '@/app/modals/addAssignment/addAssignmentModal';
import { User } from '@/context/authContext';
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";


interface LeftSideContainerProps {
    headerText: string;
    children: React.ReactNode;
    user: User;
    refreshAssignments: () => void;
}

export default function LeftSideContainer({ headerText, children, user, refreshAssignments }: LeftSideContainerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Update page when modal closes
        if (!isModalOpen) {
            // Perform any action when the modal is closed
            console.log("Modal closed");
        }
    }
    , [isModalOpen]);

    const handleLogout = () => {
    logout();
    router.push("/login");
    };


    const openModal = () => {
        setIsModalOpen(true); // Visa modalen
    };

    const closeModalAndRefresh = () => {
    setIsModalOpen(false);
    refreshAssignments();
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
            <div className={Style.leftSideContainerBody}>
                {children}
            </div>
            <div className={Style.leftSideContainerFooter}>
                <button className={Style.leftSideLogoutButton} onClick={handleLogout}>
                    Logga ut
                </button>
            </div>
            {isModalOpen && <AddAssignmentModal user={user} onClose={closeModalAndRefresh} />}
        </div>
    );
}