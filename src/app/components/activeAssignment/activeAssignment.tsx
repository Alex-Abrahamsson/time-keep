"use client";

import React from "react";
import Style from "./activeAssignment.module.scss";
import { AssignmentType } from "@/types/types";
import TicketButton from "../ticketButton/ticketButton";

interface ActiveAssignmentProps {
  assignment: AssignmentType;
  onStart: (assignment: AssignmentType) => void;
  onPause: (assignment: AssignmentType) => void;
}

export default function ActiveAssignment({
  assignment,
  onStart,
  onPause,
}: ActiveAssignmentProps) {
  const latestSession = assignment.Sessions?.[assignment.Sessions.length - 1];

  return (
    <div className={Style.activeAssignmentContainer}>
      <div className={Style.activeAssignmentHeader}>
        <h1>{assignment.TicketName}</h1>
      </div>
      <div className={Style.activeAssignmentBody}>
        <div className={Style.activeAssignmentInfo}>
          <p><b>Kund: </b>{assignment.Costumer}</p>
          <p><b>Beskrivning: </b>{assignment.Description}</p>
          <p><b>Totaltid: </b>{assignment.Time}</p>
          <p><b>Senaste start: </b>{latestSession?.Start ? new Date(latestSession.Start).toLocaleString() : "–"}</p>
          <p><b>Senaste paus: </b>{latestSession?.End ? new Date(latestSession.End).toLocaleString() : "–"}</p>
        </div>
      </div>
      <div className={Style.activeAssignmentButtons}>
        <TicketButton text="Pausa" onClick={() => onPause(assignment)} color="#FF9800" />
        <TicketButton text="Starta" onClick={() => onStart(assignment)} color="#4CAF50" />
      </div>
    </div>
  );
}