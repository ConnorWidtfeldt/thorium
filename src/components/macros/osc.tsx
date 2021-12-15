import React, {useState} from "react";
import {MacroConfigProps} from "helpers/genericTypes";

import {Input, Label} from "reactstrap";

import {
  OscDevice,
  OscMethod,
  useOscDevicesSubscription,
  useOscMethodArgsQuery,
  useOscMethodsQuery,
} from "generated/graphql";

const groupMethods = (methods: OscMethod[]): {[key: string]: OscMethod[]} => {
  const map = new Map();
  methods.forEach(item => {
    const key = item.group;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Object.fromEntries(map);
};
const UNSELECTED_VALUE = "_unselected";

interface OscDeviceSelectionProps {
  deviceId?: string;
  onChange: (deviceId?: string, dictionaryId?: string) => void;
}
const OscDeviceSelection: React.FC<OscDeviceSelectionProps> = props => {
  const {data} = useOscDevicesSubscription();
  const devices = (data?.oscDevices || []) as OscDevice[];

  const getDeviceDictionaryId = (deviceId?: string) => {
    return devices.find(device => device.id === deviceId)?.dictionary?.id;
  };

  return (
    <>
      <Label for="device">Device:</Label>
      <Input
        name="device"
        type="select"
        value={props.deviceId || UNSELECTED_VALUE}
        onChange={({target}) =>
          props.onChange(target.value, getDeviceDictionaryId(target.value))
        }
      >
        <option disabled value={UNSELECTED_VALUE}>
          Select a Device
        </option>
        {devices.map(device => (
          <option value={device.id} key={device.id}>
            {device.name}
          </option>
        ))}
      </Input>
    </>
  );
};

interface OscMethodSelectionProps {
  enabled: boolean;
  dictionaryId?: string;
  methodId?: string;
  onChange: (methodId: string) => void;
}
const OscMethodSelection: React.FC<OscMethodSelectionProps> = props => {
  const {data} = useOscMethodsQuery({
    variables: {dictionary: props.dictionaryId},
  });
  const methods = (data?.oscMethods || []) as OscMethod[];
  const groups = groupMethods(methods);

  return (
    <>
      <Label for="method">Method:</Label>
      <Input
        name="method"
        type="select"
        disabled={!props.enabled}
        value={props.methodId || UNSELECTED_VALUE}
        onChange={({target}) => props.onChange(target.value)}
      >
        <option disabled value={UNSELECTED_VALUE}>
          Select a Method
        </option>
        {Object.entries(groups).map(([group, methods]) => (
          <optgroup label={group} key={group}>
            {methods.map((method: OscMethod) => (
              <option value={method.id} key={method.id}>
                {method.name}
              </option>
            ))}
          </optgroup>
        ))}
      </Input>
    </>
  );
};

interface OscArgProps<T> {
  key: string;
  name: string;
  value?: T;
  onChange: (value: T) => void;
}
const StringArg: React.FC<OscArgProps<string>> = props => (
  <div key={props.key}>
    <Label name={"arg_" + props.key} type="text">
      {props.name}:
    </Label>
    <Input
      name={"arg_" + props.key}
      type="text"
      value={props.value || ""}
      onChange={({target}) => props.onChange(target.value)}
    ></Input>
  </div>
);

const argComponent: {[key: string]: React.FC<OscArgProps<any>>} = {
  string: StringArg,
};

interface ArgValues {
  [key: string]: any;
}

interface OscMethodArgsProps {
  methodId: string;
  args: ArgValues;
  updateArgs: (ags: ArgValues) => void;
}
const OscMethodArgs: React.FC<OscMethodArgsProps> = props => {
  const {data} = useOscMethodArgsQuery({
    variables: {
      methodId: props.methodId,
    },
  });
  const methodArgs = data?.oscMethodArgs;

  return (
    <fieldset>
      <legend>Arguments</legend>
      {methodArgs?.map(arg =>
        argComponent[arg.type]({
          key: arg.key,
          name: arg.name,
          value: props.args[arg.key],
          onChange: value => {
            let newValues = props.args;
            newValues[arg.key] = value;
            props.updateArgs(newValues);
          },
        }),
      )}
    </fieldset>
  );
};

const OscInvokeMethod: React.FC<MacroConfigProps> = ({updateArgs, args}) => {
  const [methodArgs, setMethodArgs] = useState<ArgValues>();
  if (methodArgs === undefined && typeof args.methodArgs === "object") {
    // setMethodArgs(args.methodArgs)
  }

  return (
    <div className="oscConfig">
      <OscDeviceSelection
        deviceId={args.deviceId}
        onChange={(id, dictionary) => {
          //setDictionaryId(dictionary);
          updateArgs("deviceId", id);
        }}
      />
      <OscMethodSelection
        enabled={args.deviceId !== undefined}
        dictionaryId={"qlab"}
        methodId={args.methodId}
        onChange={id => updateArgs("methodId", id)}
      />

      <OscMethodArgs
        methodId={args.methodId}
        args={methodArgs || {}}
        updateArgs={newArgs => {
          console.log(newArgs);
          setMethodArgs(newArgs);
          // updateArgs("methodArgs", newArgs)
        }}
      />
    </div>
  );
};

export const oscInvokeMethod = OscInvokeMethod;
