import React from "react";
import Style from "./rightSideContainer.module.scss";

interface RightSideContainerProps {
  headerText: string;
    children: React.ReactNode;
}

export default function RightSideContainer({
  headerText,
  children,
}: RightSideContainerProps) {
  return (
    <div className={Style.rightSideContainer}>
      <div className={Style.rightSideContainerHeader}>
        <h1>{headerText}</h1>
      </div>
      <div className={Style.rightSideContainerBody}>{children}</div>
    </div>
  );
}
