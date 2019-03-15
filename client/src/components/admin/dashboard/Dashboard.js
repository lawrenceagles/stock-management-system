import React, { Component } from 'react';
import './Dashboard.styles.css';
import axios from 'axios';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';
import PORT from '../../../config/config'


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companies: [],
      error: '',
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:${PORT}/list`)
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
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-lg-9 comp-info">
                    <div className="row pt-5 mt-3 mb-5">
                      <div className="col-sm-3 ">
                        <div className="card c1">
                          <div className="card-body">
                            <div className="text-center">
                              <h6>Total Number of companies</h6>
                              <h3>{companies.length}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 ">
                        <div className="card c2">
                          <div className="card-body">
                            <div className="text-center">
                              <h6>Total Scheme Members</h6>
                              <h3>3435</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 ">
                        <div
                          className="card c3"
                          style={{ borderLeft: '4px solid green' }}
                        >
                          <div className="card-body">
                            <div className="text-center">
                              <h6>Total Number of Shares</h6>
                              <h3>39,393</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 ">
                        <div
                          className="card c4"
                          style={{ borderLeft: '4px solid red' }}
                        >
                          <div className="card-body">
                            <div className="text-center">
                              <h6>Total Number of Alloted Shares </h6>
                              <h3>1,239</h3>
                            </div>
                          </div>
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
                          All Companies
                        </h5>
                        <table className="table table-bordered bg-white text-center">
                          <thead>
                            <tr className="text-muted">
                              <th>S/N</th>
                              <th>Company Name</th>
                              <th>Company Type</th>
                              <th>Total Shares</th>
                              <th>Total Allocated Shares</th>
                              <th>Total Scheme Members</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies.map((company, index) => (
                              <tr key={index}>
                                <th>{++index}</th>
                                <th>{company.name}</th>
                                <th>{company.type}</th>
                                <th>{company.totalSharesAllotedToScheme}</th>
                                <th>
                                  {company.totalSharesAllotedToSchemeMembers}
                                </th>
                                <th>{company.totalSchemeMembers}</th>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <nav aria-label="Page navigation example">
                          <ul className="pagination justify-content-end">
                            <li className="page-item disabled">
                              <a className="page-link" href="/" tabIndex="-1">
                                Previous
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="/">
                                1
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="/">
                                2
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="/">
                                3
                              </a>
                            </li>
                            <li className="page-item">
                              <a className="page-link" href="/">
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

export default Dashboard;
