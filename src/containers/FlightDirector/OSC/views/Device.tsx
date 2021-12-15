import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {Label, Input} from "reactstrap";
import {
  useOscDeviceConfigureMutation,
  OscDeviceConfig,
  useOscDevicesSubscription,
  useOscDeviceQuery,
} from "generated/graphql";

import {ViewContainer} from "./components";
import {useDebounce} from "helpers/useDebounce";

interface DeviceProps {
  id?: string;
  edit?: boolean;
}
export const Device: React.FC<DeviceProps> = props => {
  const params = useParams<"id">();
  props = {
    id: params.id,
    ...props,
  };

  const {data: deviceData, loading: deviceLoading} = useOscDeviceQuery({
    variables: {
      id: props.id!,
    },
  });
  const device = deviceData?.oscDevice;

  const [configureDevice] = useOscDeviceConfigureMutation();
  const configureDeviceDebounce = useDebounce(configureDevice, 250);
  const [config, setConfig] = useState<OscDeviceConfig>();

  if (config === undefined && !deviceLoading && device) {
    setConfig(device);
  }

  const updateConfig = (newConfig: Partial<OscDeviceConfig>) => {
    setConfig({...config, ...newConfig});
    configureDeviceDebounce({
      variables: {
        id: props.id!,
        config: newConfig,
      },
    });
  };

  return (
    <ViewContainer title="Edit Device">
      <div className="oscDevice oscCard">
        <Label for="name">Name</Label>
        <Input
          name="name"
          type="text"
          value={config?.name || ""}
          onChange={({target}) => updateConfig({name: target.value})}
        />

        <Label for="address">Address</Label>
        <Input
          name="address"
          type="text"
          value={config?.address || ""}
          onChange={({target}) => updateConfig({address: target.value})}
        />

        <Label for="port">Port</Label>
        <Input
          name="port"
          type="number"
          min={0}
          max={65535}
          value={config?.port || ""}
          onChange={({target}) => updateConfig({port: parseInt(target.value)})}
        />
      </div>
    </ViewContainer>
  );
};

Device.defaultProps = {
  edit: false,
};
