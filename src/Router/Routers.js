import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRouter from './PrivateRouter';
import Home from '../home/Home';
import Map_view from '../address/Map_view';
import Login from '../login/login_page';
import Borrower from '../borrower/borrower_component';
import UserPayments from '../borrower/UserPayments';
import PayInvoice from '../borrower/PayInvoice';
import MortgageServicer from '../mortgage-servicer/mortgage_servicer';
import SwapFundPortfolioManager from '../swap-funder-portfolio-manager/swap_funder_container';
import { NotFoundComponent } from '../NotFoundComponent';
import MortgageOriginatorContainer from '../mortgage-originator/mortgage_originator_container';
import CbspaHpi from '../hpi-upload/CbspaHpi';
import StateHpi from '../hpi-upload/stateHpi';
import ZipHpi from '../hpi-upload/ZipHpi';
import ZipHpi3 from '../hpi-upload/ZipHpi3';
import Master from '../hpi-upload/Master';
import MortgageListContainer from '../property/MortgageListContainer';
import MortgageUpdationForm from '../property/MortgageUpdationForm';
import PoolContainer from '../pool/PoolContainer';
import PoolLevelReporting from '../pool/PoolLevelReporting';
import CurrentViewPool from '../pool/CurrentViewPool';
import PortfolioPerformance from '../PortfolioPerformance';
import UserManager from '../login/UserManager';
import BusinessManager from '../login/BusinessManager';
import Header from '../address/Map_Component/Header';
import PoolProperties from '../pool/PoolProperties';
import ForgetPassword from '../login/ForgetPassword';
import PoolPropertiesDetail from '../pool/PoolPropertiesDetail';
import ResetPassword from '../login/ResetPassword';
import RenewPassword from '../login/RenewPassword';
import UserProperties from '../borrower/UserProperties';
import AddProperty from '../property/AddProperty';
import UserRegistration from '../login/UserRegistration';
import PropertAssociateAssign from '../property/PropertyAssociateAssign';
import LogComponent from '../LogComponent';
import PaymentList from '../borrower/PaymentList';
import PoolPerformance from '../pool/PoolPerformance';

class Routers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeader: false
    };
  }

  render() {
    var url = window.location.pathname;

    return (
      <Router>
        <div>
          <div
            className={this.props.isLogin && (url !== '/login' || url !== '/') ? 'full-width-fix-bg own-container col-xs-12 nopad' : ''}
          >
            <div>
              {this.props.isLogin && (url !== '/login' || url !== '/') ? (
                <Header userData={this.props.userData} />
              ) : null}
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <PrivateRouter path="/home" component={Home} />
                <PrivateRouter path="/map" component={Map_view} />
                <PrivateRouter path="/borrower" component={Borrower} />
                <PrivateRouter path="/mortgage-servicer" component={MortgageServicer} />
                <PrivateRouter path="/portfolio-manager" component={SwapFundPortfolioManager} />
                <PrivateRouter path="/CbspaHpi" component={CbspaHpi} />
                <PrivateRouter path="/StateHpi" component={StateHpi} />
                <PrivateRouter path="/ZipHpi" component={ZipHpi} />
                <PrivateRouter path="/ZipHpi3" component={ZipHpi3} />
                <PrivateRouter path="/master" component={Master} />
                <PrivateRouter path="/portfolio_performance" component={PortfolioPerformance} />
                <PrivateRouter path="/mortgage-originator" component={MortgageOriginatorContainer} />
                <PrivateRouter path="/properties-list" component={MortgageListContainer} />
                <PrivateRouter path="/edit-property-data/:id/:hashcode?" component={MortgageUpdationForm} />
                <PrivateRouter path="/view-property-detail/:id/:poolId?" component={MortgageUpdationForm} />
                <PrivateRouter path="/mortgage-pool" component={PoolContainer} />
                <PrivateRouter path="/current-view" component={CurrentViewPool} />
                <PrivateRouter path="/pool-level-reporting" component={PoolLevelReporting} />
                <PrivateRouter path="/pool-data/:id/:timePeriod?/:quarter?" component={PoolProperties} />
                <PrivateRouter path="/user-manager" component={UserManager} />
                <PrivateRouter path="/business-manager" component={BusinessManager} />
                <PrivateRouter path="/user-payment/:id?/:poolId?" component={UserPayments} />
                <PrivateRouter path="/user-properties/:id" component={UserProperties} />
                <PrivateRouter path="/pay-invoice/:id/:poolid" component={PayInvoice} />
                <PrivateRouter path="/add-property" component={AddProperty} />
                <PrivateRouter path="/logs" component={LogComponent} />
                <PrivateRouter path="/payment-list" component={PaymentList} />
                <PrivateRouter path="/property-association/:id/:hashcode" component={PropertAssociateAssign} />
                <PrivateRouter
                  path="/pool-properties-Detail/:poolId/:year/:quarter/:postalCode"
                  component={PoolPropertiesDetail}
                />
                <PrivateRouter path="/pool-performance/:id" component={PoolPerformance} />
                <Route path="/forget-password" component={ForgetPassword} />
                <Route path="/reset-password/:token" component={ResetPassword} />
                <Route path="/renew-password" component={RenewPassword} />
                <Route path="/user-registration" component={UserRegistration} />
                <PrivateRouter component={NotFoundComponent} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

Routers.defaultProps = {
  isLogin: false,
  userData: {}
};

Routers.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
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
)(Routers);
