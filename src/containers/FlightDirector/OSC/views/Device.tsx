import React from "react";
import {useParams} from "react-router-dom";
import {
  Row,
  Col,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Button,
} from "reactstrap";

import {ViewContainer} from "./components";

const DeviceConfig: React.FC = () => {
  return (
    <div className="oscDevice oscCard">
      <CardBody>
        <CardTitle tag="h5">Card title</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Card subtitle
        </CardSubtitle>
        <CardText>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </CardText>
        <Button>Button</Button>
      </CardBody>
    </div>
  );
};

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

  if (!props.edit) {
    return <div>You are currently viewing a device: {props.id}</div>;
  }

  return (
    <ViewContainer title="Edit Device">
      <Row>
        <Col xs="8">
          <DeviceConfig />
        </Col>
        <Col xs="4"></Col>
      </Row>
    </ViewContainer>
  );
};

Device.defaultProps = {
  edit: false,
};
