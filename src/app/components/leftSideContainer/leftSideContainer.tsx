'use client';

import React from 'react';
import Style from './leftSideContainer.module.scss';
import { User } from '@/context/authContext';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import Assignments from '../assignments/assignments';

interface LeftSideContainerProps {
    headerText: string;
    children: React.ReactElement<typeof Assignments>[] | null;
    user: User;
    selectedAssignmentId?: number | null;
    isLoading: boolean;
    noActiveAssignments: boolean;
}

export default function LeftSideContainer({
    headerText,
    children,
    isLoading,
    noActiveAssignments
}: LeftSideContainerProps) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className={Style.leftSideContainer}>
            <div className={Style.leftSideContainerHeader}>
                <h1>{headerText}</h1>
            </div>
            <div className={Style.leftSideContainerBody}>
                {isLoading && <div className={Style.Err}>Laddar uppdrag...</div>}
                {noActiveAssignments && <div className={Style.Err}>Inga aktiva uppdrag.</div>}
                {children}
            </div>
            <div className={Style.leftSideContainerFooter}>
                <button
                    className={Style.leftSideLogoutButton}
                    onClick={handleLogout}
                >
                    Logga ut
                </button>
            </div>
        </div>
    );
}
