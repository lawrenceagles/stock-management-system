import React, { Component } from 'react';
import axios from 'axios';
import './settings.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class PasswordSettings extends Component {
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
    return (
      <div className="content company-reg">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row ">
                <form>
                 
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Old Password</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">New Password</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">New Password Again</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="float-right p-2 btn c-btn-bg2"
                  >
                    Update{' '}
                  </button>
                  <button
                    type="submit"
                    className="float-right p-2 btn c-btn-bg2"
                  >
                    Update{' '}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordSettings;
