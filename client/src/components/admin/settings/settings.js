import React, { Component } from 'react';
import axios from 'axios';
import './Manage.css';
import { Tabs, Tab } from 'react-bootstrap';
import PersonalSettings   from './PersonalSettings';
import AdminSettings    from './AdminSettings';
import Sidebar       from '../templates/Sidebar';
import TopNavbar     from '../templates/TopNavbar';

class Manage extends Component {
  render() {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="main-content bg-light">
          <TopNavbar />
          <div className="content">
            <Tabs
              defaultActiveKey="PersonalSettings"
              id="uncontrolled-tab-example"
            >
              <Tab eventKey="PersonalSettings" title="Manage Company">
                <PersonalSettings />
              </Tab>
              <Tab eventKey="AdminSettings" title="Manage Admin">
                <AdminSettings />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default Manage;
