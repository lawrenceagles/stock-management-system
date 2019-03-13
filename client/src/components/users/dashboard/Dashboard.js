import React, { Component } from 'react';
import './Dashboard.styles.css';
import axios from 'axios';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class UserDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companies: [],
      error: '',
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:7000/list')
      .then(res => {
        this.setState({ companies: res.data });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const { companies } = this.state;
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="main-content bg-light">
          <TopNavbar />
          <div className="content">
            <section className="m-4 ">
              <div className="row">
                <div className="col-lg-6 ">
                  <div
                    className="row custom-col"
                    style={{ marginBottom: '20px' }}
                  >
                    <div className="card-body ">
                      <h5 className="card-title mb-2">Interswitch Inc.</h5>
                      <h6 className="card-title ">Today</h6>
                      <h2 className="card-title mb-4">N 123.3</h2>
                      <a href="#" className="btn new-btn mr-2 mt-4">
                        Buy
                      </a>
                      <a href="#" className="btn new-btn2 mt-4">
                        Sell
                      </a>
                    </div>
                  </div>
                  <div className="row" style={{ width: '566px' }}>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card card-custom-body mb-4">
                        <div className="card-body">
                          <h6 className="card-subtitle p-2">
                            Total Allocated Shares
                          </h6>
                          <h4 className="card-title mb-2 text-muted">
                            1,234 Units
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 ml-auto">
                  <div className="card custom-chart mb-4">
                    <div className="card-body">
                      <h6 className="card-subtitle p-2">Shares Vested</h6>
                      <div id="circle" />
                      <h6 className="card-subtitle p-2">Date Alloted</h6>
                      <h4 className="card-title mb-2 text-muted">29/12/12</h4>
                      <h6 className="card-subtitle p-2">Date Alloted</h6>
                      <h4 className="card-title mb-2 text-muted">29/12/12</h4>
                      <h6 className="card-subtitle p-2">Date Alloted</h6>
                      <h4 className="card-title mb-2 text-muted">29/12/12</h4>
                    </div>
                  </div>
                  <a href="#" className="btn new-btn3 mt-4">
                    Download
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDashboard;
