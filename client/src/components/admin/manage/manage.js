import React, { Component } from 'react';
import axios from 'axios';
import './Manage.css';
import { Tabs, Tab } from 'react-bootstrap';
import ManageAdmin   from './ManageAdmin';
import ManageCompany from './ManageCompany';
import ManageUser    from './ManageUser';
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
              defaultActiveKey="ManageCompany"
              id="uncontrolled-tab-example"
            >
              <Tab eventKey="ManageCompany" title="Manage Company">
                <ManageCompany />
              </Tab>
              <Tab eventKey="ManageUser" title="Manage Users">
                <ManageUser />
              </Tab>
              <Tab eventKey="ManageAdmin" title="Manage Admin">
                <ManageAdmin />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default Manage;
