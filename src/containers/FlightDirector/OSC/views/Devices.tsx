import React, {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  CardSubtitle,
  ButtonGroup,
  Button,
  Col,
  Row,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "reactstrap";
import {
  useOscDevicesSubscription,
  useOscDeviceRemoveMutation,
} from "generated/graphql";

// import {
//   get
// } from "generated/graphql";

import {ViewContainer} from "./components/ViewContainer";

interface DeviceProps {
  id: string;
  name: string;
  dictionaryName: string;

  onEdit?: (id: string) => void;
  onCopy?: (id: string) => void;
  onDelete?: (id: string) => void;
}
const Device: React.FC<DeviceProps> = props => (
  <Card className="oscDeviceItem">
    <CardBody>
      <CardTitle tag="h4">{props.name}</CardTitle>
      <CardSubtitle className="mb-2 text-muted" tag="h5">
        {props.dictionaryName}
      </CardSubtitle>
    </CardBody>
    <CardFooter>
      <ButtonGroup className="oscDeviceActions">
        <Button color="success" onClick={() => props.onEdit?.(props.id)}>
          Edit
        </Button>
        <Button color="info" onClick={() => props.onCopy?.(props.id)}>
          Copy
        </Button>
        <Button color="danger" onClick={() => props.onDelete?.(props.id)}>
          Delete
        </Button>
      </ButtonGroup>
    </CardFooter>
  </Card>
);

interface DeleteModalProps extends ModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  onConfirm,
  onCancel,
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

  const devices =
    (useOscDevicesSubscription().data?.oscDevices as DeviceProps[]) || [];
  const [remove] = useOscDeviceRemoveMutation();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleEdit = useCallback(
    (deviceId: string) => {
      navigate(`${deviceId}/edit`);
    },
    [navigate],
  );

  const handleCopy = useCallback((deviceId: string) => {
    console.log("COPYING DEVICE!", deviceId);
  }, []);

  const handleDelete = useCallback((deviceId: string) => {
    setConfirmDelete(deviceId);
  }, []);
  const deleteDevice = (id: string) => {
    remove({variables: {id}});
  };

  const actions = [
    {
      text: "Add Device",
      color: "success",
      onClick: () => navigate("add"),
    },
  ];

  return (
    <>
      <ViewContainer title="Devices" actions={actions}>
        <Container>
          <Row mx="0">
            {devices.map(device => (
              <Col md="4" className="px-1 py-1" key={device.id}>
                <Device
                  {...device}
                  onEdit={handleEdit}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>

          {devices.length > 0 || (
            <h3 className="w-100 text-center my-4">
              No devices are configured
            </h3>
          )}
        </Container>
      </ViewContainer>
      <DeleteModal
        isOpen={confirmDelete !== null}
        onConfirm={() => {
          confirmDelete && deleteDevice(confirmDelete);
          setConfirmDelete(null);
        }}
        onCancel={() => {
          setConfirmDelete(null);
        }}
      />
    </>
  );
};
