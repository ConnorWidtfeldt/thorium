import React from "react";
import {MacroConfigProps} from "helpers/genericTypes";

const OscInvokeMethod: React.FC<MacroConfigProps> = ({
  simulatorId,
  updateArgs,
  args
}) => {
  return (
    <div>
      <h1>OSC CONFIG</h1>
    </div>
  )
}

export const oscInvokeMethod = OscInvokeMethod;
