import React, { Component } from 'react';
import axios from 'axios';
import './onboardAdmin.css';
import PORT from '../../../config/config';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class OnBoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email:'',
      employee_number:'',
      firstName:'',
      lastName:'',
      phone:'',
      otherNames:'',
      otherPhoneNumber:'',
      gender:'',
      accountName:'',
      accountNumber:'',
      bankName:'',
      grade_level:'',
      NextOfKinEmail:'',
      NextOfKinFirstName:'',
      NextOfKinlastName:'',
      NextOfKinRelationship:'',
      NextOfKinotherName:'',
      NextOfKinPhone:'',
      allocation_date:'',
      current_value_of_shares:'',
      number_of_shares_collaterised:'',    
      number_of_allocated_shares:'',
      number_of_shares_sold:'',
      number_of_vested_shares:'',
      dividend_received:'',
      success: false,
    };
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onboardUsers = e => {
    e.preventDefault();
    const { 
      email,
      employee_number,
      lastName,
      firstName,
      otherNames,
      phone,
      otherPhoneNumber,
      gender,
      accountName,
      accountNumber,
      bankName,
      grade_level,
      NextOfKinEmail,
      NextOfKinFirstName,
      NextOfKinlastName,
      NextOfKinRelationship,
      NextOfKinotherName,
      NextOfKinPhone,
      allocation_date,
      current_value_of_shares,
      number_of_shares_collaterised,
      number_of_allocated_shares,
      number_of_vested_shares,
      number_of_shares_sold,
      dividend_received
    } = this.state;

    const userData = {
      email,
      employee_number,
      firstName,
      lastName,
      phone,
      otherNames,
      otherPhoneNumber,
      gender,
      accountName,
      accountNumber,
      bankName,
      grade_level,
      NextOfKinEmail,
      allocation_date,
      NextOfKinFirstName,
      NextOfKinlastName,
      NextOfKinRelationship,
      NextOfKinotherName,
      number_of_vested_shares,
      NextOfKinPhone,
      current_value_of_shares,
      number_of_shares_collaterised,
      number_of_allocated_shares,
      number_of_shares_sold,
      dividend_received
    };

    const sample = {
      employee_number:"1223",
      phone:"09229223",
      email:"hilar@yahoo.com",
      lastName:"Hills",
      firstName:"Itachi",
      otherNames:"israel",
      password:"specail",
      otherPhoneNumber:"090303434",
      gender:"male",
      accountName:"212122121",
      accountNumber:"834727472",
      bankName:"zenith",
      grade_level:"senior",
      NextOfKinEmail:"sombody@gmail.com",
      NextOfKinfirstName:"gold",
      NextOfKinlastName:"joy",
      NextOfKinRelationship:"Brother",
      NextOfKinotherName:"samson",
      NextOfKinPhone:"6722623",
      number_of_allocated_shares:"3232",
      number_of_shares_collaterised:"4343",
      dividend_received:"4555",
      number_of_vested_shares:"323",
      number_of_shares_sold:"434",
      current_value_of_shares:"323",
      allocation_date:"3/2/2019",
      make_buy_request:true,
      make_sell_request:false     
}

    axios.post(`http://localhost:${PORT}/users`, userData,
       {
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then(response => { 
        console.log(response)
      })
      .catch(error => {
          console.log(error.response)
      });
  }
  render() {
    const {
      email,
      employee_number,
      lastName,
      otherNames,
      firstName,
      phone,
      otherPhoneNumber,
      gender,
      accountName,
      accountNumber,
      bankName,
      grade_level,
      NextOfKinEmail,
      allocation_date,
      NextOfKinFirstName,
      NextOfKinlastName,
      NextOfKinRelationship,
      NextOfKinotherName,
      NextOfKinPhone,
      current_value_of_shares,
      number_of_vested_shares,
      number_of_shares_collaterised,
      number_of_allocated_shares,
      number_of_shares_sold,
      dividend_received,
      success
    } = this.state;
    return (
      <section>
        <div className="container">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row pt-5 mt-3 mb-5">
                <h3 className="mb-4 col-" > Add User Information </h3>
                <form> 
                  <h3 className="mb-4"> Personal Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4" >First Name</label>
                      <input  onChange={this.onChange} id="firstName" value={firstName} className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Last Name</label>
                      <input type="text" id="lastName" onChange={this.onChange} value={lastName} className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Other Names</label>
                      <input type="text" id="otherNames" value={otherNames} onChange={this.onChange} className="form-control" />
                    </div>
                  </div>

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Email</label>
                      <input id="email" value={email} type="text" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4" >Phone Number</label>
                      <input type="text" id="phone" value={phone} className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Landline </label>
                      <input id="otherPhoneNumber" value={otherPhoneNumber} type="text" className="form-control" onChange={this.onChange} />
                    </div>
                  </div>
                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Employee Number</label>
                      <input id="employee_number"  value={employee_number} type="text" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4" >Number Of Vested Shares</label>
                      <input type="text" id="number_of_vested_shares" value={number_of_vested_shares} className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Number of Shares Sold </label>
                      <input id="number_of_shares_sold" value={number_of_shares_sold} type="text" className="form-control" onChange={this.onChange} />
                    </div>
                  </div>

                  <div className="form-row mb-4">
                    <div className="form-check form-check-inline ml-4 mr-4 ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="gender"
                        onChange={this.onChange}
                        value={gender}
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
                        id="gender"
                        onChange={this.onChange}
                        value={gender}
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
                      <input type="text" id='accountName' onChange={this.onChange} value={accountName}  className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Account Number</label>
                      <input type="text" id='accountNumber' onChange={this.onChange} value={accountNumber} className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Bank Name</label>
                      <input onChange={this.onChange} type="text" id='bankName' value={bankName} className="form-control" />
                    </div>
                  </div>
                
                  <h3 className="mb-4"> Next Of Kin Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">First Name</label>
                      <input id='NextOfKinFirstName' onChange={this.onChange} value={NextOfKinFirstName} type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Last Name</label>
                      <input type="text" className="form-control" onChange={this.onChange} id="NextOfKinlastName" value={NextOfKinlastName} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Other Names</label>
                      <input type="text" id='NextOfKinotherName' value={NextOfKinotherName} onChange={this.onChange} className="form-control" />
                    </div>
                  </div>

                  <div className="form-row ">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Email</label>
                      <input type="text" id='NextOfKinEmail' value={NextOfKinEmail} className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Phone Number</label>
                      <input type="text" id='NextOfKinPhone'  value={NextOfKinPhone} className="form-control" onChange={this.onChange} />
                  </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Relationship </label>
                      <input type="text" id='NextOfKinRelationship' value={NextOfKinRelationship} className="form-control" onChange={this.onChange} />
                    </div>
                  </div>

                  <h3 className="mb-4"> Shares Information </h3>
                  <div className="form-row mb-4">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Number of Allocated Shares
                      </label>
                      <input type="text" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Allocation Date</label>
                      <input onChange={this.onChange} type="text" id="allocation_date" value={allocation_date} className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Vesting Date</label>
                      <input type="text" onChange={this.onChange} className="form-control" />
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
                      <input id='current_value_of_shares' value={current_value_of_shares} onChange={this.onChange} type="text" className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">
                        Number of shares collaterized
                      </label>
                      <input value={number_of_shares_collaterised} id="number_of_shares_collaterised" type="text" onChange={this.onChange} className="form-control" />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputEmail4">Grade level/Category</label>
                      <input type="text" id="grade_level" value={grade_level}  className="form-control" onChange={this.onChange} />
                    </div>
                  </div>
                  incomplete

                  <div className="form-row ">
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmai./l4">Dividends</label>
                      <input type="text" className="form-control" onChange={this.onChange} />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2018</label>
                      <input type="text" id="dividend_received" onChange={this.onChange} value={dividend_received} className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2017 </label>
                      <input type="text" id="dividend_received" value={dividend_received} onChange={this.onChange} className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2016 </label>
                      <input type="text" id="dividend_received" value={dividend_received} onChange={this.onChange} className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2015 </label>
                      <input type="text" id="dividend_received" value={dividend_received} onChange={this.onChange} className="form-control" />
                    </div>
                    <div className="form-group col-md-2">
                      <label htmlFor="inputEmail4">2014 </label>
                      <input type="text" id="dividend_received" value={dividend_received} onChange={this.onChange} className="form-control" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="float-right p-2 btn c-btn-bg2"
                    onClick={this.onboardUsers}
                  >
                    OnBoardUser
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default OnBoardUser;
