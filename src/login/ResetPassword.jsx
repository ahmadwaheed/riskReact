import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { changePassword } from '../actions/login/loginAction';
import Loader from '../Loder/Loders';
import Header from './header';
import MessageNotification from '../MessageNotification';

class UserManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: true,
      fields: {
        password: '',
        confirmPassword: ''
      },
      errors: {},
      isPassword: false
    };
  }

  checkPassword() {
    let fields = Object.assign({}, this.state.fields);
    let errors = {};
    let formIsValid = true;

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

    this.setState({ errors: errors });
    return formIsValid;
  }

  contactSubmit = () => {
    let token = this.props.match.params.token;

    if (this.checkPassword()) {
      if (this.state.fields.password === this.state.fields.confirmPassword) {
        this.setState({
          isPassword: false,
          isLoader: false
        });

        changePassword(this.state.fields.password, token).then(res => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res && res.message === 'Password is Updated') {
            this.setState({
              fields: {
                password: '',
                confirmPassword: ''
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

  handleChange(field, e) {
    let fields = Object.assign({}, this.state.fields);
    fields[field] = e.target.value;
    this.setState({ fields });
  }

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
                <form name="contactform" className="contactform">
                  <div className=" col-xs-12 ">
                    <div className="col-xs-12 form-group">
                      <input
                        name="password"
                        type="password"
                        className="form-control"
                        id="mypass"
                        placeholder="Password"
                        onChange={this.handleChange.bind(this, 'password')}
                        value={this.state.fields['password']}
                      />
                      <div className="form-img-wrapper">
                        <img src="img/user-name-icon.png" alt="userImage" />
                      </div>
                      <span style={{ color: 'red' }}>{this.state.errors['password']}</span>
                    </div>
                    <div className="col-xs-12 form-group">
                      <input
                        name="confirm_password"
                        type="password"
                        className="form-control"
                        id="myConfirm"
                        placeholder="Confirm Password"
                        onChange={this.handleChange.bind(this, 'confirmPassword')}
                        value={this.state.fields['confirmPassword']}
                      />
                      <div className="form-img-wrapper">
                        <img src="img/user-name-icon.png" alt="userImage" />
                      </div>
                      <span style={{ color: 'red' }}>{this.state.errors['confirmPassword']}</span>
                      {this.state.isPassword ? <span style={{ color: 'red' }}>Password miss match</span> : null}
                    </div>
                    <div className="col-xs-12 form-group">
                      <input
                        style={{ backgroundColor: '#8a0942', color: '#fff' }}
                        type="button"
                        className="form-control"
                        defaultValue="Reset"
                        onClick={this.contactSubmit}
                      />
                    </div>
                    <div className="col-xs-12 form-lower-txt">
                      <Link to="/login">
                        <span className="pull-right">Login</span>
                      </Link>
                    </div>
                    <Loader myview={this.state.isLoader} />
                  </div>
                </form>
              </div>
            </div>
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

UserManager.defaultProps = {
  changePassword: undefined
};

UserManager.propTypes = {
  changePassword: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { changePassword }
)(withRouter(UserManager));
