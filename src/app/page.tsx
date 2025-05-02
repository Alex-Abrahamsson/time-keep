// This is a React component that serves as the main page of the application.
import Assignments from "./components/assignments/assignments";
import LeftSideContainer from "./components/leftSideContainer/leftSideContainer";
import PageContainer from "./components/page/pageContainer";
import RightSideContainer from "./components/rightSideContainer/rightSideContainer";

export default function Home() {

  const assignments = [
    { id: 1, costumer: "Kund A", ticketName: "Biljett 1", status: "Öppen", date: "2023-10-01", description: "Beskrivning 1", time: "10:00" },
    { id: 2, costumer: "Kund B", ticketName: "Biljett 2", status: "Stängd", date: "2023-10-02", description: "Beskrivning 2", time: "11:00" },
    { id: 3, costumer: "Kund C", ticketName: "Biljett 3", status: "Öppen", date: "2023-10-03", description: "Beskrivning 3", time: "12:00" },
    { id: 4, costumer: "Kund D", ticketName: "Biljett 4", status: "Stängd", date: "2023-10-04", description: "Beskrivning 4", time: "13:00" },
    { id: 5, costumer: "Kund E", ticketName: "Biljett 5", status: "Öppen", date: "2023-10-05", description: "Beskrivning 5", time: "14:00" },
    { id: 6, costumer: "Kund F", ticketName: "Biljett 6", status: "Stängd", date: "2023-10-06", description: "Beskrivning 6", time: "15:00" },
    { id: 7, costumer: "Kund G", ticketName: "Biljett 7", status: "Öppen", date: "2023-10-07", description: "Beskrivning 7", time: "16:00" },
    { id: 8, costumer: "Kund H", ticketName: "Biljett 8", status: "Stängd", date: "2023-10-08", description:"Beskrivning 8" , time:"17.00"},
  ]

  return (
    <PageContainer>
      <LeftSideContainer headerText="Uppdrag">
        {assignments.map((assignment) => (
            <Assignments key={assignment.id} assignment={assignment} />
          ))}
      </ LeftSideContainer>
      <RightSideContainer headerText="Aktiv">
        <div>
          <h2>Right Side Container</h2>
          <p>This is the right side container.</p>
          <p>It can also contain various components or information.</p>
          <p>Feel free to customize it!</p>
        </div>
      </RightSideContainer>
    </PageContainer>
  );
}
