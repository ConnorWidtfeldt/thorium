import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  CardBody,
  CardFooter,
  CardTitle,
  CardSubtitle,
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import {
  useOscDevicesSubscription,
  useOscDeviceLazyQuery,
  useOscDeviceCreateMutation,
  useOscDeviceRemoveMutation,
  useOscDeviceDuplicateMutation,
  useOscDictionariesSubscription,
} from "generated/graphql";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import {ViewContainer} from "./components";

interface DeviceType {
  id: string;
  name: string;
  dictionary?: {
    id: string;
    name: string;
    description?: string;
  };
}

interface DeviceItemProps {
  device: DeviceType;
  style: React.CSSProperties;

  onEdit?: () => void;
  onCopy?: (id: string) => void;
  onDelete?: () => void;
}
const DeviceItem: React.FC<DeviceItemProps> = props => (
  <div className="oscDeviceItem oscCard" style={props.style}>
    <CardBody>
      <CardTitle tag="h4">{props.device.name}</CardTitle>
      <CardSubtitle className="mb-2 text-muted" tag="h5">
        {props.device.dictionary?.name}
      </CardSubtitle>
    </CardBody>
    <CardFooter>
      <ButtonGroup className="oscDeviceActions">
        <Button color="success" onClick={props.onEdit}>
          Edit
        </Button>
        <Button color="info" onClick={() => props.onCopy?.(props.device.id)}>
          Copy
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
  name: string;
  dictionaryId: string;
}
interface AddModalProps extends ModalProps {
  onCancel: () => void;
  onSave: (result: AddResult) => void;
  copy?: string;
  title: string;
}
const AddModal: React.FC<AddModalProps> = ({
  onCancel,
  onSave,
  copy,
  title,
  ...modalProps
}) => {
  const isCopying = copy !== undefined;

  const [
    getDevice,
    {data: copyCeviceData, loading: copyDeviceLoading},
  ] = useOscDeviceLazyQuery();
  const copyDevice = copyCeviceData?.oscDevice;

  const {
    data: dictionariesData,
    loading: dictionariesLoading,
  } = useOscDictionariesSubscription();
  const dictionaries = dictionariesData?.oscDictionaries;

  const [name, setName] = useState<string | undefined>();
  const [dictionaryId, setDictionaryId] = useState<string | undefined>();

  if (isCopying) {
    // lazy request the parent device that is being copied
    if (copyCeviceData == null && !copyDeviceLoading) {
      getDevice({variables: {id: copy!}});
    }
    // use original device name with copy appended if one isn't set
    if (!name && copyDevice?.name) {
      setName(copyDevice.name + " Copy");
    }
  } else {
    if (!dictionariesLoading && !dictionaryId) {
      setDictionaryId(dictionaries?.[0].id);
    }
  }

  const canSave = name?.length && dictionaryId;
  const handleSave = () => {
    onSave({name: name!, dictionaryId: dictionaryId!});
  };

  return (
    <Modal {...modalProps}>
      <ModalHeader>{title}</ModalHeader>

      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              name="name"
              type="text"
              value={name ?? ""}
              onChange={({target}) => setName(target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="dictionary">Dictionary</Label>
            <Input
              name="dictionary"
              type="select"
              disabled={isCopying}
              onChange={({target}) => setDictionaryId(target.value)}
            >
              {dictionaries?.map(dictionary => (
                <option value={dictionary.id!} key={dictionary.id}>
                  {dictionary.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="success" disabled={!canSave} onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

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

export const Devices: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: devicesData,
    loading: devicesLoading,
  } = useOscDevicesSubscription();

  const devices = (devicesData?.oscDevices as DeviceType[]) || [];
  const [removeDevice] = useOscDeviceRemoveMutation();
  const [createDevice] = useOscDeviceCreateMutation();
  const [duplicateDevice] = useOscDeviceDuplicateMutation();

  const [deleteDevice, setDeleteDevice] = useState<string | null>(null);
  const [copyDevice, setCopyDevice] = useState<string | null>(null);

  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);

  const actions = [
    {
      text: "Add Device",
      color: "success",
      onClick: () => setIsAddingDevice(true),
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
          onEdit={() => navigate(`${device.id}/edit`)}
          onCopy={() => setCopyDevice(device.id)}
          onDelete={() => setDeleteDevice(device.id)}
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

      <AddModal
        title="Add New Device"
        isOpen={isAddingDevice}
        onCancel={() => {
          setIsAddingDevice(false);
        }}
        onSave={newDevice => {
          createDevice({
            variables: {
              device: {
                name: newDevice.name,
                dictionary: newDevice.dictionaryId,
              },
            },
          });
          setIsAddingDevice(false);
        }}
      />
      <AddModal
        title="Copy Existing Device"
        isOpen={copyDevice !== null}
        copy={copyDevice ?? undefined}
        onCancel={() => {
          setCopyDevice(null);
        }}
        onSave={newDevice => {
          duplicateDevice({
            variables: {
              name: newDevice.name,
              original: copyDevice!,
            },
          });
          setCopyDevice(null);
        }}
      />
      <DeleteModal
        isOpen={deleteDevice !== null}
        onCancel={() => {
          setDeleteDevice(null);
        }}
        onConfirm={() => {
          removeDevice({
            variables: {
              id: deleteDevice!,
            },
          });
          setDeleteDevice(null);
        }}
      />
    </>
  );
};
