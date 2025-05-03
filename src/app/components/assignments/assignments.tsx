import React from "react";
import Style from "./assignments.module.scss";
import { AssignmentType } from "@/types/types";
import ColorDot from "../colorDot/colorDot";

interface AssignmentsProps {
    assignment: AssignmentType;
}

export default function Assignments( {assignment}: AssignmentsProps) {

    return (
        <div className={Style.assignmentsContainer}>
            <div className={Style.assignmentsHeader}>
                <div className={Style.icon}></div>
                <div className={Style.assignmentsHeaderText}>
                    <h4>{assignment.costumer}</h4>
                </div>
                <div className={Style.dotContainer}>
                    <ColorDot status={assignment.status} />
                </div>
            </div>
            <div className={Style.assignmentsBody}>
            <p>{assignment.ticketName}</p>
            </div>
        </div>
    );
}
