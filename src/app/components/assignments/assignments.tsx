import React from "react";
import Style from "./assignments.module.scss";

interface Assignment {
    id: number;
    costumer: string;
    ticketName: string;
    status: string;
    date: string;
    description: string;
    time: string;
}

export default function Assignments( {assignment}: {assignment: Assignment}) {

    return (
        <div className={Style.assignmentsContainer}>
            <h4 className={Style.assignmentsHeader}>{assignment.costumer}</h4>
            <p>{assignment.ticketName}</p>
        </div>
    );
}
