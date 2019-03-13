import React, { Component } from 'react';
import axios from 'axios';
import './settings.css';
import { Tabs, Tab } from 'react-bootstrap';
import PersonalSettings from './PersonalSettings';
import NextOfKinSettings from './AdminSettings';
import BankSettings from './AdminSettings';
import PasswordSettings from './AdminSettings';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class UserSettings extends Component {
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
              <Tab eventKey="PersonalSettings" title="Personal">
                <PersonalSettings />
              </Tab>
              <Tab eventKey="NextOfKinSettings" title="Next Of Kin">
                <NextOfKinSettings />
              </Tab>
              <Tab eventKey="BankSettings" title="Bank Details">
                <BankSettings />
              </Tab>
              <Tab eventKey="PasswordSettings" title="Change Password">
                <PasswordSettings />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default UserSettings;
