import React from "react";
import { useParams } from "react-router-dom";

interface DeviceProps {
  id?: string
  edit?: boolean
}

export const Device: React.FC<DeviceProps> = (props) => {
  const params = useParams<"id">()
  props = {
    id: params.id,
    ...props,
  }

  if (!props.edit) {
    return (
      <div>You are currently viewing a device: {props.id}</div>
    )
  }

  return (
    <div>You are currently editing a device</div>
  )
}

Device.defaultProps = {
  edit: false
}
