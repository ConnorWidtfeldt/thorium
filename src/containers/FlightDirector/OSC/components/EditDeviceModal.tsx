import React, {useState, useEffect} from "react";
import {OscDeviceConfig, useOscDeviceQuery} from "generated/graphql";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Form,
} from "reactstrap";

import {DeviceConfig, LoadingPlaceholder} from ".";

interface EditDeviceModalProps {
  isOpen: boolean;
  deviceId: string;

  onCancel: () => void;
  onSave: (device: OscDeviceConfig) => void;
}
export const EditDeviceModal: React.FC<EditDeviceModalProps> = props => {
  const {data: deviceData, loading: deviceLoading} = useOscDeviceQuery({
    variables: {
      id: props.deviceId,
    },
  });

  const [config, setConfig] = useState<OscDeviceConfig>();
  const [canSave, setCanSave] = useState<boolean>(false);

  // reset on reopen
  useEffect(() => {
    if (props.isOpen) {
      setConfig(undefined);
    }
  }, [props.isOpen]);

  if (!config && !deviceLoading && deviceData?.oscDevice) {
    setConfig(deviceData.oscDevice);
  }

  const updateConfig = (config: OscDeviceConfig, valid: boolean) => {
    setConfig(config);
    setCanSave(valid);
  };
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (config) {
      props.onSave(config);
    }
  };

  return (
    <Modal isOpen={props.isOpen} className="osc">
      <Form onSubmit={handleSave}>
        <ModalHeader>Edit Device</ModalHeader>
        <ModalBody>
          {config ? (
            <DeviceConfig
              config={config}
              onConfigChanged={updateConfig}
              disable={{id: true}}
            />
          ) : (
            <LoadingPlaceholder />
          )}
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
