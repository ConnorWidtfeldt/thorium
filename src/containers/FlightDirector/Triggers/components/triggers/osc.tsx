import React from "react";

// export const oscInvokeMethod = {
//   name: "OSC: Invoke Method",
//   objectKey: "oscInvokeMethod",
//   category: "Triggers",
//   component: () => (
//     <div>
//       Event:
//     </div>
//   )
// }


export const oscInvokeMethod = {
  name: "oscInvokeMethod",
  category: "Actions",
  component: () => (
    <div
      style={{display: "flex", flexDirection: "column"}}
      onMouseDown={e => e.stopPropagation()}
    >
      Stop All Sounds
    </div>
  ),
  inputs: [
    
  ]
}
