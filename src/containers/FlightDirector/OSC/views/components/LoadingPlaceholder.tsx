import React from "react";
import {Spinner} from "reactstrap";

export const LoadingPlaceholder = () => {
  return (
    <div className="oscLoadingPlaceholder">
      <Spinner type="border" color="primary" className="oscSpinner" />
    </div>
  );
};
