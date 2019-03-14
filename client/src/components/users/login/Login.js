import React, { Component } from 'react';
import axios from 'axios';
import './Login.styles.css';

class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  loginUser = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const { value } = 'users';

    const userData = {
      email,
      password,
    };

    const header = {
      'Content-Type': 'application/json',
    };

    axios
      .post('http://localhost:7000/admin/login', userData, header)
      .then(res => {
        if (res.data === 'You are already Logged in') {
          this.props.history.push('/dashboard');
        }
        this.onSetResult(res.data, value);
        this.props.history.push('/dashboard');
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onSetResult = (result, key) => {
    localStorage.setItem(key, JSON.stringify(result));
  };

  componentDidMount() {
    const cachedHits = localStorage.getItem('users');
    if (cachedHits) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { email, password, error } = this.state;
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
                    onChange={this.onChange}
                    type="text"
                    className="form-control p-4"
                    id="email"
                    value={email}
                    error={error}
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    className="form-control p-4"
                    id="password"
                    value={password}
                    error={error}
                    placeholder="Enter Password"
                    required
                  />
                  <span className="mt-2">
                    <a className="text-dark" href="/">
                      Forgot Password?
                    </a>
                  </span>
                </div>
                <button type="submit" className="p-2 btn-block btn c-btn-bg">
                  LOGIN
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default UserLogin;
