import React, { Component } from 'react';
import axios from 'axios';
import './Manage.css';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';
import PORT from '../../../config/config'


class EditUser extends Component {
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
      .post(`http://localhost:${PORT}/admin`, userData, { header: headers })
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
       <div className="wrapper">
        <Sidebar />
        <div className="main-content bg-light">
          <TopNavbar />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row pt-5 mt-3 mb-5">
                <h3 className="mb-4"> Edit User Information </h3>
                <form>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputState">Select Company</label>
                      <select id="inputState" className="form-control">
                        <option>Choose...</option>
                        <option>Public</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="form-group col-md-2" />
                  </div>
                  <h3 className="mb-4"> Personal Information </h3>
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

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Email</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Phone Number</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Landline </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="form-row mb-4">
                    <div className="form-check form-check-inline ml-4 mr-4 ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox1"
                        value="option1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox1"
                      >
                        Male
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox2"
                        value="option2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox2"
                      >
                        Female
                      </label>
                    </div>
                    <div className="form-group col-md-2" />
                  </div>
                  <h3 className="mb-4"> Bank Account Details </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Account Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Account Number</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Bank Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
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

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Email</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Phone Number</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Relationship </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <h3 className="mb-4"> Shares Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Number of Allocated Shares
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Allocation Date</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Vesting Date</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Corresponding Vesting Date
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Number of shares sold</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Number of shares Bought{' '}
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <h3 className="mb-4"> Shares Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Current Shares Values</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Number of shares collaterized
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Grade level/Category</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="form-row ">
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">Dividends</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2018</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2017 </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2016 </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2015 </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2014 </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="float-right p-2 btn c-btn-bg2"
                  >
                    Add{' '}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
     </div>
    </div>
    );
  }
}

export default EditUser;
