'use client';

import { useAuth } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import ActiveAssignment from "./components/activeAssignment/activeAssignment";
import Assignments from "./components/assignments/assignments";
import LeftSideContainer from "./components/leftSideContainer/leftSideContainer";
import PageContainer from "./components/page/pageContainer";
import RightSideContainer from "./components/rightSideContainer/rightSideContainer";
import { useRouter } from "next/navigation";
import { AssignmentSession, AssignmentType } from "@/types/types";
import { collection, doc, getDocs, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<AssignmentType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  // ✅ Hämtar uppdrag när användaren finns
  useEffect(() => {
    if (!user) return;

    const fetchAssignments = async () => {
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
            Date: data.Date,
            Description: data.Description,
            Time: data.Time,
            Sessions: (data.Sessions || []).map((s: AssignmentSession) => ({
              Start: s.Start,
              End: s.End ?? null,
            })),
          });
        });

        setAssignments(fetchedAssignments);
        if (fetchedAssignments.length > 0) {
          setActiveAssignment(fetchedAssignments[0]);
        }
      } catch (error) {
        console.error("Fel vid hämtning av uppdrag:", error);
      }
    };

    fetchAssignments();
  }, [user]);

  // 🛑 Viktigt: Stoppa rendering om inte inloggad
  if (!isAuthenticated || !user) return null;

  const handleCardClick = (assignmentId: number) => {
    const selectedAssignment = assignments.find((a) => a.Id === assignmentId);
    if (selectedAssignment) setActiveAssignment(selectedAssignment);
  };

  const handleStartTimeClick = async (assignment: AssignmentType) => {
    const assignmentRef = doc(db, assignment.UserId, assignment.Id.toString());
    const now = new Date().toISOString();

    try {
      await updateDoc(assignmentRef, {
        Sessions: arrayUnion({ Start: now, End: null }),
        Status: "Active",
      });
    } catch (error) {
      console.error("Kunde inte starta session:", error);
    }
  };

  const handlePauseTimeClick = async (assignment: AssignmentType) => {
    const assignmentRef = doc(db, assignment.UserId, assignment.Id.toString());

    try {
      const snapshot = await getDoc(assignmentRef);
      if (!snapshot.exists()) return;

      const data = snapshot.data() as AssignmentType;
      const sessions = data.Sessions || [];

      const updatedSessions = sessions.map((s, i, arr) =>
        i === arr.length - 1 && !s.End ? { ...s, End: new Date().toISOString() } : s
      );

      await updateDoc(assignmentRef, {
        Sessions: updatedSessions,
        Status: "Paused",
      });
    } catch (error) {
      console.error("Kunde inte pausa session:", error);
    }
  };

  return (
    <PageContainer>
      <LeftSideContainer user={user} headerText="Uppdrag">
        {assignments.map((assignment) => (
          <Assignments
            key={assignment.Id}
            assignment={assignment}
            cardClick={() => handleCardClick(assignment.Id)}
          />
        ))}
      </LeftSideContainer>
      <RightSideContainer headerText="Aktiv">
        {activeAssignment && (
          <ActiveAssignment
            assignment={activeAssignment}
            onStart={() => handleStartTimeClick(activeAssignment)}
            onPause={() => handlePauseTimeClick(activeAssignment)}
          />
        )}
      </RightSideContainer>
    </PageContainer>
  );
}