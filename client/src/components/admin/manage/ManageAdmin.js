import React, { Component } from 'react';
import axios from 'axios';
import './Manage.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class ManageAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: '',
      phone: '',
      username: '',
      firstname: '',
      lastname: '',
      role: '',
      success: false,
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onboardAdmin = e => {
    e.preventDefault();
    const { firstname, lastname, username, email, phone, role } = this.state;

    const userData = {
      firstname,
      lastname,
      username,
      email,
      phone,
      role,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    axios
      .post('http://localhost:8000/admin', userData, { header: headers })
      .then(res => {
        this.setState({ success: true });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const {
      email,
      username,
      firstname,
      lastname,
      role,
      phone,
      success,
      error,
    } = this.state;
    return (
      <div className="content company-reg">
        <div className="container ">
          <div className="row cusRow">
            <div className="col-lg-3 form-group cus-info">
              <div>
                <label htmlFor="inputState">Role</label>
                <select id="inputState" className="form-control">
                  <option selected>Choose...</option>
                  <option>Manager</option>
                  <option>Super Admin</option>
                  <option>Editor</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3 ml-4 form-group">
              <div style={{ marginTop: '30px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Here"
                />
              </div>
            </div>
            <div
              className="col-lg-3 ml-4"
              style={{ marginTop: '30px', left: '75px' }}
            >
              <div>
                <a href="#" className="c-btn-bg2 btn btn-primary">
                  Add Admin
                </a>
              </div>
            </div>
          </div>

          <div className="row cusRow">
            <div className="col-lg-3 cus-info">
              <div className="card" style={{ width: '18rem' }}>
                <img
                  className="card-img-top img-circle"
                  src="/images/profile.png"
                  alt="Card image cap"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Johnson Pope</h5>
                  <h5 className="card-title">Super Admin</h5>
                  <a href="#" className="c-btn-bg2 btn btn-primary">
                    Manage
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 ml-4">
              <div className="card" style={{ width: '18rem' }}>
                <img
                  className="card-img-top img-circle"
                  src="/images/profile.png"
                  alt="Card image cap"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Johnson Pope</h5>
                  <h5 className="card-title">Super Admin</h5>
                  <a href="#" className="c-btn-bg2 btn btn-primary">
                    Manage
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 ml-4 mb-4">
              <div className="card" style={{ width: '18rem' }}>
                <img
                  className="card-img-top img-circle"
                  src="/images/profile.png"
                  alt="Card image cap"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">Johnson Pope</h5>
                  <h5 className="card-title">Super Admin</h5>
                  <a href="#" className="c-btn-bg2 btn btn-primary">
                    Manage
                  </a>
                </div>
              </div>
            </div>
          </div>
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
    );
  }
}

export default ManageAdmin;
