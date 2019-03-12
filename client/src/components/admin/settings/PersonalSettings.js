import React, { Component } from 'react';
import axios from 'axios';
import './settings.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class PersonalSettings extends Component {
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
                  <div className="form-row mb-4 text-center">
                    <img
                      className="card-img-top img-circle"
                      src="/images/profile.png"
                      alt="Card image cap"
                    />
                  </div>

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
                      <label htmlFor="inputEmail4">Username</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Email</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Phone No</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputState">Sex</label>
                      <select id="inputState" className="form-control">
                        <option selected>Choose...</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
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

export default PersonalSettings;
