'use client';

import React from "react";
import Style from "./assignments.module.scss";
import { AssignmentType } from "@/types/types";
import ColorDot from "../colorDot/colorDot";

interface AssignmentsProps {
  assignment: AssignmentType;
  cardClick: () => void;
}

export default function Assignments({ assignment, cardClick }: AssignmentsProps) {
  return (
    <div className={Style.assignmentsContainer} onClick={cardClick}>
      <div className={Style.assignmentsHeader}>
        <div className={Style.icon}></div>
        <div className={Style.assignmentsHeaderText}>
          <h4>{assignment.TicketName}</h4>
        </div>
        <div className={Style.dotContainer}>
          <ColorDot status={assignment.Status} />
        </div>
      </div>
      <div className={Style.assignmentsBody}>
        <p>{assignment.Costumer}</p>
      </div>
    </div>
  );
}