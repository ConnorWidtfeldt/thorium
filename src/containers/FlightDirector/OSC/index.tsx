import React from "react";
import {Routes, Route, Link} from "react-router-dom";
import {Container, Nav, NavItem, NavLink} from "reactstrap";

import {Device, DeviceAdd, Devices, Dictionaries, Home} from "./views";

import "./style.scss";

const OSC: React.FC = () => {
  return (
    <Container className="oscAdmin my-4">
      <div className="mb-4">
        <h3>Open Sound Control</h3>
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink tag={Link} to="/config/osc">
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="devices">
            Devices
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="dictionaries">
            Dictionaries
          </NavLink>
        </NavItem>
      </Nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="devices" element={<Devices />} />
        <Route path="devices/add" element={<DeviceAdd />} />
        <Route path="devices/:id" element={<Device />} />
        <Route path="devices/:id/edit" element={<Device edit={true} />} />

        <Route path="dictionaries" element={<Dictionaries />} />
        <Route path="dictionaries/:id" element={<Dictionaries />} />
      </Routes>
    </Container>
  );
};

export default OSC;
