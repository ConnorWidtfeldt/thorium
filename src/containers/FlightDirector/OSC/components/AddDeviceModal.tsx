import React, {useState, useEffect} from "react";
import {OscDevice, OscDeviceConfig} from "generated/graphql";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Form,
} from "reactstrap";

import {DeviceConfig} from ".";

interface AddDeviceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (device: OscDevice) => void;
}
const defaultConfig: OscDeviceConfig = {
  name: "New Device",
  host: "127.0.0.1",
  port: 9001,
};
export const AddDeviceModal: React.FC<AddDeviceModalProps> = props => {
  const [config, setConfig] = useState<OscDeviceConfig>(defaultConfig);
  const [canSave, setCanSave] = useState<boolean>(false);

  const updateConfig = (config: OscDeviceConfig, valid: boolean) => {
    setConfig(config);
    setCanSave(valid);
  };
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    props.onSave(config as OscDevice);
    setConfig(defaultConfig);
  };

  // reset on reopen
  useEffect(() => {
    if (props.isOpen) {
      setConfig(defaultConfig);
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} className="osc">
      <Form onSubmit={handleSave}>
        <ModalHeader>Add Device</ModalHeader>
        <ModalBody>
          <DeviceConfig config={config} onConfigChanged={updateConfig} />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              props.onCancel();
            }}
          >
            Cancel
          </Button>
          <Button color="success" type="submit" disabled={!canSave}>
            Save
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
