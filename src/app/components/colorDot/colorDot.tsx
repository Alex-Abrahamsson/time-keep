import React from "react";
import Style from "./colorDot.module.scss";

interface ColorDotProps {
    status: string;
}

export default function ColorDot({ status }: ColorDotProps) {
    const getColor = () => {
        switch (status) {
            case "Active":
                return "green";
            case "Stopped":
                return "red";
            case "Paused":
                return "yellow";
            default:
                return "gray";
        }
    };

    return (
        <div className={Style.colorDotContainer}>
            <div 
                className={Style.colorDot} 
                style={{ backgroundColor: getColor() }} // Ändrar färg baserat på status
            ></div>
        </div>
    );
}
