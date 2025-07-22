import React from "react";
import "./Tooltip.css";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

export const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltiptext">{text}</span>
    </div>
  );
};
