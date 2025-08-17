'use client';

import { useAuth } from '@/context/authContext';
import React, { useEffect, useState } from 'react';
import ActiveAssignment from './components/activeAssignment/activeAssignment';
import Assignments from './components/assignments/assignments';
import LeftSideContainer from './components/leftSideContainer/leftSideContainer';
import PageContainer from './components/page/pageContainer';
import RightSideContainer from './components/rightSideContainer/rightSideContainer';
import { useRouter } from 'next/navigation';
import { AssignmentSession, AssignmentStatus, AssignmentType } from '@/types/types';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const [isMobile] = useIsMobile();

    const [assignments, setAssignments] = useState<AssignmentType[]>([]);
    const [activeAssignment, setActiveAssignment] =
        useState<AssignmentType | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [shouldExpand, setShouldExpand] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, user.uid),
            (snapshot) => {
                const fetchedAssignments: AssignmentType[] = snapshot.docs
                    .map((docSnap) => {
                        const data = docSnap.data();
                        const validStatus: AssignmentStatus = [
                            'Active',
                            'Stopped',
                            'Unknown',
                        ].includes(data.Status)
                            ? data.Status
                            : 'Unknown';
                        return {
                            Id: Number(data.Id),
                            UserId: data.UserId,
                            Costumer: data.Costumer,
                            TicketName: data.TicketName,
                            Status: validStatus,
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
                            Completed: !!data.Completed,
                        };
                    })
                    .filter((a) => !a.Completed);

                setAssignments(fetchedAssignments);
                setActiveAssignment((prev) =>
                    prev
                        ? fetchedAssignments.find((a) => a.Id === prev.Id) ||
                          fetchedAssignments[0] ||
                          null
                        : fetchedAssignments[0] || null
                );
                setIsLoading(false);
            },
            (error) => {
                console.error('Fel vid hämtning av uppdrag:', error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe(); // Rensa upp lyssnaren
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

    const handleExpandTimeSheet = () => {
        setShouldExpand(true);
        setTimeout(() => {
            setShouldExpand(false);
        }, 3000);
    };

const handleFinishAssignment = async (assignmentId: number) => {
    if (!user) return;
    setIsFinishing(true);
    setTimeout(async () => {
        try {
            await updateDoc(doc(db, user.uid, assignmentId.toString()), {
                Completed: true,
            });
        } catch (error) {
            alert('Kunde inte markera uppdraget som avslutat.' + error);
        } finally {
            setIsFinishing(false);
        }
    }, 400); // 400ms fade-out
};

    if (isMobile) {
        return (
            <PageContainer>
                <LeftSideContainer
                    user={user}
                    headerText='Uppdrag'
                    isLoading={isLoading}
                    noActiveAssignments={assignments.length === 0}
                >
                    {assignments.map((assignment) => (
                        <Assignments
                            key={assignment.Id}
                            assignment={assignment}
                            cardClick={handleCardClick}
                            selected={
                                activeAssignment?.Id === assignment.Id
                            }
                            expandTimeSheet={handleExpandTimeSheet}
                        />
                    ))}
                </LeftSideContainer>
            </PageContainer>
        );
    } else {
        return (
            <PageContainer>
                <LeftSideContainer
                    user={user}
                    headerText='Uppdrag'
                    isLoading={isLoading}
                    noActiveAssignments={assignments.length === 0}
                >
                    {assignments.map((assignment) => (
                        <Assignments
                            key={assignment.Id}
                            assignment={assignment}
                            cardClick={handleCardClick}
                            selected={
                                activeAssignment?.Id === assignment.Id
                            }
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
                        <ActiveAssignment
                            assignment={activeAssignment}
                            onFinish={handleFinishAssignment}
                            isFinishing={isFinishing}
                        />
                    )}
                </RightSideContainer>
            </PageContainer>
        );
    }
}
