'use client';

import React from "react";
import Style from "./assignments.module.scss";
import { AssignmentType } from "@/types/types";
import ColorDot from "../colorDot/colorDot";
import Image from "next/image";

interface AssignmentsProps {
  assignment: AssignmentType;
  cardClick: () => void;
}

export default function Assignments({ assignment, cardClick }: AssignmentsProps) {

  const getIcon = (category: string) => {
    switch (category) {
      case "Bugg":
        return "/assets/bug.png";
      case "Utveckling":
        return "/assets/code.png";
      case "Konfiguration":
        return "/assets/config.png";
      default:
        return "/assets/bug.png";
    }
  };

  return (
    <div className={Style.assignmentsContainer} onClick={cardClick}>
      <div className={Style.assignmentsHeader}>
        <div className={Style.icon}>
          <Image
            width={35}
            height={35}
            alt="none" 
            src={getIcon(assignment.Category)}
            unoptimized
          />
        </div>
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