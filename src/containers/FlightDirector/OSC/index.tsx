import React from "react";
import { 
  Routes, Route, Link,
  useNavigate, useLocation } from "react-router-dom";
import {
  Container, Nav, NavItem, NavLink,
} from "reactstrap";

import {
  Device,
  DeviceAdd,
  Devices,
  Dictionaries,
  Home
} from "./views"


const OSC: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <div>
        <h3>Open Sound Control</h3>
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink
            tag={Link}
            to="/config/osc" exact
            activeClassName="active"
          >
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="devices"
            activeClassName="active"
          >
            Devices
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={Link}
            to="dictionaries"
            activeClassName="active"
          >
            Dictionaries
          </NavLink>
        </NavItem>
      </Nav>

      <Routes>
        <Route path="/" element={<Home/>} />

        <Route path="devices" element={<Devices />} />
        <Route path="devices/add" element={<DeviceAdd />} />
        <Route path="devices/:id" element={<Device />} />
        <Route path="devices/:id/edit" element={<Device edit={true}/>} />

        <Route path="dictionaries" element={<Dictionaries />} />
        <Route path="dictionaries/:id" element={<Dictionaries />} />
      </Routes>
    </Container>
  )
}

export default OSC;
