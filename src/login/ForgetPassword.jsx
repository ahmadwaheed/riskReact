import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './header';
import { forgetPassword } from '../actions/login/loginAction';
import MessageNotification from '../MessageNotification';

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      email: '',
      error: ''
    };
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data) {
      this.props.history.push('/not-found');
    }
  }

  goToInvoice = data => {
    this.props.history.push('/pay-invoice/' + data.id + '/' + data.poolid);
  };

  checkValid() {
    let errors;
    let formIsValid = true;

    if (!this.state.email) {
      formIsValid = false;
      errors = 'Email Cannot be empty';
    }

    if (typeof this.state.email !== 'undefined') {
      let lastAtPos = this.state.email.lastIndexOf('@');
      let lastDotPos = this.state.email.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.email.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          this.state.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors = 'Email is not valid';
      }
    }

    this.setState({ error: errors });
    return formIsValid;
  }

  contactSubmit = () => {
    if (this.checkValid()) {
      forgetPassword(this.state.email).then(res => {
        if (res) {
          this.setState({
            isLoader: true
          });
          this.props.history.push('/login');
        }
      });
    }
  };

  handleChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  goBack = () => {
    this.props.history.goBack();
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
                <form name="contactform" className="contactform">
                  <div className=" col-xs-12 ">
                    <div className="col-xs-12 form-group">
                      <input
                        type="text"
                        name="myemail"
                        className="form-control"
                        id="myemail"
                        onChange={event => this.handleChange(event)}
                        placeholder="Email"
                        value={this.state.email}
                      />
                      <div className="form-img-wrapper">
                        <img src="img/user-name-icon.png" alt="userImage" />
                      </div>
                      {this.state.error !== '' ? <span style={{ color: 'red' }}>{this.state.error}</span> : null}
                    </div>
                    <div className="col-xs-12 form-group">
                      <input
                        style={{ backgroundColor: '#8a0942', color: '#fff' }}
                        type="button"
                        className="form-control"
                        defaultValue="Send"
                        onClick={this.contactSubmit}
                        name="send"
                      />
                    </div>
                    <div className="col-xs-12 form-lower-txt">
                      <Link to="/login">
                        <span className="pull-right">Login</span>
                      </Link>
                    </div>
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

ForgetPassword.defaultProps = {
  userData: {}
};

ForgetPassword.propTypes = {
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  {}
)(withRouter(ForgetPassword));
