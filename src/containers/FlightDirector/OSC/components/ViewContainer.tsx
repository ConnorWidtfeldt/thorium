import React from "react";
import {Button} from "reactstrap";

interface ActionItem {
  text: string;
  color?: string;
  onClick: () => void;
}
interface ViewContainerProps {
  title: string;
  children?: React.ReactNode;
  actions?: ActionItem[];
}

export const ViewContainer: React.FC<ViewContainerProps> = props => {
  return (
    <div>
      <div className="oscNav">
        <h3 className="oscNav_heading">{props.title}</h3>
        <div className="oscNav_actions">
          {props.actions?.map(button => (
            <Button
              color={button.color}
              onClick={button.onClick}
              key={button.text}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>

      <div className="oscBody">{props.children}</div>
    </div>
  );
};
