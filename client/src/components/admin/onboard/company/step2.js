import React, { Component } from 'react';

class step2 extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <div className="content comp-reg">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row pt-5 mt-3 mb-5">
                <h3 className="mb-4"> Dividends </h3>
                <div className="form-row mb-4">
                  <div className="form-check form-check-inline ml-4 mr-4 ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={this.props.cash}
                      onChange={this.props.onChange}
                      id="cash"
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
                      value={this.props.bonus}
                      onChange={this.props.onChange}
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
                      className="form-control"
                      value={this.props.shares}
                      onChange={this.props.onChange}
                      id="shares"
                    />
                  </div>

                  <div className="form-group col-md-2">
                    <label htmlFor="inputEmail4">Bonus Rate</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.bonusRate}
                      onChange={this.props.onChange}
                      id="bonusRate"
                    />
                  </div>
                  <div className="form-group col-md-2" />
                </div>
                <h3 className="mb-4"> Share Information </h3>
                <div className="form-row mb-4">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputEmail4">Current Share Value</label>
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
                        value={this.props.canSell}
                        onChange={this.props.onChange}
                        id="canSell"
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
                        value={this.props.canBuy}
                        onChange={this.props.onChange}
                        id="canBuy"
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
                      className="form-control"
                      value={this.props.sharesFor}
                      onChange={this.props.onChange}
                      id="sharesFor"
                    />
                  </div>
                </div>

                <div className="form-row ">
                  <div className="form-group col-md-4 mx-auto">
                    <label htmlFor="inputEmail4">
                      Allow scheme members to buy or sell:
                    </label>
                    <div className="form-check form-check-inline ml-4 mr-4 ">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={this.props.memSell}
                        onChange={this.props.onChange}
                        id="memSell"
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
                        value={this.props.memBuy}
                        onChange={this.props.onChange}
                        id="memBuy"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox2"
                      >
                        Buy
                      </label>
                    </div>
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputEmail4">Purchase Price</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.purchasePrice}
                      onChange={this.props.onChange}
                      id="purchasePrice"
                    />
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputEmail4">Payment Period</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.paymentPeriod}
                      onChange={this.props.onChange}
                      id="paymentPeriod"
                    />
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputEmail4">Grade</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.empGrade}
                      onChange={this.props.onChange}
                      id="empGrade"
                    />
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputEmail4">Level</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.props.empLevel}
                      onChange={this.props.onChange}
                      id="empLevel"
                    />
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

export default step2;
