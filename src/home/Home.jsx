import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AddressForm from '../address/address_form';
import ZipCode from './ZipCode';
import '../App.css';
import NavigationBar from './NavigationTab';

export class Home extends Component {
  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null || this.props.userData.role !== 'Admin') {
      this.props.history.push('/');
    } else {
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              <NavigationBar isHome={true} />
            </div>
            <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
              <div className="col-xs-12 text-center  white-bg">
                <h2>RRMC</h2>
                <ZipCode />
              </div>
              <AddressForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  isLogin: false,
  userData: {}
};

Home.propTypes = {
  isLogin: PropTypes.bool
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  {}
)(withRouter(Home));
