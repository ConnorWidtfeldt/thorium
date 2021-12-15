import React, {useState, useEffect} from "react";
import {Input, InputGroup, InputGroupText} from "reactstrap";
import {OscDeviceConfig} from "generated/graphql";

import {objectMap} from "helpers/objectMap";

type DeviceConfigForm = {
  [key in keyof Required<OscDeviceConfig>]: string;
};
type DeviceConfigFormValidity = {
  [key in keyof DeviceConfigForm]: boolean;
};

const ID_REGEX = new RegExp(/^[a-zA-Z0-9_-]+$/);
const IP_REGEX = new RegExp(
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
);
const HOSTNAME_REGEX = new RegExp(
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/,
);

const validator: {
  [key in keyof DeviceConfigForm]: (value: DeviceConfigForm[key]) => boolean;
} = {
  id(value) {
    return value.length === 0 || ID_REGEX.test(value);
  },
  name(value) {
    return value.length > 0;
  },
  host(value) {
    return IP_REGEX.test(value) || HOSTNAME_REGEX.test(value);
  },
  port(value) {
    if (Number.isNaN(Number(value))) return false;
    const num = parseInt(value);
    return num >= 0 && num <= 65535;
  },
};

const convertToId = (value: string) =>
  value
    .replace(" ", "-")
    .replace(/[^a-zA-Z0-9-_]/, "-")
    .toLowerCase();

const validate = (form: DeviceConfigForm) =>
  objectMap(validator, key =>
    validator[key](form[key]),
  ) as DeviceConfigFormValidity;

const convert = (form: DeviceConfigForm): OscDeviceConfig => ({
  ...form,
  id: form.id ? form.id : convertToId(form.name),
  port: Number.isNaN(Number(form.port)) ? 0 : parseInt(form.port),
});

interface DeviceConfigProps {
  config: OscDeviceConfig;
  onConfigChanged?: (device: OscDeviceConfig, valid: boolean) => void;
  disable?: {
    [key in keyof OscDeviceConfig]: boolean;
  };
}
export const DeviceConfig: React.FC<DeviceConfigProps> = props => {
  const [form, setForm] = useState<DeviceConfigForm>({
    id: props.config.id || "",
    name: props.config.name || "",
    host: props.config.host || "",
    port: props.config.port?.toString() || "",
  });
  const valid = validate(form);

  useEffect(() => {
    // determine if initial config is valid
    if (valid) {
      props.onConfigChanged?.(
        props.config,
        !Object.values(valid).includes(false),
      );
    }
  }, [valid, props]);

  const setProperty = (property: keyof DeviceConfigForm, value: string) => {
    const updatedForm = form;
    updatedForm[property] = value;
    setForm(updatedForm);
    const isValid = !Object.values(validate(updatedForm)).includes(false);
    props.onConfigChanged?.(convert(updatedForm), isValid);
  };

  return (
    <>
      <InputGroup>
        <InputGroupText>Name</InputGroupText>
        <Input
          type="text"
          value={form.name}
          invalid={!valid.name}
          disabled={props.disable?.name === true}
          autoFocus
          onChange={({target}) => setProperty("name", target.value)}
        />
      </InputGroup>
      <br />
      <InputGroup>
        <InputGroupText>ID</InputGroupText>
        <Input
          type="text"
          value={form.id}
          invalid={!valid.id}
          disabled={props.disable?.id === true}
          placeholder={convertToId(form.name)}
          onChange={({target}) => setProperty("id", target.value)}
        />
      </InputGroup>
      <br />
      <InputGroup>
        <InputGroupText>Host</InputGroupText>
        <Input
          type="text"
          value={form.host}
          invalid={!valid.host}
          disabled={props.disable?.host === true}
          onChange={({target}) => setProperty("host", target.value)}
        />
      </InputGroup>
      <br />
      <InputGroup>
        <InputGroupText>Port</InputGroupText>
        <Input
          type="number"
          value={form.port}
          invalid={!valid.port}
          disabled={props.disable?.port === true}
          onChange={({target}) => setProperty("port", target.value)}
        />
      </InputGroup>
    </>
  );
};
