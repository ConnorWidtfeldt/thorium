import React, {useState, useEffect} from "react";
import {MacroConfigProps} from "helpers/genericTypes";
import {Input, Label, Button} from "reactstrap";
import {FaCheck, FaTimes} from "react-icons/fa";

import {
  useOscDevicesSubscription,
  useOscMethodsQuery,
  useOscMethodArgsQuery,
  useOscMethodValidationLazyQuery,
} from "generated/graphql";

interface ArgProps<T> {
  key: string;
  name: string;
  value?: T;
  onChange: (value: T) => void;

  valid: boolean;
  invalid: boolean;
  feedback?: string;
}
const StringArg: React.FC<ArgProps<string>> = props => (
  <div key={props.key}>
    <Label type="text" className="oscArgLabel">
      <span>{props.name}:</span>
      {props.feedback && (
        <span className="oscArgFeedback">{props.feedback}</span>
      )}
    </Label>
    <Input
      type="text"
      className="oscArgValue"
      value={props.value || ""}
      valid={props.valid}
      invalid={props.invalid}
      onChange={({target}) => props.onChange(target.value)}
    ></Input>
  </div>
);

const argComponent: {[key: string]: React.FC<ArgProps<any>>} = {
  string: StringArg,
};
interface ArgValues {
  [key: string]: any;
}

interface MethodArgsProps {
  methodId: string;
  args: ArgValues;
  updateArgs: (ags: ArgValues) => void;
}
const MethodArgs: React.FC<MethodArgsProps> = props => {
  const [values, setValues] = useState<ArgValues>({});

  const {data: methodArgsData} = useOscMethodArgsQuery({
    variables: {
      methodId: props.methodId,
    },
  });
  const methodArgs = methodArgsData?.oscMethodArgs ?? [];

  const [
    validate,
    {data: validationData, loading: validationLoading},
  ] = useOscMethodValidationLazyQuery();
  const validation = validationData?.oscMethodValidation || {};
  let isValid = true;
  for (const argValidation of Object.values(validation)) {
    if (argValidation !== true) isValid = false;
    break;
  }

  useEffect(() => {
    setValues(props.args);
    validate({
      variables: {
        id: props.methodId,
        args: props.args,
      },
    });
  }, [props.args, props.methodId, validate]);

  const handleSave = () => {
    props.updateArgs(values);
  };
  const handleReset = () => {
    props.updateArgs({});
  };

  const hasChanged = props.args !== values;
  const changedValues: any = {};
  for (const [argKey, argValue] of Object.entries(values)) {
    changedValues[argKey] = props.args[argKey] !== argValue;
  }

  const updateValue = (key: string, value: any) => {
    let newValues: any = {};
    newValues[key] = value;
    setValues({...values, ...newValues});
    validate({
      variables: {
        id: props.methodId,
        args: newValues,
      },
    });
  };

  const canSave = isValid && hasChanged && !validationLoading;

  return (
    <fieldset>
      <legend>
        <span>Arguments</span>
        <div className="oscLegendButtons">
          <Button
            className="oscLegendButton bg-success"
            disabled={!canSave}
            onClick={handleSave}
          >
            <FaCheck />
            Save
          </Button>
          <Button className="oscLegendButton bg-danger" onClick={handleReset}>
            <FaTimes />
            Reset
          </Button>
        </div>
      </legend>
      {methodArgs?.map(arg =>
        argComponent[arg.type]({
          key: arg.key,
          name: arg.name,
          value: values[arg.key],
          onChange: value => updateValue(arg.key, value),
          valid:
            !validationLoading &&
            validation[arg.key] === true &&
            changedValues[arg.key],
          invalid: !validationLoading && validation[arg.key] !== true,
          feedback: validation[arg.key]?.message,
        }),
      )}
    </fieldset>
  );
};

const OscInvokeMethod: React.FC<MacroConfigProps> = ({updateArgs, args}) => {
  const {data: devicesData} = useOscDevicesSubscription();
  const devices = devicesData?.oscDevices || [];
  const {data: dictionariesData} = useOscMethodsQuery();
  const dictionaries = dictionariesData?.oscDictionaries || [];

  return (
    <div className="oscConfig">
      <Label for="device">Device</Label>
      <Input
        name="device"
        type="select"
        value={args.deviceId || ""}
        onChange={({target}) => updateArgs("deviceId", target.value)}
      >
        <option disabled value="">
          Select a Device
        </option>
        {devices.map(device => (
          <option value={device.id} key={device.id}>
            {device.name}
          </option>
        ))}
      </Input>

      <Label for="method">Method</Label>
      <Input
        name="method"
        type="select"
        disabled={args.deviceId === undefined}
        value={args.methodId || ""}
        onChange={({target}) => updateArgs("methodId", target.value)}
      >
        <option disabled value="">
          Select a Method
        </option>
        {dictionaries.map(dictionary => (
          <optgroup label={dictionary.name} key={dictionary.id}>
            {dictionary.methods.map(method => (
              <option value={method.id} key={method.id}>
                {method.name}
              </option>
            ))}
          </optgroup>
        ))}
      </Input>

      {args.methodId && (
        <MethodArgs
          methodId={args.methodId}
          args={args.methodArgs || {}}
          updateArgs={newArgs => {
            updateArgs("methodArgs", newArgs);
          }}
        />
      )}
    </div>
  );
};

export const oscInvokeMethod = OscInvokeMethod;
