import React, { Component } from 'react';
import * as myapi from './../ConfigUri';
import { withRouter, Link } from 'react-router-dom';
import { Form } from 'react-form';
import Loder from '../Loder/Loders';
import { connect } from 'react-redux';
import { login, error, success, isFirstLogIn, socialLogin } from '../actions/login/loginAction';
import { OnAuthenticateDataSave } from '../actions/hpi-upload/hpi-action';
import MessageNotification from '../MessageNotification';
import { googleLoginApi, facebookLoginApi } from '../ConfigUri';
import queryString from 'query-string';

class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: '',
      password: '',
      isLoaded: true,
      isAfterLogin: true
    };
  }

  componentDidMount() {
    let query = queryString.parse(this.props.location.search);

    if (query.token) {
      socialLogin(query.token).then(res => {
        this.setState({
          isAfterLogin: true
        });
        if (res) {
          this.socialLogin(res);
        } else if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        }
      });
    } else if (query.archived == 'false') {
      error('This user is archived');
    } else if (query.role) {
      error('Your role is' + query.role + 'you can not access with this credential');
    }
  }

  socialLogin = findresponse => {
    this.props.onAuthenticateDataSave(JSON.stringify(findresponse));
    findresponse.token ? this.login(findresponse, true) : this.login({}, false);
    if (findresponse.role === 'Homeowner') this.props.history.push('/borrower');
    else if (findresponse.role === 'Admin') this.props.history.push('/home');
    else if (findresponse.role === 'Servicer') this.props.history.push('/mortgage-servicer');
    else if (findresponse.role === 'Swap Funder') this.props.history.push('/portfolio-manager');
    else if (findresponse.role === 'Originator') this.props.history.push('/mortgage-originator');

    this.setState({
      isAfterLogin: false
    });
  };

  login(userData, value) {
    this.props.login(userData, value);
  }

  getDetails = () => {
    isFirstLogIn(document.getElementById('myemail').value, this.props).then(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn) {
        var data = {
          userEmail: document.getElementById('myemail').value,
          password: document.getElementById('mypassword').value
        };

        //checking the condition ie validation of input field
        if (data.userEmail !== null && data.password !== null) {
          var z = data.password;
          var x = data.userEmail;
          var atpos = x.indexOf('@');
          var dotpos = x.lastIndexOf('.');

          if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            return false;
          }

          if (z.length < 5) {
            var pass = document.getElementById('mypassword');
            pass.setCustomValidity('please enter your password');
            return false;
          } else {
            var passer = document.getElementById('mypassword');
            passer.setCustomValidity('');
          }
        }

        //XXXXXX validation end
        this.setState({ isLoaded: !this.state.isLoaded });

        fetch(myapi.user_login, {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(data)
        })
          .then(Response => Response.json())
          .then(findresponse => {
            if (findresponse.httpCode === 400) {
              error(findresponse.description);
              this.setState({ isLoaded: true });
            } else if (findresponse.message) {
              error(findresponse.message);
              this.setState({ isLoaded: true });
            } else if (!findresponse.token) {
              error('something went wrong');
              this.setState({ isLoaded: true });
            } else {
              //To save the authentication data recived from the server after login
              this.props.onAuthenticateDataSave(JSON.stringify(findresponse));
              findresponse.token ? this.login(findresponse, true) : this.login({}, false);
              if (findresponse.role === 'Homeowner') this.props.history.push('/borrower');
              else if (findresponse.role === 'Admin') this.props.history.push('/home');
              else if (findresponse.role === 'Servicer') this.props.history.push('/mortgage-servicer');
              else if (findresponse.role === 'Swap Funder') this.props.history.push('/portfolio-manager');
              else if (findresponse.role === 'Originator') this.props.history.push('/mortgage-originator');
            }
          })
          .catch(err => {
            this.setState({ isLoaded: true });
            error(err.message);
            if (err.request && err.request.status === 401) {
              this.props.history.push('/login');
            }
          });
      } else if (isLoggedIn != null && !isLoggedIn) {
        this.props.history.push('/renew-password');
      }
    });
  };

  handleChange = event => {
    this.setState({ userEmail: event.target.value });
  };

  render() {
    let query = queryString.parse(this.props.location.search);

    if (query.token) {
      return null;
    }

    return (
      <div className=" pad-left-righ-xs">
        <MessageNotification />

        <section className="login-form">
          <div className="container-fluid">
            <div className="row">
              <Form className="col-xs-12 nopad" onSubmit={submittedValues => this.setState({ submittedValues })}>
                {formApi => (
                  <form onSubmit={formApi.submitForm} id="form2">
                    <div className=" col-xs-12 ">
                      <div className="col-xs-12 form-group">
                        <input type="email" name="email" className="form-control" placeholder="Email" id="myemail" />
                        <div className="form-img-wrapper">
                          <img src="img/user-name-icon.png" alt="userImage" />
                        </div>
                      </div>
                      <div className="col-xs-12 form-group">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          id="mypassword"
                        />
                        <div className="form-img-wrapper">
                          <img src="img/lock-icon.png" alt="lockImage" />
                        </div>
                      </div>
                      <div className="col-xs-12 form-group">
                        <input
                          type="submit"
                          name="submit"
                          className="form-control"
                          defaultValue="Sign In"
                          onSubmit={submittedValues => this.setState({ submittedValues })}
                          onClick={() => this.getDetails(formApi.values)}
                        />
                      </div>
                      <div className="col-xs-12 form-lower-txt" style={{ marginTop: '0' }}>
                        <Link to="/user-registration">
                          <span className="pull-left">New User</span>
                        </Link>
                        <Link to="/forget-password">
                          <span className="pull-right">Forgot Password?</span>
                        </Link>
                      </div>
                      <div className="col-xs-12">
                        <a
                          href={googleLoginApi}
                          className="button btn-default btn-block"
                          style={{ maxWidth: '100%', textAlign: 'center', marginTop: '22px' }}
                        >
                          <div>
                            <span className="svgIcon t-popup-svg">
                              <svg className="svgIcon-use" width="25" height="37" viewBox="0 0 25 25">
                                <g fill="none" fillRule="evenodd">
                                  <path
                                    d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z"
                                    fill="#EA4335"
                                  />
                                </g>
                              </svg>
                            </span>
                            <span className="button-label">Sign in with Google</span>
                          </div>
                        </a>
                      </div>
                      <div className="col-xs-12">
                        <a
                          href={facebookLoginApi}
                          className="button btn-default"
                          style={{ maxWidth: '100%', textAlign: 'center', marginTop: '22px' }}
                        >
                          <div>
                            <span className="svgIcon t-popup-svg">
                              <svg
                                className="svgIcon-use"
                                viewBox="0 0 48 48"
                                version="1.1"
                                width="26px"
                                height="26px"
                                style={{ marginTop: '5px' }}
                              >
                                <g id="surface1">
                                  <path
                                    style={{ fill: '#3F51B5' }}
                                    d="M 42 37 C 42 39.761719 39.761719 42 37 42 L 11 42 C 8.238281 42 6 39.761719 6 37 L 6 11 C 6 8.238281 8.238281 6 11 6 L 37 6 C 39.761719 6 42 8.238281 42 11 Z "
                                  />
                                  <path
                                    style={{ fill: '#FFFFFF' }}
                                    d="M 34.367188 25 L 31 25 L 31 38 L 26 38 L 26 25 L 23 25 L 23 21 L 26 21 L 26 18.589844 C 26.003906 15.082031 27.460938 13 31.59375 13 L 35 13 L 35 17 L 32.714844 17 C 31.105469 17 31 17.601563 31 18.722656 L 31 21 L 35 21 Z "
                                  />
                                </g>
                              </svg>
                            </span>
                            <span className="button-label">Sign in with Facebook</span>
                          </div>
                        </a>
                      </div>
                      <Loder myview={this.state.isLoaded} />
                    </div>
                  </form>
                )}
              </Form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    auth_data: state.hpi.counter,
    isLogin: state.login.isLogin
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    onAuthenticateDataSave: data => dispatch(OnAuthenticateDataSave(data)),
    login: (data, value) => dispatch(login(data, value)),
    error: data => dispatch(error(data)),
    success: data => dispatch(success(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Footer));
