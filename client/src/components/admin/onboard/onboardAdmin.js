import React, { Component } from 'react';
import axios from 'axios';
import './onboardAdmin.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class OnBoardAdmin extends Component {
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
      .post('http://localhost:7000/admin', userData, { header: headers })
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

          <div className="content admin-content  mt-2">
            <div className="container ">
              <div className="row">
                <div className="col-lg-9 ml-auto">
                  {success && (
                    <div className="alert alert-success" role="alert">
                      OnboardAdmin Successful
                    </div>
                  )}
                  <div className="row pt-5 mt-3">
                    <h3 className="mb-4"> Add Information </h3>
                    <form onSubmit={this.onboardAdmin}>
                      <div className="form-row mb-4">
                        <div className="form-group col-md-4">
                          <label htmlFor="inputEmail4">First Name</label>
                          <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            error={error}
                            onChange={this.onChange}
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="inputEmail4">Last Name</label>
                          <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            error={error}
                            onChange={this.onChange}
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="inputEmail4">Username</label>
                          <input
                            type="text"
                            id="username"
                            value={username}
                            error={error}
                            onChange={this.onChange}
                            required
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-row mb-4">
                        <div className="form-group col-md-6">
                          <label htmlFor="inputEmail4">Email</label>
                          <input
                            type="text"
                            id="email"
                            value={email}
                            error={error}
                            onChange={this.onChange}
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label htmlFor="inputEmail4">Phone Number</label>
                          <input
                            type="text"
                            id="phone"
                            value={phone}
                            error={error}
                            onChange={this.onChange}
                            required
                            placeholder="+234-918-233-2551"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-row ">
                        <div className="form-group col-md-4">
                          <label htmlFor="inputState">Role</label>
                          <select
                            value={role}
                            onChange={this.onChange}
                            id="role"
                            className="form-control"
                          >
                            <option>Choose...</option>
                            <option value="manager">Manager</option>
                            <option value="editor">Editor</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="float-right p-2 btn c-btn-bg2 mb-4"
                      >
                        Add{' '}
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

export default OnBoardAdmin;
