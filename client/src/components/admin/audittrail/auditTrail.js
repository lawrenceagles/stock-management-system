import React, { Component } from 'react';
import './auditTrail.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';
import axios from 'axios';

class AuditTrail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audits: [],
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/audit')
      .then(res => {
        this.setState({ audits: res.data });
        console.log(res.data)
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  render() {
    const { audits } = this.state;
    return (
      <div className="wrapper">
        <Sidebar />

        <div className="main-content bg-light">
          <TopNavbar />
          <div className="content">
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-9 comp-info">
                    <div className="row pt-5 mb-5">
                      <div className="col-sm-3 ">
                        From
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Here"
                        />
                      </div>
                      <div className="col-sm-3 ">
                        To
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Here"
                        />
                      </div>
                      <div
                        className="col-sm-3"
                        style={{ marginTop: '22px', left: '340px' }}
                      >
                        <div>
                          <a href="/" className="c-btn-bg2 btn btn-primary">
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="container">
                <div className="row mb-5">
                  <div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
                    <div className="row">
                      <div className="col-12">
                        <h5 className="text-dark text-left mb-3">
                          Audit Trail
                        </h5>
                        <table className="table table-bordered bg-white text-center">
                          <thead>
                            <tr className="text-muted">
                              <th>S/N</th>
                              <th>Company Name</th>
                              <th>Admin Name</th>
                              <th>Action Taken</th>
                              <th>Date</th>
                              <th>Query</th>
                            </tr>
                          </thead>
                          <tbody>
                         {audits.map((audit, index) => (
                            <tr key={index}>
                              <th>{++index}</th>
                              <th>Vetiva Capital</th>
                              <th>{audit.createdBy}</th>
                              <th>{audit.action}</th>
                              <th>{audit.createdAt}</th>
                              <th>1200</th>
                            </tr>
                          ))}
                          </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end">
                            <li className="page-item disabled">
                              <a className="page-link" href="#" tabIndex="-1">
                                Previous
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                1
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                2
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                3
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="#">
                                Next
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default AuditTrail;
