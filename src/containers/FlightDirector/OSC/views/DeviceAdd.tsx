import React from "react";
import {useNavigate} from "react-router-dom";
import {ViewContainer} from "./components/ViewContainer";

export const DeviceAdd: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      text: "Cancel",
      color: "secondary",
      onClick() {
        navigate(-1);
      },
    },
    {
      text: "Save",
      color: "success",
      onClick() {},
    },
  ];

  return (
    <>
      <ViewContainer title="Add New Device" actions={actions}></ViewContainer>
    </>
  );
};
