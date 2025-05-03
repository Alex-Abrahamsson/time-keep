"use client";

import React from "react";
import Style from "./activeAssignment.module.scss";
import { AssignmentType } from "@/types/types";
import TicketButton from "../ticketButton/ticketButton";

interface activeAssignmentProps {
    assignment: AssignmentType;
}

export default function ActiveAssignment({ assignment }: activeAssignmentProps) {
    return (
        <div className={Style.activeAssignmentContainer}>
            <div className={Style.activeAssignmentHeader}>
                <h1>{assignment.costumer}</h1>
            </div>
            <div className={Style.activeAssignmentBody}>
                <p>{assignment.ticketName}</p>
                <p>{assignment.description}</p>
                <p>{assignment.time}</p>
            </div>
            <div className={Style.activeAssignmentButtons}>
                <TicketButton text="Pause" onClick={() => console.log("Pause")} color="#FF9800" />
                <TicketButton text="Start" onClick={() => console.log("Start")} color="#4CAF50" />
            </div>
        </div>
    );
}