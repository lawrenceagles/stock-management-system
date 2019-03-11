import React, { Component } from 'react';

class step3 extends Component {
  constructor(props) {
    super(props);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <div className="content company-reg">
        <div className="container ">
          <div className="row">
            <div className="col-lg-9 ml-auto">
              <div className="row pt-5 mt-3 mb-5">
                <h3 className="mb-4"> Scheme Rules </h3>
                  <div className="form-group">
                    <textarea
                      value={this.props.schemeRules}
                      onChange={this.props.onChange}
                      id="schemeRules"
                      className="form-control"
                      rows="9"
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default step3;
