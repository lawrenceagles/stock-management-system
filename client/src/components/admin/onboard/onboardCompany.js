import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';

class onBoardCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyName: '',
      companyType: '',
      totalShares: '',
      totalAllocatedShares: '',
      totalUnallocatedShares: '',
      totalSchemeMembers: '',
      allocationDate: '',
      vestingDateSchedule: '',
      cash: false,
      bonus: false,
      share: '',
      bonus: '',
      currentShareValue: '',
      canBuy: false,
      canSell: false,
      totalSharesForfieted: '',
      collaterizedShares: false,
      purchasePrice: '',
      paymentPeriod: '',
      grade: '',
      level: '',
      schemeRules: '',
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
    const {
      companyName: '',
      companyType: '',
      totalShares: '',
      totalAllocatedShares: '',
      totalUnallocatedShares: '',
      totalSchemeMembers: '',
      allocationDate: '',
      vestingDateSchedule: '',
      cash: false,
      bonus: false,
      share: '',
      bonus: '',
      currentShareValue: '',
      canBuy: false,
      canSell: false,
      totalSharesForfieted: '',
      collaterizedShares: false,
      purchasePrice: '',
      paymentPeriod: '',
      grade: '',
      level: '',
      schemeRules: '',
    } = this.state;
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="main-content bg-light">
          <TopNavbar />
          <div className="content">
            <section>
              <div className="container ">
                <div className="row">
                  <div className="col-lg-9 ml-auto">
                    <div className="row pt-5 mt-3 mb-5">
                      <h3 className="mb-4"> Add Company Information </h3>
                      <form>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">Company Name</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputState">Company Type</label>
                            <select id="inputState" className="form-control">
                              <option selected>Choose...</option>
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
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Number of Shares Allocated to Scheme Members
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Number of Unallocated Shares In Scheme
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>

                        <div className="form-row ">
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Scheme Members
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">Allocation Date</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputState">
                              Vesting Date/Schedule
                            </label>
                            <select id="inputState" className="form-control">
                              <option selected>Choose...</option>
                              <option>Annually</option>
                              <option>Bi-Annually</option>
                              <option>Choose Date</option>
                            </select>
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
                              Cash
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
                              Bonus Shares
                            </label>
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">share</label>
                            <input type="text" className="form-control" />
                          </div>

                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Bonus Rate</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-2" />
                        </div>
                        <h3 className="mb-4"> Share Information </h3>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Current Share Value
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-4 mx-auto">
                            <label htmlFor="inputEmail4">
                              Allow scheme members to buy or sell:
                            </label>
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
                                Sell
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
                                Buy
                              </label>
                            </div>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Number of Shares forfeited
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>

                        <div className="form-row ">
                          <div className="form-group col-md-4 mx-auto">
                            <label htmlFor="inputEmail4">
                              Allow collaterized shares in scheme:
                            </label>
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
                                Yes/No
                              </label>
                            </div>
                            
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Purchase Price</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Payment Period</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Grade</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Level</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="form-group">
                          <h3 className="mb-4"> Scheme Rules </h3>
                          <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            rows="15"
                          />
                        </div>
                        <button
                          type="submit"
                          className="float-right p-2 btn c-btn-bg2"
                        >
                          Next{' '}
                        </button>
                      </form>
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

export default onBoardCompany;
