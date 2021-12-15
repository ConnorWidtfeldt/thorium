import React, {useState} from "react";
import {MacroConfigProps} from "helpers/genericTypes";
import {Input, Label} from "reactstrap";

import {useDebounce} from "../../helpers/useDebounce";

import {
  OscDevice,
  OscMethod,
  useOscDevicesSubscription,
  useOscMethodArgsQuery,
  useOscMethodsQuery,
  useOscMethodValidationQuery,
} from "generated/graphql";

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
  onChange: (methodId?: string) => void;
}
const OscMethodSelection: React.FC<OscMethodSelectionProps> = props => {
  const {data} = useOscMethodsQuery({
    variables: {dictionary: props.dictionaryId},
  });
  const methods = (data?.oscMethods || []) as OscMethod[];

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
        {methods.map((method: OscMethod) => (
          <option value={method.id} key={method.id}>
            {method.name}
          </option>
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

  valid: boolean;
  feedback?: string;
}
const StringArg: React.FC<OscArgProps<string>> = props => (
  <div key={props.key}>
    <Label name={"arg_" + props.key} type="text">
      <span>{props.name}:</span>
      {props.feedback && (
        <span className="oscArgFeedback">{props.feedback}</span>
      )}
    </Label>
    <Input
      name={"arg_" + props.key}
      type="text"
      value={props.value || ""}
      invalid={!props.valid}
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
  enabled: boolean;
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

  const {data: validationData} = useOscMethodValidationQuery({
    variables: {
      id: props.methodId,
      args: props.args,
    },
  });
  const validation = validationData?.oscMethodValidation || {};

  if (!props.enabled) {
    return <h6>Select a device and method to continue</h6>;
  }

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
          valid: validation[arg.key] === true,
          feedback: validation[arg.key]?.message,
        }),
      )}
    </fieldset>
  );
};

const OscInvokeMethod: React.FC<MacroConfigProps> = ({updateArgs, args}) => {
  const [methodArgs, setMethodArgs] = useState<ArgValues>(
    args.methodArgs || {},
  );
  const updateArgsDebounce = useDebounce(updateArgs, 250);
  if (typeof args.methodArgs !== "object") {
    updateArgs("methodArgs", {});
  }

  return (
    <div className="oscConfig">
      <OscDeviceSelection
        deviceId={args.deviceId}
        onChange={(id, dictionary) => {
          updateArgs("deviceId", id);
        }}
      />
      <OscMethodSelection
        enabled={args.deviceId !== undefined}
        dictionaryId={"qlab"}
        methodId={args.methodId}
        onChange={id => {
          updateArgs("methodId", id);
        }}
      />

      <OscMethodArgs
        enabled={args.methodId !== undefined}
        methodId={args.methodId}
        args={methodArgs || {}}
        updateArgs={newArgs => {
          setMethodArgs({...newArgs});
          updateArgsDebounce("methodArgs", newArgs);
        }}
      />
    </div>
  );
};

export const oscInvokeMethod = OscInvokeMethod;
