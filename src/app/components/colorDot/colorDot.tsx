import React from "react";
import Style from "./colorDot.module.scss";

interface ColorDotProps {
    status: string;
}

export default function ColorDot({ status }: ColorDotProps) {
    const getColor = () => {
        switch (status) {
            case "Open":
                return "green";
            case "Closed":
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
