import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from '../templates/Sidebar';
import TopNavbar from '../templates/TopNavbar';
import PORT from '../../../config/config'


class OnBoardCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      type: '',
      totalSharesAllotedToScheme: '',
      totalSharesAllotedToSchemeMembers: '',
      totalUnallocatedShares: '',
      totalSchemeMembers: '',
      dateOfAllocation: '',
      vestingDate: '',
      dividendTypeCash: false,
      bonus: false,
      dividendTypeShare: '',
      dividendRatePerShares: '',
      currentShareValuation: '',
      canBuyShares: false,
      canSellShares: false,
      totalSharesForfieted: '',
      canCollateriseShares: false,
      purchasePrice: '',
      paymentPeriod: '',
      grade: '',
      level: '',
      schemeRules: '',
      success: false,
      error: '',
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onBoardCompany = e => {
    e.preventDefault();
    const {
      name,
      type,
      totalSharesAllotedToScheme,
      totalSharesAllotedToSchemeMembers,
      totalUnallocatedShares,
      totalSchemeMembers,
      dateOfAllocation,
      vestingDate,
      dividendTypeCash,
      bonus,
      dividendTypeShare,
      dividendRatePerShares,
      currentShareValuation,
      canBuyShares,
      canSellShares,
      totalSharesForfieted,
      canCollateriseShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
    } = this.state;

    const companyData = {
      name,
      type,
      totalSharesAllotedToScheme,
      totalSharesAllotedToSchemeMembers,
      totalUnallocatedShares,
      totalSchemeMembers,
      dateOfAllocation,
      vestingDate,
      dividendTypeCash,
      bonus,
      dividendTypeShare,
      dividendRatePerShares,
      currentShareValuation,
      canBuyShares,
      canSellShares,
      totalSharesForfieted,
      canCollateriseShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
    };

    axios.post(`http://localhost:${PORT}/registration`, companyData)
      .then(res => {
        this.setState({ 
          success: true,
          res
         });
      })
      .catch(error => {
       console.log(error) 
      });
  };

  render() {
    const {
      name,
      type,
      totalSharesAllotedToScheme,
      totalSharesAllotedToSchemeMembers,
      totalUnallocatedShares,
      totalSchemeMembers,
      dateOfAllocation,
      vestingDate,
      dividendTypeCash,
      bonus,
      dividendTypeShare,
      dividendRatePerShares,
      currentShareValuation,
      canBuyShares,
      canSellShares,
      totalSharesForfieted,
      canCollateriseShares,
      purchasePrice,
      paymentPeriod,
      grade,
      level,
      schemeRules,
      success,
      error,
    } = this.state;
    return (
      
          <div className="content">
            <section>
              <div className="container ">
                <div className="row">
                  <div className="col-lg-9 ml-auto">
                    {success && (
                      <div className="alert alert-success" role="alert">
                        Company Onboarding Successful
                      </div>
                    )}
                    <div className="row pt-5 mt-3 mb-5">
                      <h3 className="mb-4"> Add Company Information </h3>
                      <form onSubmit={this.onBoardCompany}>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-6">
                            <label htmlFor="inputEmail4">Company Name</label>
                            <input
                              type="text"
                              id="name"
                              value={name}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputState">Company Type</label>
                            <select
                              id="type"
                              value={type}
                              onChange={this.onChange}
                              className="form-control"
                            >
                              <option>Choose...</option>
                              <option value="public">Public</option>
                              <option value="private">Private</option>
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
                              id="totalSharesAllotedToScheme"
                              value={totalSharesAllotedToScheme}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Number of Shares Allocated to Scheme Members
                            </label>
                            <input
                              type="text"
                              id="totalSharesAllotedToSchemeMembers"
                              value={totalSharesAllotedToSchemeMembers}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Number of Unallocated Shares In Scheme
                            </label>
                            <input
                              type="text"
                              id="totalUnallocatedShares"
                              value={totalUnallocatedShares}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="form-row ">
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Total Scheme Members
                            </label>
                            <input
                              type="text"
                              id="totalSchemeMembers"
                              value={totalSchemeMembers}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">Allocation Date</label>
                            <input
                              type="text"
                              id="dateOfAllocation"
                              value={dateOfAllocation}
                              error={error}
                              onChange={this.onChange}
                              required
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="inputState">
                              Vesting Date/Schedule
                            </label>
                            <select
                              value={vestingDate}
                              onChange={this.onChange}
                              id="vestingDate"
                              className="form-control"
                            >
                              <option>Choose...</option>
                              <option value="Annually">Annually</option>
                              <option value="Bi-Annually">Bi-Annually</option>
                              <option>Choose Date</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-row mb-4">
                          <div className="form-check form-check-inline ml-4 mr-4 ">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={dividendTypeCash}
                              onChange={this.onChange}
                              id="dividendTypeCash"
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
                              value={bonus}
                              onChange={this.onChange}
                              id="bonus"
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
                            <input
                              type="text"
                              value={dividendTypeShare}
                              onChange={this.onChange}
                              id="dividendTypeShare"
                              className="form-control"
                            />
                          </div>

                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Bonus Rate</label>
                            <input
                              type="text"
                              value={dividendRatePerShares}
                              onChange={this.onChange}
                              id="dividendRatePerShares"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-2" />
                        </div>
                        <h3 className="mb-4"> Share Information </h3>
                        <div className="form-row mb-4">
                          <div className="form-group col-md-4">
                            <label htmlFor="inputEmail4">
                              Current Share Value
                            </label>
                            <input
                              type="text"
                              value={currentShareValuation}
                              onChange={this.onChange}
                              id="currentShareValuation"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-4 mx-auto">
                            <label htmlFor="inputEmail4">
                              Allow scheme members to buy or sell:
                            </label>
                            <div className="form-check form-check-inline ml-4 mr-4 ">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={canSellShares}
                                onChange={this.onChange}
                                id="canSellShares"
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
                                value={canBuyShares}
                                onChange={this.onChange}
                                id="canBuyShares"
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
                            <input
                              type="text"
                              value={totalSharesForfieted}
                              onChange={this.onChange}
                              id="totalSharesForfieted"
                              className="form-control"
                            />
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
                                value={canCollateriseShares}
                                onChange={this.onChange}
                                id="canCollateriseShares"
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
                            <input
                              type="text"
                              value={purchasePrice}
                              onChange={this.onChange}
                              id="purchasePrice"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Payment Period</label>
                            <input
                              type="text"
                              value={paymentPeriod}
                              onChange={this.onChange}
                              id="paymentPeriod"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Grade</label>
                            <input
                              type="text"
                              value={grade}
                              onChange={this.onChange}
                              id="grade"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group col-md-2">
                            <label htmlFor="inputEmail4">Level</label>
                            <input
                              type="text"
                              value={level}
                              onChange={this.onChange}
                              id="level"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <h3 className="mb-4"> Scheme Rules </h3>
                          <textarea
                            value={schemeRules}
                            onChange={this.onChange}
                            id="schemeRules"
                            className="form-control"
                            rows="15"
                          />
                        </div>
                        <button
                          type="submit"
                          className="float-right p-2 btn c-btn-bg2"
                          onClick={this.onBoardCompany}
                        >
                          Submit{' '}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
    );
  }
}

export default OnBoardCompany;
