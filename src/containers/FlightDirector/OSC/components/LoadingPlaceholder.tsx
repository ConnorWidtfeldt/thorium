import React from "react";
import {Spinner} from "reactstrap";

export const LoadingPlaceholder: React.FC = () => {
  return (
    <div className="oscLoadingPlaceholder">
      <Spinner type="border" color="primary" className="oscSpinner" />
    </div>
  );
};
