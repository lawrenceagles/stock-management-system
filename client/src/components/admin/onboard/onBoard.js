import React, { Component } from 'react';
import axios from 'axios';
import './onboardAdmin.css';
import { Tabs, Tab } from 'react-bootstrap';
import OnBoardAdmin from './onboardAdmin';
import OnBoardCompany from './onboardCompany';
import OnBoardUser from './onboardUser';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class OnBoard extends Component {

  render() {
    return (
    <div className="wrapper">
        <Sidebar />
        <div className="main-content bg-light">
          <TopNavbar />
          <div className="content">
            <Tabs defaultActiveKey="Company" id="uncontrolled-tab-example">
              <Tab eventKey="Company" title="Company">
                <OnBoardCompany />
              </Tab>
              <Tab eventKey="Users" title="Users">
                <OnBoardUser />
              </Tab>
              <Tab eventKey="Admin" title="Admin">
                <OnBoardAdmin />
              </Tab>
            </Tabs>
          </div>
        </div>
    </div>
    );
  }
}

export default OnBoard;
