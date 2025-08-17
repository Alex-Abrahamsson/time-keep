'use client';

import React, { useState } from 'react';
import Style from './assignments.module.scss';
import {
    AssignmentSession,
    AssignmentType,
    AssignmentStatus,
} from '@/types/types';
import ColorDot from '../colorDot/colorDot';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase';
import Image from 'next/image';
import { getIcon } from '@/app/helpers/helper';

interface AssignmentsProps {
    assignment: AssignmentType;
    cardClick: (id: number) => void;
    selected?: boolean;
    expandTimeSheet: () => void;
}

export default function Assignments({
    assignment,
    cardClick,
    selected,
    expandTimeSheet,
}: AssignmentsProps) {
    const [localStatus, setLocalStatus] = useState<AssignmentStatus>(
        assignment.Status
    );
    const [error, setError] = useState<string | null>(null);

    const calculateBillableTime = (actualMinutes: number): number => {
        return actualMinutes <= 15 ? 15 : Math.ceil(actualMinutes / 15) * 15;
    };

    const handleStart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (assignment.Status === 'Active' || localStatus === 'Active') {
            return;
        }
        const assignmentRef = doc(
            db,
            assignment.UserId,
            assignment.Id.toString()
        );
        const now = new Date().toISOString();
        try {
            setError(null);
            await updateDoc(assignmentRef, {
                Sessions: arrayUnion({
                    Start: now,
                    End: null,
                    BillableTime: null,
                }),
                Status: 'Active',
            });
            setLocalStatus('Active');
        } catch (error) {
            console.error('Kunde inte starta session:', error);
            setError('Kunde inte starta session. Försök igen.');
        }
    };

    const handleStop = async (e: React.MouseEvent) => {
        e.stopPropagation();
        expandTimeSheet();
        const assignmentRef = doc(
            db,
            assignment.UserId,
            assignment.Id.toString()
        );
        const now = new Date().toISOString();
        try {
            setError(null);
            const sessions = [...(assignment.Sessions || [])];
            if (sessions.length > 0) {
                const lastIndex = sessions.length - 1;
                const session = sessions[lastIndex];
                if (!session.End) {
                    session.End = now;
                    const start = new Date(session.Start);
                    const end = new Date(session.End);
                    const diffMs = end.getTime() - start.getTime();
                    const diffMin = Math.ceil(diffMs / 60000);
                    session.BillableTime = calculateBillableTime(diffMin);
                }
            }

            const totalActualTime = sessions.reduce(
                (sum: number, s: AssignmentSession) => {
                    if (s.Start && s.End) {
                        const start = new Date(s.Start);
                        const end = new Date(s.End);
                        const diffMs = end.getTime() - start.getTime();
                        const diffMin = Math.ceil(diffMs / 60000);
                        return sum + diffMin;
                    }
                    return sum;
                },
                0
            );

            await updateDoc(assignmentRef, {
                Sessions: sessions,
                Status: 'Stopped',
                Time: totalActualTime,
            });
            setLocalStatus('Stopped');
        } catch (error) {
            console.error('Kunde inte stoppa session:', error);
            setError('Kunde inte stoppa session. Försök igen.');
        }
    };

    return (
        <div
            className={`${Style.assignmentsContainer} ${
                selected ? Style.selected : ''
            }`}
            onClick={() => cardClick(assignment.Id)}
        >
            {error && <div className={Style.error}>{error}</div>}
            <div className={Style.assignmentsHeader}>
                <div className={Style.icon}>
                    <Image
                        width={35}
                        height={35}
                        alt='none'
                        src={getIcon(assignment.Category)}
                        unoptimized
                    />
                </div>
                <div className={Style.assignmentsHeaderText}>
                    <h4>{assignment.TicketName}</h4>
                </div>
                <div className={Style.dotContainer}>
                    <ColorDot status={localStatus} />
                </div>
            </div>
            <div className={Style.assignmentsBody}>
                <p>{assignment.Costumer}</p>
            </div>
            <div
                className={`${
                    selected
                        ? Style.assignmentsFooterShown
                        : Style.assignmentsFooterHidden
                }`}
            >
                <button className={Style.StopButton} onClick={handleStop}>
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
                        <rect x='6' y='6' width='12' height='12' />
                    </svg>
                    Stop
                </button>
                <button className={Style.StartButton} onClick={handleStart}>
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
                        <polygon points='5 3 19 12 5 21 5 3' />
                    </svg>
                    Start
                </button>
            </div>
        </div>
    );
}
