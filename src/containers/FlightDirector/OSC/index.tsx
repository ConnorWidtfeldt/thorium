import React from "react";
import {Routes, Route, NavLink as Link, Navigate} from "react-router-dom";
import {Container, Nav, NavItem, NavLink} from "reactstrap";
import {Devices} from "./Devices";
import {Dictionaries} from "./Dictionaries";

import "./style.scss";

const OSC: React.FC = () => {
  return (
    <div className="osc">
      <Container className="my-4" fluid="xl">
        <div className="mb-4">
          <h3 className="oscTitle">Open Sound Control</h3>
        </div>

        <Nav tabs>
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
          <Route path="" element={<Navigate replace to="devices" />} />
          <Route path="devices" element={<Devices />} />
          <Route path="dictionaries" element={<Dictionaries />} />
          <Route path="dictionaries/:id" element={<Dictionaries />} />
        </Routes>
      </Container>
    </div>
  );
};

export default OSC;
