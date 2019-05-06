import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getUserList, getCompanyList, userRegistration, deleteUser } from '../actions/admin/mortgage_pool_container';
import Loader from '../Loder/Loders';
import Header from './header';
import MessageNotification from '../MessageNotification';

class UserRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: true,
      password: '',
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: 'Homeowner',
        password: '',
        confirmPassword: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      errors: {},
      isPassword: false
    };
  }

  handleValidation() {
    let fields = Object.assign({}, this.state.fields);
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields['firstName']) {
      formIsValid = false;
      errors['firstName'] = 'First Name Cannot be empty';
    }

    if (typeof fields['firstName'] !== 'undefined') {
      if (!fields['firstName'].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors['firstName'] = 'First Name has Only letters';
      }
    }

    if (!fields['lastName']) {
      formIsValid = false;
      errors['lastName'] = 'Last Name Cannot be empty';
    }

    if (typeof fields['lastName'] !== 'undefined') {
      if (!fields['lastName'].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors['lastName'] = 'Last Name has Only letters';
      }
    }

    //Password
    if (!fields['password']) {
      formIsValid = false;
      errors['password'] = 'Cannot be empty';
    }

    if (typeof fields['password'] !== 'undefined') {
      if (!fields['password'].match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
        formIsValid = false;

        errors['password'] = 'Min. 8 charcter long and have atleast 1 uppercase,1 lowercase, 1 symbol, 1 number';
      }
    }

    if (!fields['confirmPassword']) {
      formIsValid = false;
      errors['confirmPassword'] = 'Cannot be empty';
    }

    if (typeof fields['confirmPassword'] !== 'undefined') {
      if (!fields['confirmPassword'].match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
        formIsValid = false;

        errors['confirmPassword'] = 'Min. 8 charcter long and have atleast 1 uppercase,1 lowercase, 1 symbol, 1 number';
      }
    }

    //Email
    if (!fields['email']) {
      formIsValid = false;
      errors['email'] = 'Email Cannot be empty';
    }

    if (typeof fields['email'] !== 'undefined') {
      let lastAtPos = fields['email'].lastIndexOf('@');
      let lastDotPos = fields['email'].lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields['email'].indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          fields['email'].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors['email'] = 'Email is not valid';
      }
    }

    if (!fields['hashcode']) {
      formIsValid = false;
      errors['hashcode'] = 'Cannot be empty';
    }

    if (typeof fields['hashcode'] !== 'undefined') {
      if (!fields['hashcode'].match(/^[2-9A-Z]+$/) || fields['hashcode'].length !== 10) {
        formIsValid = false;

        errors['hashcode'] = '10 charcter long includes capital letter and digit except 0 and 1';
      }
    }

    if (!fields['phoneNumber']) {
      formIsValid = false;
      errors['phoneNumber'] = 'phoneNumber Cannot be empty';
    }

    if (typeof fields['phoneNumber'] !== 'undefined') {
      if (!fields['phoneNumber'].match('^[0-9]+$')) {
        formIsValid = false;
        errors['phoneNumber'] = 'enter only number';
      }
    }

    if (!fields['countryCode']) {
      formIsValid = false;
      errors['countryCode'] = 'countryCode Cannot be empty';
    }

    if (typeof fields['countryCode'] !== 'undefined') {
      if (!fields['countryCode'].match('^[0-9]+$')) {
        formIsValid = false;
        errors['countryCode'] = 'enter only number';
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleChange(field, e) {
    let fields = Object.assign({}, this.state.fields);
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  contactSubmit = e => {
    e.preventDefault();

    if (this.handleValidation()) {
      if (this.state.fields.password === this.state.fields.confirmPassword) {
        this.setState({
          isPassword: false,
          isLoader: false
        });

        userRegistration(this.state.fields).then(res => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res) {
            this.setState({
              fields: {
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                password: '',
                confirmPassword: '',
                hashcode: '',
                phoneNumber: '',
                countryCode: '1'
              },
              isLoader: true
            });
            this.props.history.push('/login');
          } else {
            this.setState({
              isLoader: true
            });
          }
        });
      } else {
        this.setState({
          isPassword: true,
          isLoader: true
        });
      }
    }
  };

  clearInput = () => {
    this.setState({
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      errors: {},
      isPassword: false,
      isLoader: true
    });
  };

  render() {
    const { back } = style;

    return (
      <div style={{ ...back }}>
        <Header />
        <MessageNotification />
        <div className=" pad-left-righ-xs">
          <section className="login-form">
            <div className="container-fluid">
              <div className="row">
                <form name="contactform" className="contactform" style={{ color: '#fff' }}>
                  {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                  <div className=" col-xs-12 ">
                    <div className="col-xs-12 col-md-6 nopad">
                      {' '}
                      <label className="col-xs-12">Role</label>
                      <div className="col-xs-12 form-group">
                        <input type="text" className="form-control" id="role" disabled value="Homeowner" />
                        <div className="form-img-wrapper">
                          <img src="img/user-name-icon.png" alt="userImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['role']}</span>
                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 nopad">
                      {' '}
                      <label className="col-xs-12">First Name</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="first_name"
                          type="text"
                          className="form-control"
                          id="myfirstname"
                          onChange={this.handleChange.bind(this, 'firstName')}
                          value={this.state.fields['firstName']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/user-name-icon.png" alt="userImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['firstName']}</span>
                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 nopad">
                      <label className="col-xs-12">Last Name</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="last_name"
                          type="text"
                          className="form-control"
                          id="mylastname"
                          onChange={this.handleChange.bind(this, 'lastName')}
                          value={this.state.fields['lastName']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/user-name-icon.png" alt="userImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['lastName']}</span>
                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 nopad">
                      <label className="col-xs-12">Hash Code</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="hashcode"
                          type="text"
                          className="form-control"
                          id="hashcode"
                          onChange={this.handleChange.bind(this, 'hashcode')}
                          value={this.state.fields['hashcode']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/lock-icon.png" alt="lockImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['hashcode']}</span>

                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-12 nopad">
                      <label className="col-xs-12">Phone Number</label>
                      <div className="col-xs-12 form-group">
                        <div className="row mini-row">
                          <div className="col-xs-4 mini-pad">
                            <input
                              type="text"
                              name="countryCode"
                              className="form-control text-center"
                              maxLength="3"
                              id="mycountry"
                              onChange={this.handleChange.bind(this, 'countryCode')}
                              value={this.state.fields['countryCode']}
                              style={{ paddingLeft: '10px' }}
                            />
                          </div>
                          <div className="col-xs-8 mini-pad">
                            <input
                              type="text"
                              className="form-control"
                              maxLength="12"
                              id="myphoneNumber"
                              onChange={this.handleChange.bind(this, 'phoneNumber')}
                              value={this.state.fields['phoneNumber']}
                              style={{ paddingLeft: '12px' }}
                              name="phoneNumber"
                            />
                          </div>

                          <span style={{ color: 'red' }}>{this.state.errors['phoneNumber']}</span>
                          <span style={{ color: 'red' }}>{this.state.errors['countryCode']}</span>
                          <br />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-12 nopad">
                      <label className="col-xs-12">Email</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="email"
                          type="text"
                          className="form-control"
                          id="myemail"
                          onChange={this.handleChange.bind(this, 'email')}
                          value={this.state.fields['email']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/user-name-icon.png" alt="userImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['email']}</span>
                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 nopad">
                      <label className="col-xs-12">Password</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="password"
                          type="password"
                          className="form-control"
                          id="mypassword"
                          onChange={this.handleChange.bind(this, 'password')}
                          value={this.state.fields['password']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/lock-icon.png" alt="lockImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['password']}</span>
                        <br />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6 nopad">
                      <label className="col-xs-12">Confirm Password</label>
                      <div className="col-xs-12 form-group">
                        <input
                          name="confirm_password"
                          type="password"
                          className="form-control"
                          id="myconfirmpassword"
                          onChange={this.handleChange.bind(this, 'confirmPassword')}
                          value={this.state.fields['confirmPassword']}
                        />
                        <div className="form-img-wrapper">
                          <img src="img/lock-icon.png" alt="lockImage" />
                        </div>
                        <span style={{ color: 'red' }}>{this.state.errors['confirmPassword']}</span>
                        {this.state.isPassword ? <span style={{ color: 'red' }}>Password miss match</span> : null}
                        <br />
                      </div>
                    </div>

                    <div className="col-xs-12 form-group pad-up">
                      <input
                        style={{
                          backgroundColor: 'rgb(138, 9, 66)',
                          color: '#fff'
                        }}
                        onClick={this.contactSubmit.bind(this)}
                        type="button"
                        className="form-control"
                        defaultValue="Register"
                        name="submit"
                      />
                    </div>
                    <div className="col-xs-12 form-group pad-up">
                      <input
                        style={{ backgroundColor: '#8a0942', color: '#fff' }}
                        type="button"
                        className="form-control"
                        defaultValue="Clear"
                        onClick={this.clearInput}
                        name="clear"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <Link to="/Login">
              <span className="pull-right" style={{ color: '#fff' }}>
                Login
              </span>
            </Link>
          </section>
        </div>
      </div>
    );
  }
}

const style = {
  back: {
    backgroundImage: "url('img/own-bg.jpg')",
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    backgroundSize: 'cover'
  }
};

UserRegistration.defaultProps = {
  userRegistration: undefined
};

UserRegistration.propTypes = {
  userRegistration: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getUserList, getCompanyList, userRegistration, deleteUser }
)(withRouter(UserRegistration));
