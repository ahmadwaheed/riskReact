import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SwapFunderMapComponent from './swap_funder_map_component';
import * as myapi from '../ConfigUri';
import './swap_funder_container.css';
import { error } from '../actions/login/loginAction';

class SwapFundPortfolioManager extends React.Component {
  constructor() {
    super();

    this.state = {
      isActiveHomeTab: true,
      isActiveSummaryTab: false,
      swapFunderSummaryData: [],
      swapFunderSummaryStatus: ''
    };
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    }
  }

  handleTab = props => {
    if (props === 'summary') {
      const url = myapi.getSwapFunderSummary;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.length >= 1)
            this.setState({
              swapFunderSummaryData: data,
              swapFunderSummaryStatus: '',
              isActiveHomeTab: !this.state.isActiveHomeTab,
              isActiveSummaryTab: !this.state.isActiveSummaryTab
            });
          else
            this.setState({
              swapFunderSummaryData: [],
              swapFunderSummaryStatus: 'No Records Found',
              isActiveHomeTab: !this.state.isActiveHomeTab,
              isActiveSummaryTab: !this.state.isActiveSummaryTab
            });
        })
        .catch(err => {
          error(err.message);
          if (err.request && err.request.status === 401) {
            this.props.history.push('/login');
          }
        });
    } else
      this.setState({
        isActiveHomeTab: !this.state.isActiveHomeTab,
        isActiveSummaryTab: !this.state.isActiveSummaryTab
      });
  };

  renderPortfolioSummaryComponent = () => {
    if (this.state.swapFunderSummaryData.length >= 1)
      return (
        <div className="col-xs-12 table-responsive details-table no-shadow own-radious nopad striped-table-own">
          <Scrollbars className="scrollStyle" id="mortgageListScroll" style={{ maxHeight: '40vh' }}>
            <table className="table" style={{ backgroundColor: 'white' }}>
              <thead>
                <tr>
                  <th>MSA</th>
                  <th>Index weight</th>
                  <th>Actual weight</th>
                  <th>Total mortgage value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.swapFunderSummaryData.map((record, index) => (
                  <DisplaySummaryRows key={index} data={record} />
                ))}
              </tbody>
            </table>
          </Scrollbars>
        </div>
      );
    else
      return (
        <div style={{ color: 'black', textAlign: 'center', marginTop: '260px' }}>
          <h4>{this.state.swapFunderSummaryStatus}</h4>
        </div>
      );
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              <SwapFunderMapComponent userData={this.props.userData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DisplaySummaryRows = props => {
  return (
    <tr>
      <td>
        {props.data.msacode} &nbsp; {props.data.msa_name}
      </td>
      <td>{props.data.index}</td>
      <td>${props.data.actuallweight}</td>
      <td>${props.data.total_weight_value}</td>
    </tr>
  );
};

SwapFundPortfolioManager.defaultProps = {
  isLogin: false,
  userData: {},
  error: undefined
};

SwapFundPortfolioManager.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  error: PropTypes.func
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { error }
)(withRouter(SwapFundPortfolioManager));
