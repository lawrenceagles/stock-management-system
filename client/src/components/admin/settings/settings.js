import React, { Component } from 'react';
import axios from 'axios';
import './settings.css';
import { Tabs, Tab } from 'react-bootstrap';
import PersonalSettings   from './PersonalSettings';
import AdminSettings    from './AdminSettings';
import Sidebar       from '../templates/Sidebar';
import TopNavbar     from '../templates/TopNavbar';

class Settings extends Component {
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
              <Tab eventKey="PersonalSettings" title="Profile Settings">
                <PersonalSettings />
              </Tab>
              <Tab eventKey="AdminSettings" title="Admin Settings">
                <AdminSettings />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
