import React, { Component } from 'react';
import './Manage.css';
import axios from 'axios';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class SchemeMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companies: [],
      error: '',
    };
  }

  componentDidMount() {
    // const header = {
    //   'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzgxMGViMzcxYjU4MjY4YzNhNTdlMWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTUxOTYxNzc5fQ.2xIyEsLyJaMwXrQ3e3vFNow8L1K1mDwEPvU4HDAaDUw',
    // };

    axios
      .get('http://localhost:8000/list')
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
                         <div className="row pt-5 mb-5">                
                               <div className="form-group col-md-3">
                                <label for="inputState">Sort</label>
                                  <select id="inputState" className="form-control">
                                    <option></option>
                                    <option>Ascending</option>
                                    <option>Descending</option>
                                  </select>
                            </div>
                            <div className="col-sm-3" style={{marginTop: "22px", left: "340px"}}>
                                   <div>
                                     <a href="#" className="c-btn-bg2 btn btn-primary">Message</a>
                                   </div>
                             </div>
                             <div className="col-sm-3" style={{marginTop: "22px", left: "340px"}}>
                                   <div>
                                     <a href="#" className="c-btn-bg2 btn btn-primary">Download</a>
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
                               List of Scheme Members
                            </h5>
                            <table className="table table-bordered bg-white text-center">
                                <thead>
                                    <tr className="text-muted">
                                        <th>S/N</th>
                                        <th>Name</th>
                                        <th>No. Of Allocated Shares</th>
                                        <th>Allocation Date</th>
                                        <th>Number of vested shares</th>
                                        <th>Next Vesting Date</th>
                                        <th>Grade Level / Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                     <tr>
                                        <th>1</th>
                                        <th>Vetiva Capital</th>
                                        <th>Private</th>
                                        <th>123,044</th>
                                        <th>23,494</th>
                                        <th>1200</th>
                                        <th>1200</th>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <th>Interswitch</th>
                                        <th>Private</th>
                                        <th>123,044</th>
                                        <th>23,494</th>
                                        <th>1200</th>
                                        <th>1200</th>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <th>Widget Corp</th>
                                        <th>Public</th>
                                        <th>43,044</th>
                                        <th>23,494</th>
                                        <th>1100</th>
                                        <th>1100</th>
                                    </tr>
                                    <tr>
                                        <th>4</th>
                                        <th>Grayson Global</th>
                                        <th>Private</th>
                                        <th>123,044</th>
                                        <th>23,494</th>
                                        <th>1200</th>
                                        <th>1200</th>
                                    </tr>
                                    <tr>
                                        <th>5</th>
                                        <th>Johnson Capital</th>
                                        <th>Public</th>
                                        <th>123,044</th>
                                        <th>23,494</th>
                                        <th>1200</th>
                                        <th>1200</th>
                                    </tr>
                                </tbody>
                            </table>
                            <nav aria-label="Page navigation example">
                              <ul className="pagination justify-content-end">
                                <li className="page-item disabled">
                                  <a className="page-link" href="#" tabindex="-1">Previous</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item"><a className="page-link" href="#">2</a></li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                  <a className="page-link" href="#">Next</a>
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

export default SchemeMembers;
