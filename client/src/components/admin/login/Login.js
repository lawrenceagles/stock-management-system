import React, { Component } from 'react';
import './Login.styles.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      submitted: false,
      error: '',
    };

    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(e) {
    e.preventDefault();

    // .then(() => {
    // 	this.setState({ ...INITIAL_STATE });
    // 	history.push(/dashboard);
    // })
    // .catch(error => {
    // this.setState({ error });
    // });
    this.props.history.push('/dashboard');
  }

  render() {
    const { email, password, submitted, error } = this.state;
    return (
      <section className="p-5">
        <div className="container-fluid">
          <div className="row" style={{ marginTop: '100px' }}>
            <div className="col text-center mb-3">
              <h4 className="text-warning text-dark">LOGIN</h4>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <form onSubmit={this.loginUser}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control p-4"
                    id="email"
                    placeholder="Enter Email"
                  />
                  {submitted && !email && (
                    <div className="help-block">Email is required</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control p-4"
                    id="password"
                    placeholder="Enter Password"
                  />
                  {submitted && !password && (
                    <div className="help-block">Password is required</div>
                  )}
                  <label className="mt-2">
                    <a className="text-dark" href="/">
                      Forgot Password?
                    </a>
                  </label>
                </div>
                <button type="submit" className="p-2 btn-block btn c-btn-bg">
                  LOGIN
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
