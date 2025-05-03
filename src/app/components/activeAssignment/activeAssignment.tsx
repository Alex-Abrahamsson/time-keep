"use client";

import React from "react";
import Style from "./activeAssignment.module.scss";
import { AssignmentType } from "@/types/types";
import TicketButton from "../ticketButton/ticketButton";

interface activeAssignmentProps {
  assignment: AssignmentType;
  startTimeClick: () => void;
  pauseTimeClick: () => void;
}

export default function ActiveAssignment({ assignment, startTimeClick, pauseTimeClick }: activeAssignmentProps) {
  return (
    <div className={Style.activeAssignmentContainer}>
      <div className={Style.activeAssignmentHeader}>
        <h1>{assignment.ticketName}</h1>
      </div>
      <div className={Style.activeAssignmentBody}>
        <div className={Style.activeAssignmentInfo}>
          <p><b>Kund: </b></p>
          <p><b>Beskrivning: </b></p>
          <p><b>Tid: </b></p>
          <p><b>Start: </b></p>
          <p><b>Slut: </b></p>
        </div>
        <div className={Style.activeAssignmentInfoText}>
          <p>{assignment.costumer}</p>
          <p>{assignment.description}</p>
          <p>{assignment.time}</p>
          <p>{assignment.startTime ? assignment.startTime.toLocaleString() : "- : - : -"}</p>
          <p>{assignment.endTime ? assignment.endTime.toLocaleString() : "- : - : -"}</p>
        </div>
      </div>
      <div className={Style.activeAssignmentButtons}>
        <TicketButton text="Pause" onClick={pauseTimeClick} color="#FF9800" />
        <TicketButton text="Start" onClick={startTimeClick} color="#4CAF50" />
      </div>
    </div>
  );
}