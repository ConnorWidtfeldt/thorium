import React, {useState} from "react";
import {
  CardBody,
  CardFooter,
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "reactstrap";
import {
  OscDevice,
  OscDeviceConfig,
  useOscDevicesSubscription,
  useOscDeviceAddMutation,
  useOscDeviceDeleteMutation,
  useOscDeviceEditMutation,
} from "generated/graphql";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import {ViewContainer, AddDeviceModal, EditDeviceModal} from "./components";

interface DeviceItemProps {
  device: OscDevice;
  style: React.CSSProperties;

  onEdit?: () => void;
  onDelete?: () => void;
}
const DeviceItem: React.FC<DeviceItemProps> = props => (
  <div className="oscDeviceItem oscCard" style={props.style}>
    <CardBody className="oscDeviceItemBody">
      <span className="oscDeviceName">{props.device.name}</span>
      <span className="oscDeviceId">{props.device.id}</span>
      <span className="oscDeviceAddress">
        {props.device.host}:{props.device.port}
      </span>
    </CardBody>
    <CardFooter>
      <ButtonGroup className="oscDeviceActions">
        <Button color="success" onClick={props.onEdit}>
          Edit
        </Button>
        <Button color="danger" onClick={props.onDelete}>
          Delete
        </Button>
      </ButtonGroup>
    </CardFooter>
  </div>
);

interface DeleteModalProps extends ModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

interface AddResult {
  id: string;
  name: string;
  dictionaryId: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onCancel,
  onConfirm,
  ...modalProps
}) => (
  <Modal {...modalProps}>
    <ModalHeader>Confirm Deletion</ModalHeader>
    <ModalBody>Are you sure you want to delete this device?</ModalBody>
    <ModalFooter>
      <Button color="danger" onClick={onConfirm}>
        Delete
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </ModalFooter>
  </Modal>
);

enum DeviceAction {
  Add = "add",
  Delete = "delete",
  Edit = "edit",
}
interface ActionState {
  action?: DeviceAction;
  device?: string;
}

export const Devices: React.FC = () => {
  const {
    data: devicesData,
    loading: devicesLoading,
  } = useOscDevicesSubscription();
  const devices = devicesData?.oscDevices || [];

  const [addDevice] = useOscDeviceAddMutation();
  const [deleteDevice] = useOscDeviceDeleteMutation();
  const [editDevice] = useOscDeviceEditMutation();

  const [actionState, setActionState] = useState<ActionState>({});
  const setAction = (action?: DeviceAction, device?: string) =>
    setActionState({action, device});

  const actions = [
    {
      text: "Add Device",
      color: "success",
      onClick: () => setAction(DeviceAction.Add),
    },
  ];

  const deviceItems = () => {
    return devices.map((device, index) => (
      <CSSTransition
        key={device.id}
        timeout={300 + index * 100}
        classNames="oscListItem"
      >
        <DeviceItem
          device={device}
          style={{transitionDelay: `${index * 100}ms`}}
          onDelete={() => setAction(DeviceAction.Delete, device.id)}
          onEdit={() => setAction(DeviceAction.Edit, device.id)}
        />
      </CSSTransition>
    ));
  };

  return (
    <>
      <ViewContainer title="Devices" actions={actions}>
        <TransitionGroup className="oscDevices">
          {deviceItems()}
        </TransitionGroup>

        {devicesLoading || devices.length > 0 || (
          <h3 className="w-100 text-center my-4">No devices are configured</h3>
        )}
      </ViewContainer>

      <AddDeviceModal
        isOpen={actionState.action === DeviceAction.Add}
        onCancel={() => setAction()}
        onSave={(device: OscDevice) => {
          addDevice({
            variables: {
              device,
            },
          }).then(() => {
            setAction();
          });
        }}
      />

      <DeleteModal
        isOpen={actionState?.action === DeviceAction.Delete}
        onCancel={() => setAction()}
        onConfirm={() => {
          deleteDevice({
            variables: {
              id: actionState.device!,
            },
          }).then(() => {
            setAction();
          });
        }}
      />

      <EditDeviceModal
        deviceId={actionState.device ?? ""}
        isOpen={actionState.action === DeviceAction.Edit}
        onCancel={() => setAction()}
        onSave={(config: OscDeviceConfig) => {
          console.log(actionState.device, config);
          editDevice({
            variables: {
              id: actionState.device!,
              config,
            },
          }).then(() => {
            setAction();
          });
        }}
      />
    </>
  );
};
