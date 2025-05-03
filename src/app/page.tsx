// This is a React component that serves as the main page of the application.
import ActiveAssignment from "./components/activeAssignment/activeAssignment";
import Assignments from "./components/assignments/assignments";
import LeftSideContainer from "./components/leftSideContainer/leftSideContainer";
import PageContainer from "./components/page/pageContainer";
import RightSideContainer from "./components/rightSideContainer/rightSideContainer";

export default function Home() {

  const assignments = [
    { id: 1, costumer: "Sisab", ticketName: "TICKET-423", status: "Open", date: "2023-10-01", description: "Beskrivning 1", time: "10:00" },
    { id: 2, costumer: "Sisab", ticketName: "FASIT-321", status: "Closed", date: "2023-10-02", description: "Beskrivning 2", time: "11:00" },
    { id: 3, costumer: "Fabege", ticketName: "FAB-554", status: "Open", date: "2023-10-03", description: "Beskrivning 3", time: "12:00" },
    { id: 4, costumer: "Vasa", ticketName: "TICKET-21", status: "Paused", date: "2023-10-04", description: "Beskrivning 4", time: "13:00" },
    { id: 5, costumer: "Wallenberg", ticketName: "TICKET-542", status: "Open", date: "2023-10-05", description: "Beskrivning 5", time: "14:00" },
    { id: 6, costumer: "Alleima", ticketName: "ALL-65", status: "Closed", date: "2023-10-06", description: "Beskrivning 6", time: "15:00" },
    { id: 7, costumer: "Stockholmshem", ticketName: "STH-132", status: "Open", date: "2023-10-07", description: "Beskrivning 7", time: "16:00" },
    { id: 8, costumer: "Balder", ticketName: "TICKET-664", status: "Closed", date: "2023-10-08", description:"Beskrivning 8" , time:"17.00"},
  ]

  return (
    <PageContainer>
      <LeftSideContainer headerText="Uppdrag">
        {assignments.map((assignment) => (
            <Assignments key={assignment.id} assignment={assignment} />
          ))}
      </ LeftSideContainer>
      <RightSideContainer headerText="Aktiv">
        <ActiveAssignment assignment={assignments[0]} />
      </RightSideContainer>
    </PageContainer>
  );
}
