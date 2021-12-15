import React from "react";
import {Routes, Route, NavLink as Link} from "react-router-dom";
import {Container, Nav, NavItem, NavLink} from "reactstrap";

import {Device, Devices, Dictionaries, Summary} from "./views";

import "./style.scss";

const OSC: React.FC = () => {
  return (
    <div className="osc">
      <Container className="my-4" fluid="xl">
        <div className="mb-4">
          <h3>Open Sound Control</h3>
        </div>

        <Nav tabs>
          <NavItem>
            <NavLink tag={Link} to="/config/osc" end>
              Summary
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
          <Route path="/" element={<Summary />} />

          <Route path="devices" element={<Devices />} />
          <Route path="devices/:id" element={<Device />} />
          <Route path="devices/:id/edit" element={<Device edit={true} />} />

          <Route path="dictionaries" element={<Dictionaries />} />
          <Route path="dictionaries/:id" element={<Dictionaries />} />
        </Routes>
      </Container>
    </div>
  );
};

export default OSC;
