"use client";

import React from "react";
import Style from "./activeAssignment.module.scss";
import { AssignmentType } from "@/types/types";

interface ActiveAssignmentProps {
  assignment: AssignmentType;
}

export default function ActiveAssignment({
  assignment,
}: ActiveAssignmentProps) {
  const latestSession = assignment.Sessions?.[assignment.Sessions.length - 1];

  // Summera all BillableTime (i minuter)
  const totalBillableTime = assignment.Sessions
    ? assignment.Sessions.reduce(
        (sum, session) => sum + (session.BillableTime ?? 0),
        0
      )
    : 0;

  return (
    <div className={Style.activeAssignmentContainer}>
      <div className={Style.activeAssignmentHeader}>
        <h1>{assignment.TicketName}</h1>
      </div>
      <div className={Style.activeAssignmentBody}>
        <div className={Style.activeAssignmentInfo}>
          <p><b>Kund: </b>{assignment.Costumer}</p>
          <p><b>Beskrivning: </b>{assignment.Description}</p>
          <p><b>Senaste start: </b>{latestSession?.Start ? new Date(latestSession.Start).toLocaleString() : "00:00:00"}</p>
          <p><b>Senaste paus: </b>{latestSession?.End ? new Date(latestSession.End).toLocaleString() : "00:00:00"}</p>
          <p><b>Senaste Debiterbar tid: </b>{latestSession?.BillableTime ?? "0"} min</p>
        </div>
      </div>
      <div className={Style.activeAssignmentButtons}>
        <p className={Style.activeAssignmentTotalTime}>
          <b>Faktisk tid: </b>{assignment.ActualTime ?? 0} min
        </p>
        <p className={Style.activeAssignmentTotalTime}>
          <b>Debiterbar tid: </b> {totalBillableTime} min
        </p>
      </div>
    </div>
  );
}