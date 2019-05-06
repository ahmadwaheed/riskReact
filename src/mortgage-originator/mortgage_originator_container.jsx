import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MortgageOriginatorHomeComponent from './components/mortgage_originator_home';
import { NotFoundComponent } from './../NotFoundComponent';

class MortgageOriginatorContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      isActiveHomeTab: true,
      isActiveSummaryTab: false,
      swapFunderSummaryData: [],
      swapFunderSummaryStatus: ''
    };
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              <ul className="col-xs-12 col-sm-6 nopad list-unstyled list-inline own-tab swap-tab">
                <li className="active">Home</li>
              </ul>
            </div>
            <Switch>
              <Route
                exact
                path={this.props.match.url}
                render={() => <MortgageOriginatorHomeComponent token={this.props.userData.token} />}
              />
              <Route component={NotFoundComponent} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

MortgageOriginatorContainer.defaultProps = {
  isLogin: false,
  userData: {}
};

MortgageOriginatorContainer.propTypes = {
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
)(withRouter(MortgageOriginatorContainer));
