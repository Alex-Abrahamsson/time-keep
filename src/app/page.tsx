'use client';

import { useAuth } from '@/context/authContext';
import React, { useEffect, useState } from 'react';
import ActiveAssignment from './components/activeAssignment/activeAssignment';
import Assignments from './components/assignments/assignments';
import LeftSideContainer from './components/leftSideContainer/leftSideContainer';
import PageContainer from './components/page/pageContainer';
import RightSideContainer from './components/rightSideContainer/rightSideContainer';
import { useRouter } from 'next/navigation';
import {
    AssignmentSession,
    AssignmentStatus,
    AssignmentType,
} from '@/types/types';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isMobile] = useIsMobile();

    const [assignments, setAssignments] = useState<AssignmentType[]>([]);
    const [activeAssignment, setActiveAssignment] = useState<AssignmentType | null>(null);
    const [isFinishing, setIsFinishing] = useState(false);
    const [shouldExpand, setShouldExpand] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Redirect till login om användaren inte är inloggad
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Logga User ID för att använda i extensionen
    useEffect(() => {
        if (user) {
            console.log('🔑 Ditt User ID för extensionen:', user.uid);
            console.log('📋 Kopiera detta och uppdatera i extension settings!');
        }
    }, [user]);

    useEffect(() => {
        if (!user?.uid) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const assignmentsCollection = collection(
            db,
            'userProfiles',
            user.uid,
            'assignments'
        );

        const unsubscribe = onSnapshot(
            assignmentsCollection,
            (snapshot) => {
                console.log("Snapshot triggades! Antal dokument:", snapshot.size);
                console.log("Första dokumentets status:", snapshot.docs[0]?.data()?.Status);
                const fetchedAssignments: AssignmentType[] = snapshot.docs
                    .map((docSnap) => {
                        const data = docSnap.data();

                        // Säkrare status-hantering
                        const status = data.Status as AssignmentStatus;
                        const validStatus: AssignmentStatus =
                            ['Active', 'Stopped', 'Unknown'].includes(status)
                                ? status
                                : 'Unknown';

                        return {
                            Id: Number(docSnap.id),           // ← Använd doc.id istället för data.Id
                            UserId: data.UserId,
                            Costumer: data.Costumer || '',
                            TicketName: data.TicketName || '',
                            Status: validStatus,
                            CreatedDate: data.CreatedDate || data.Date,
                            Description: data.Description || '',
                            ActualTime: data.Time ?? 0,
                            Sessions: (data.Sessions || []).map((s: AssignmentSession) => ({
                                Start: s.Start || '',
                                End: s.End ?? null,
                                BillableTime: s.BillableTime ?? null,
                            })),
                            Category: data.Category || '',
                            Completed: !!data.Completed,
                            TicketURL: data.JiraUrl || '',
                        };
                    })
                    .filter((a) => !a.Completed)
                    // Valfritt: sortera här om du vill ha en fast ordning
                    .sort((a, b) => b.CreatedDate.localeCompare(a.CreatedDate)); // nyast först t.ex.

                setAssignments(fetchedAssignments);

                // Uppdatera activeAssignment smartare
                setActiveAssignment((prev) => {
                    if (!prev) {
                        return fetchedAssignments[0] || null;
                    }
                    // Behåll samma om den fortfarande finns
                    const stillExists = fetchedAssignments.find(a => a.Id === prev.Id);
                    return stillExists || fetchedAssignments[0] || null;
                });

                setIsLoading(false);
            },
            (error) => {
                console.error('Fel vid hämtning av uppdrag:', error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    // Visa loading-state medan Firebase Auth laddar
    if (authLoading || isLoading) {
        return (
            <PageContainer>
                <div
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        padding: '2rem',
                    }}
                >
                    Laddar...
                </div>
            </PageContainer>
        );
    }

    // Visa inget om användaren inte är inloggad (redirect sker i useEffect)
    if (!user) return null;

    const handleCardClick = (assignmentId: number) => {
        const selectedAssignment = assignments.find(
            (a) => a.Id === assignmentId,
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
                await updateDoc(
                    doc(
                        db,
                        'userProfiles',
                        user.uid,
                        'assignments',
                        assignmentId.toString(),
                    ),
                    {
                        Completed: true,
                    },
                );
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
                    isMobile={isMobile}
                >
                    {assignments.map((assignment) => (
                        <Assignments
                            key={assignment.Id}
                            assignment={assignment}
                            cardClickAction={handleCardClick}
                            selected={activeAssignment?.Id === assignment.Id}
                            expandTimeSheetAction={handleExpandTimeSheet}
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
                    isMobile={isMobile}
                >
                    {assignments.map((assignment) => (
                        <Assignments
                            key={assignment.Id}
                            assignment={assignment}
                            cardClickAction={handleCardClick}
                            selected={activeAssignment?.Id === assignment.Id}
                            expandTimeSheetAction={handleExpandTimeSheet}
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
                            onFinishAction={handleFinishAssignment}
                            isFinishing={isFinishing}
                        />
                    )}
                </RightSideContainer>
            </PageContainer>
        );
    }
}
