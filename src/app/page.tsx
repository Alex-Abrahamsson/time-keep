'use client';

import { useAuth } from '@/context/authContext';
import React, { useEffect, useState } from 'react';
import ActiveAssignment from './components/activeAssignment/activeAssignment';
import Assignments from './components/assignments/assignments';
import LeftSideContainer from './components/leftSideContainer/leftSideContainer';
import PageContainer from './components/page/pageContainer';
import RightSideContainer from './components/rightSideContainer/rightSideContainer';
import { useRouter } from 'next/navigation';
import { AssignmentSession, AssignmentType } from '@/types/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    const [assignments, setAssignments] = useState<AssignmentType[]>([]);
    const [activeAssignment, setActiveAssignment] =
        useState<AssignmentType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [shouldExpand, setShouldExpand] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push('/login');
        }
    }, [router]);

    const fetchAssignments = async () => {
        if (!user) return;
        try {
            const querySnapshot = await getDocs(collection(db, user.uid));
            const fetchedAssignments: AssignmentType[] = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                fetchedAssignments.push({
                    Id: Number(data.Id),
                    UserId: data.UserId,
                    Costumer: data.Costumer,
                    TicketName: data.TicketName,
                    Status: data.Status,
                    CreatedDate: data.Date,
                    Description: data.Description,
                    ActualTime: data.Time,
                    Sessions: (data.Sessions || []).map(
                        (s: AssignmentSession) => ({
                            Start: s.Start,
                            End: s.End ?? null,
                            BillableTime: s.BillableTime ?? null,
                        })
                    ),
                    Category: data.Category,
                });
            });

            setAssignments(fetchedAssignments);

            // Uppdatera activeAssignment om den finns i nya listan
            if (activeAssignment) {
                const updatedActive = fetchedAssignments.find(
                    (a) => a.Id === activeAssignment.Id
                );
                setActiveAssignment(updatedActive || null);
            } else if (fetchedAssignments.length > 0) {
                setActiveAssignment(fetchedAssignments[0]);
            }
        } catch (error) {
            console.error('Fel vid hämtning av uppdrag:', error);
        }
    };

    const handleExpandTimeSheet = () => {
        setShouldExpand(true);
        setTimeout(() => {
            setShouldExpand(false);
        }, 3000);
    };

    useEffect(() => {
        fetchAssignments();
    }, [user]);

    if (!isAuthenticated || !user) return null;

    const handleCardClick = (assignmentId: number) => {
        const selectedAssignment = assignments.find(
            (a) => a.Id === assignmentId
        );
        if (selectedAssignment) {
            setActiveAssignment(selectedAssignment);
        }
    };

    return (
        <PageContainer>
            <LeftSideContainer
                user={user}
                headerText='Uppdrag'
                refreshAssignments={fetchAssignments}
            >
                {assignments.map((assignment) => (
                    <Assignments
                        key={assignment.Id}
                        assignment={assignment}
                        cardClick={handleCardClick}
                        selected={activeAssignment?.Id === assignment.Id}
                        refreshAssignments={fetchAssignments}
                        expandTimeSheet={handleExpandTimeSheet}
                    />
                ))}
            </LeftSideContainer>
            <RightSideContainer
                headerText='Aktiv'
                assignment={assignments}
                shouldExpand={shouldExpand}
            >
                {activeAssignment && (
                    <ActiveAssignment assignment={activeAssignment} />
                )}
            </RightSideContainer>
        </PageContainer>
    );
}
