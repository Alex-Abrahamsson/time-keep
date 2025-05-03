import React from "react";
import Style from "./ticketButton.module.scss";

interface TicketButtonProps {
    text: string;
    onClick: () => void;
    color: string;
}

export default function TicketButton({ text, onClick, color }: TicketButtonProps) {
    return (
        <button className={Style.ticketButton} onClick={onClick} style={{ backgroundColor: color }}>
            {text}
        </button>
    );
}