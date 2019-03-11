import React, { Component } from 'react';
import axios from 'axios';

class step1 extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    if (this.props.currentStep !== 1) {
      // Prop: The current step
      return null;
    }
    return (
      <div className="content company-reg">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row pt-5 mt-3 mb-5">
                <h3 className="mb-4"> Add Company Information </h3>
                <div className="form-row mb-4">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="companyName"
                      value={this.props.companyName}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputState">Company Type</label>
                    <select
                      value={this.props.type}
                      onChange={this.props.onChange}
                      id="type"
                      className="form-control"
                    >
                      <option>Choose...</option>
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div className="form-group col-md-2" />
                </div>

                <div className="form-row mb-4">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">
                      Total Number of Shares Allocated to Scheme
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="noOfShares"
                      value={this.props.noOfShares}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">
                      Total Number of Shares Allocated to Scheme Members
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="noOfAllocatedShares"
                      value={this.props.noOfAllocatedShares}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">
                      Total Number of Unallocated Shares In Scheme
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="noOfUnAllocatedShares"
                      value={this.props.noOfUnAllocatedShares}
                    />
                  </div>
                </div>

                <div className="form-row ">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">Total Scheme Members</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="noOfSchemeMembers"
                      value={this.props.noOfSchemeMembers}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">Allocation Date</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.props.onChange}
                      id="allocatedDate"
                      value={this.props.allocatedDate}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputState">Vesting Date/Schedule</label>
                    <select
                      value={this.props.vestingDate}
                      onChange={this.props.onChange}
                      id="vestingDate"
                      className="form-control"
                    >
                      <option>Choose...</option>
                      <option>Annually</option>
                      <option>Bi-Annually</option>
                      <option>Choose Date</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default step1;
