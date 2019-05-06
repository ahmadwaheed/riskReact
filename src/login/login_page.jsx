import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import { connect } from 'react-redux';
import { login, logout2 } from '../actions/login/loginAction';
import MessageNotification from '../MessageNotification';

class Login_page extends Component {
  componentDidMount = () => {
    if (this.props.isLogin) {
      sessionStorage.clear();
      localStorage.clear();
      this.props.logout2(false);
    }
  };

  render() {
    const { back } = style;

    return (
      <div style={{ ...back }}>
        <MessageNotification />
        <Header />
        <Footer />
      </div>
    );
  }
}

Login_page.defaultProps = {
  login: undefined,
  logout2: undefined
};

Login_page.propTypes = {
  login: PropTypes.func,
  logout2: PropTypes.func
};

const mapStateToProps = state => {
  return {
    auth_data: state.hpi.counter,
    isLogin: state.login.isLogin
  };
};

export default connect(
  mapStateToProps,
  { login, logout2 }
)(Login_page);
const style = {
  back: {
    backgroundImage: "url('img/own-bg.jpg')",
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    backgroundSize: 'cover'
  }
};
