import React from "react";
import {LoadingPlaceholder, ViewContainer} from "./components";

export const Summary: React.FC = () => {
  return (
    <ViewContainer title="Summary">
      <LoadingPlaceholder />
    </ViewContainer>
  );
};
