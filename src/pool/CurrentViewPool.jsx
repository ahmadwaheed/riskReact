import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/admin/admin-action';
import { getHistoryPoolMortgageList, getPoolLevelReporting } from '../actions/admin/mortgage_pool_container';
import { Scrollbars } from 'react-custom-scrollbars';
import NavigationBar from '../../src/home/NavigationTab';
import { getSubscritionHistory } from '../actions/admin/mortgage_pool_container';
import Loader from '../Loder/Loders';

class CurrentViewPool extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      currentView: true,
      historicalView: false,
      isSubscritionView: false,
      subscriptionData: [],
      isLoader: true
    };
  }

  componentDidMount = () => {
    if (this.props.poolName === '' || this.props.poolName === undefined) {
      // this.props.history.push('./mortgage-pool');
    }

    if (document.getElementById('poolDataElement')) {
      document.getElementById('poolDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('poolDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('poolData').style.transform = translate;
  };

  changeToCurrent = () => {
    this.setState({
      currentView: true,
      historicalView: false,
      isSubscritionView: false
    });
  };

  changeToHitorical = async () => {
    this.setState({
      isLoader: false
    });

    await this.props.getHistoryPoolMortgageList(this.props.userData.token, this.props.poolId).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });

    this.setState({
      currentView: false,
      historicalView: true,
      isSubscritionView: false,
      isLoader: true
    });
  };

  backToList = () => {
    this.props.history.push('./mortgage-pool');
  };

  poolLevelReporting = async () => {
    this.setState({
      isLoader: false
    });

    await this.props.getPoolLevelReporting(this.props.userData.token, this.props.poolId).then(res => {
      this.setState({
        isLoader: true
      });
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isLoader: true
        });
      }
    });

    this.props.history.push('./pool-level-reporting');
  };

  changeToSubscription = () => {
    this.setState({
      isLoader: false
    });

    getSubscritionHistory(this.props.userData.token, this.props.poolId).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res && res.data && res.data.length > 0) {
        this.setState({
          isLoader: true,
          subscriptionData: res.data
        });
      } else {
        this.setState({
          isLoader: true
        });
      }
    });

    this.setState({
      currentView: false,
      historicalView: false,
      isSubscritionView: true
    });
  };

  render() {
    const { thead } = styles;

    let list = [];

    if (this.props.poolHistoryMortgageList.length > 0) {
      this.props.poolHistoryMortgageList.forEach(ele => {
        if (!list.find(x => x.id === ele.id)) {
          var start = this.props.poolHistoryMortgageList.find(x => x.id === ele.id && ele.created_date);
          ele.created_date = start ? start.created_date : '';
          var end = this.props.poolHistoryMortgageList.find(x => x.id === ele.id && ele.date_removed);
          ele.date_removed = end ? end.date_removed : '';
          list.push(ele);
        }
      });
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-up nopad">
              <NavigationBar isPools={true} />
              <ul className="col-xs-12 nopad list-unstyled list-inline own-tab with-a pad-up">
                <li onClick={() => this.changeToCurrent()} className={this.state.currentView ? 'active' : null}>
                  <a href="javascript:;">Current View</a>
                </li>
                <li onClick={() => this.changeToHitorical()} className={this.state.historicalView ? 'active' : null}>
                  <a href="javascript:;"> Historical View</a>
                </li>
                <li
                  onClick={() => this.changeToSubscription()}
                  className={this.state.isSubscritionView ? 'active' : null}
                >
                  <a href="javascript:;"> Subscription View</a>
                </li>
                <div className="pull-right">
                  <span className="back-arrow shadow-arrow" onClick={() => this.backToList()}>
                    <img src="img/back-arrow.png" alt="back-arrow" style={{ marginBottom: '0px' }} />
                  </span>
                </div>
              </ul>
            </div>
            <Loader myview={this.state.isLoader} />
            {this.state.currentView || this.state.historicalView ? (
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 pageHeading">
                  <label>Created Date:</label>
                  <span>{moment(this.props.poolDate).format('MM/DD/YYYY')}</span>
                  <button className="btn orange-bg btn-own" onClick={() => this.poolLevelReporting()}>
                    Pool-Level Reporting
                  </button>
                </div>
                <div className="col-xs-12 table-responsive">
                  <Scrollbars id="poolDataElement" className="scrollStyle" style={{ maxHeight: '60vh' }}>
                    <table className="table table-borderless">
                      <thead id="poolData" style={{ ...thead }}>
                        <tr>
                          <th>Account Number</th>
                          <th>Start Date</th>
                          {this.state.historicalView ? <th>End Date</th> : null}
                          {this.state.historicalView ? <th>Reason for remove</th> : null}
                          <th>Borrower Name</th>
                          <th>Address</th>
                          <th className="text-right">Payment Amount</th>
                          <th className="text-right">FMB</th>
                          <th className="text-right">Swap Balance</th>
                          <th>Combine Balance</th>
                        </tr>
                      </thead>
                      {this.state.currentView ? (
                        <tbody>
                          {this.props.selectedPoolMortgageList.map((mor, index) => (
                            <tr key={index}>
                              <td>{mor.propertyid}</td>
                              <td>{moment(mor.created_date).format('MM/DD/YYYY')}</td>
                              <td style={{ minWidth: '190px' }}>{mor.borrower_name}</td>
                              <td style={{ minWidth: '190px' }}>{mor.address1}</td>
                              <td className="text-right">{mor.first_mortgage_loan_amount}</td>
                              <td className="text-right">{mor.balance}</td>
                              <td className="text-right">{mor.swap_balances}</td>
                              <td className="text-right">{mor.combine_balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          {this.props.poolHistoryMortgageList.length > 0 &&
                            this.props.poolHistoryMortgageList.map((mor, index) => (
                              <tr key={index}>
                                <td>{mor.propertyid}</td>
                                <td>{moment(mor.created_date).format('MM/DD/YYYY')}</td>
                                <td>{mor.date_removed ? moment(mor.date_removed).format('MM/DD/YYYY') : null}</td>
                                <td>{mor.reason_for_removal}</td>
                                <td style={{ minWidth: '190px' }}>{mor.borrower_name}</td>
                                <td style={{ minWidth: '190px' }}>{mor.address1}</td>
                                <td className="text-right">{mor.first_mortgage_loan_amount}</td>
                                <td className="text-right">{mor.balance}</td>
                                <td className="text-right">{mor.swap_balances}</td>
                                <td className="text-right">{mor.combine_balance}</td>
                              </tr>
                            ))}
                        </tbody>
                      )}
                    </table>
                  </Scrollbars>
                </div>
              </div>
            ) : (
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 pageHeading">
                  <label>Created Date:</label>
                  <span>{moment(this.props.poolDate).format('MM/DD/YYYY')}</span>
                </div>
                <div className="col-xs-12 table-responsive">
                  <Scrollbars id="poolDataElement" className="scrollStyle" style={{ maxHeight: '60vh' }}>
                    <table className="table table-borderless">
                      <thead id="poolData" style={{ ...thead }}>
                        <tr>
                          <th className="text-center">Created Date</th>
                          <th className="text-center">Basis points fee</th>
                          <th className="text-center">Monthly flat subscription fee</th>
                          <th className="text-center">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.subscriptionData.map((mor, index) => (
                          <tr key={index}>
                            <td className="text-center">{moment(mor.created_date).format('MM/DD/YYYY')}</td>
                            <td className="text-center">
                              {mor.subscription_annual_basis_point_fee
                                ? Number(mor.subscription_annual_basis_point_fee).toFixed(2)
                                : null}
                            </td>
                            <td className="text-center">
                              {mor.subscription_monthly_fee ? Number(mor.subscription_monthly_fee).toFixed(2) : null}
                            </td>
                            <td className="text-center">{mor.created_by ? mor.created_by : null}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

CurrentViewPool.defaultProps = {
  isMortgageUpdate: false,
  isLoading: true,
  startLoading: undefined,
  pools: [],
  selectedPoolMortgageList: [],
  MortgageDropList: [],
  poolName: '',
  poolHistoryMortgageList: [],
  getHistoryPoolMortgageList: undefined,
  getPoolLevelReporting: undefined,
  poolId: '',
  poolDate: '',
  getSubscritionHistory: undefined
};

CurrentViewPool.protoTypes = {
  isMortgageUpdate: PropTypes.bool,
  isLoading: PropTypes.bool,
  startLoading: PropTypes.func,
  pools: PropTypes.arrayOf(Object),
  selectedPoolMortgageList: PropTypes.arrayOf(Object),
  MortgageDropList: PropTypes.arrayOf(Object),
  poolName: PropTypes.string,
  poolHistoryMortgageList: PropTypes.arrayOf(Object),
  getHistoryPoolMortgageList: PropTypes.func,
  getPoolLevelReporting: PropTypes.func,
  poolId: PropTypes.string,
  poolDate: PropTypes.string,
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  getSubscritionHistory: PropTypes.func
};

const mapStateToProps = state => {
  return {
    isMortgageUpdate: state.admin.isMortgageUpdate,
    isLoading: state.admin.isLoading,
    pools: state.admin.pools,
    MortgageDropList: state.admin.MortgageDropList,
    selectedPoolMortgageList: state.admin.selectedPoolMortgageList,
    poolName: state.admin.poolName,
    poolHistoryMortgageList: state.admin.poolHistoryMortgageList,
    poolId: state.admin.poolId,
    poolDate: state.admin.poolDate,
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

CurrentViewPool.defaultProps = {
  isLogin: false,
  userData: {}
};

export default connect(
  mapStateToProps,
  {
    startLoading,
    stopLoading,
    getHistoryPoolMortgageList,
    getPoolLevelReporting,
    getSubscritionHistory
  }
)(withRouter(CurrentViewPool));
