import React, { Component } from 'react';
import axios from 'axios';
import './settings.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class NextOfKinSettings extends Component {
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
    // const {
    //   email,
    //   username,
    //   firstname,
    //   lastname,
    //   role,
    //   phone,
    //   success,
    //   error,
    // } = this.state;
    return (
      <div className="content company-reg">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row ">
                <form>
                  <h3 className="mb-4"> Next Of Kin Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">First Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Last Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Other Names</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
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

export default NextOfSettings;
