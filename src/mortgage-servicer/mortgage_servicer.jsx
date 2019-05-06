import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getservicerlist,
  getFilteredAccountList,
  getSelectedBorrowerProfile,
  getBorrowerSwapBalanceHistory,
  getReportScreenData
} from '../ConfigUri';
import Loder from '../Loder/Loders';
import { BorrowerAccountInfo } from '../borrower/borrower_account_info';
import {
  OnAccountList,
  OnSwapBalanceData,
  OnReportScreenData
} from '../actions/mortage-service/mortage-service-action';
import { Scrollbars } from 'react-custom-scrollbars';
import { error } from '../actions/login/loginAction';
class MortgageServicer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      status: '',
      isLoader: false,
      isViewAccountInfo: false,
      accountInfo: [], //this the token
      isViewSwapHistory: false,
      swapBalanceHistoryStatus: '',
      isViewReportScreen: false,
      reportScreenStatus: '',
      payoffamountview: false,
      payoffdateview: false
    };
  }

  componentDidUpdate = () => {
    if (document.getElementById('mortgageServicerTable')) {
      document.getElementById('mortgageServicerTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageServicerTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('mortgageServicerList').style.transform = translate;
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    }

    fetch(getservicerlist, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length === 0) {
          this.props.accountList([]);

          this.setState({
            status: 'No Records Found',

            isLoader: !this.state.isLoader
          });
        } else {
          let list = response;
          this.props.accountList(list);

          this.setState({
            isLoader: !this.state.isLoader
          });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  }

  handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    this.setState({ isLoader: false });
    event.preventDefault();

    fetch(getFilteredAccountList, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify({
        searchText: this.state.searchText
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.length === 0) {
          this.props.accountList([]);

          this.setState({
            status: 'No Records Found',

            isLoader: !this.state.isLoader
          });
        } else {
          this.props.accountList(findresponse);

          this.setState({
            isLoader: !this.state.isLoader
          });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  viewAccountInfo = accountNumber => {
    const url = getSelectedBorrowerProfile + accountNumber;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length >= 1)
          this.setState({
            isViewAccountInfo: true,
            accountInfo: response[0]
          });
        else
          this.setState({
            isViewAccountInfo: true,
            accountInfo: []
          });
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  goToHome = () => {
    this.setState({
      isViewAccountInfo: false,
      isViewSwapHistory: false,
      swapBalanceHistoryStatus: '',
      isViewReportScreen: false,
      payoffamountview: false,
      payoffdateview: false
    });
  };

  goToOneStageBack = () => {
    this.setState({
      isViewAccountInfo: false,
      isViewSwapHistory: true,
      swapBalanceHistoryStatus: '',
      isViewReportScreen: false,
      payoffamountview: false,
      payoffdateview: false
    });
  };
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXX

  goToReportScreen = () => {
    const url = getReportScreenData;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response === {}) {
          this.props.onReportScreenData([]);

          this.setState({
            reportScreenStatus: 'No Records Found',
            isViewReportScreen: true,
            isViewAccountInfo: false,
            isViewSwapHistory: false,
            swapBalanceHistoryStatus: ''
          });
        } else {
          this.props.onReportScreenData(response);

          this.setState({
            reportScreenStatus: '',
            isViewReportScreen: true,
            isViewAccountInfo: false,
            isViewSwapHistory: false,
            swapBalanceHistoryStatus: ''
          });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  viewSwapHistory = borrower_id => {
    const url = getBorrowerSwapBalanceHistory + borrower_id;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length === 0) {
          this.props.onSwapBalanceData([]);

          this.setState({
            swapBalanceHistoryStatus: 'No Records Found',
            swapBalanceData: [],
            isViewSwapHistory: true
          });
        } else {
          this.props.onSwapBalanceData(response);

          this.setState({
            swapBalanceData: response,
            isViewSwapHistory: true
          });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  renderSwapBalanceTableNewPayoffAmount = () => {
    return (
      <div className="col-xs-12 nopad table-responsive">
        <table className="table" style={{ backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th>Dummy Date</th>
              <th>Dummy Transaction type</th>
              <th>Dummy Adjustment amount</th>
              <th>Dummy Swap balance</th>
              <th>Dummy Good until</th>
              <th>Dummy Payoff amount</th>
              <th>Dummy Payoff date</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </div>
    );
  };
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  renderSwapBalanceTableNewPayoffDate = () => {
    return (
      <div className="col-xs-12 nopad table-responsive">
        <table className="table" style={{ backgroundColor: 'white' }}>
          <thead>
            <tr>
              <th>payoff Date</th>
              <th>payoff Transaction type</th>
              <th>payoff Adjustment amount</th>
              <th>payoff Swap balance</th>
              <th>payoff Good until</th>
              <th>payoff Payoff amount</th>
              <th>payoff Payoff date</th>
            </tr>
          </thead>
          <tbody />
        </table>
      </div>
    );
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  renderSwapBalanceTableNew = () => {
    if (this.props.swapBalanceData.length >= 1)
      return (
        <div className="col-xs-12 nopad table-responsive">
          <table className="table" style={{ backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction type</th>
                <th>Adjustment amount</th>
                <th>Swap balance</th>
                <th>Good until</th>
                <th>Payoff amount</th>
                <th>Payoff date</th>
              </tr>
            </thead>
            <tbody>
              {this.props.swapBalanceData.map((record, index) => (
                <DisplaySwapBalanceRows
                  key={index}
                  data={record}
                  payoffscreen={this.payoff}
                  payoffdatescreen={this.payoffdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  renderSwapBalanceTable = () => {
    if (this.props.swapBalanceData.length >= 1)
      return (
        <div className="col-xs-12 nopad table-responsive">
          <table className="table" style={{ backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction type</th>
                <th>Adjustment amount</th>
                <th>Swap balance</th>
                <th>Good until</th>
                <th>Payoff amount</th>
                <th>Payoff date</th>
              </tr>
            </thead>
            <tbody>
              {this.props.swapBalanceData.map((record, index) => (
                <DisplaySwapBalanceRows
                  key={index}
                  data={record}
                  payoffscreen={this.payoff}
                  payoffdatescreen={this.payoffdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    else return <div style={{ color: 'white', textAlign: 'center' }}>{this.state.swapBalanceHistoryStatus}</div>;
  };

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  renderReportScreenTable = () => {
    if (this.props.reportScreenValue.funder.length >= 1)
      return (
        <div className="col-xs-12 nopad table-responsive">
          <table className="table" style={{ backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Total Account Linked</th>
                <th>Total Swap Balance</th>
              </tr>
            </thead>
            <tbody>
              {this.props.reportScreenValue.funder.map((record, index) => (
                <DisplayReportTableRows key={index} data={record} />
              ))}
            </tbody>
          </table>
        </div>
      );
    else return <div style={{ color: 'white', textAlign: 'center' }}>{this.state.reportScreenStatus}</div>;
  };

  render() {
    const { thead } = styles;
    if (this.state.isViewAccountInfo)
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <span className="back-arrow shadow-arrow" onClick={this.goToHome}>
                  <img src="img/back-arrow.png" alt="back-arrow" />
                </span>
                {this.state.payoffamountview === false ? (
                  this.state.payoffamountview === false ? (
                    <BorrowerAccountInfo accountInfo={this.state.accountInfo} viewSwapHistory={this.viewSwapHistory} />
                  ) : null
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    else if (this.state.isViewSwapHistory)
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <span className="back-arrow shadow-arrow" onClick={this.goToHome}>
                  <img src="img/back-arrow.png" alt="back-arrow" />
                </span>
                {this.renderSwapBalanceTable()}
              </div>
            </div>
          </div>
        </div>
      );
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    else if (this.state.payoffamountview === true)
      // Design for the payoff amount
      return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 pad-left-right-large">
                <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                  <span className="back-arrow shadow-arrow" onClick={this.goToOneStageBack}>
                    <img src="img/back-arrow.png" alt="back-arrow" />
                  </span>
                  {this.renderSwapBalanceTableNewPayoffAmount()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else if (this.state.payoffdateview === true)
      return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 pad-left-right-large">
                <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                  <span className="back-arrow shadow-arrow" onClick={this.goToOneStageBack}>
                    <img src="img/back-arrow.png" alt="back-arrow" />
                  </span>
                  {this.renderSwapBalanceTableNewPayoffDate()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else if (this.state.isViewReportScreen)
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <h3 style={{ color: 'white', textAlign: 'center' }}>Report_Screen</h3>
                <span className="back-arrow shadow-arrow" onClick={this.goToHome}>
                  <img src="img/back-arrow.png" alt="back-arrow" />
                </span>
                {this.renderReportScreenTable()}
                <br />
                <div className="total-payment-txt col-xs-12 nopad white-bg shadow-none">
                  <h5 className="col-xs-6 ">
                    Total Swap Balance :
                    <span className="amount-txt">
                      $
                      {Number(this.props.reportScreenValue.grandTotalSwapBalance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </h5>
                  <h5 className="col-xs-6 text-right">
                    Total Linked Account :{' '}
                    <span className="amount-txt"> {this.props.reportScreenValue.grandTotalAccount}</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <form onSubmit={this.handleSubmit} className="col-xs-12 col-sm-6 col-md-4 nopad">
                  <div className="col-xs-12 nopad form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="searchText"
                      placeholder="Search..."
                      value={this.state.searchText}
                      onChange={this.handleInputChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xs-12 nopad">
                    <button type="submit" className="btn btn-orange">
                      Submit
                    </button>
                  </div>
                </form>
                <div className="col-sm-6 col-xs-12 col-md-8 form-group text-right-sm nopad">
                  <button className="btn btn-orange" onClick={this.goToReportScreen}>
                    Report Screen
                  </button>
                </div>
                <Loder myview={this.state.isLoader} />
                {this.state.isLoader ? (
                  <div className="col-xs-12 nopad table-responsive margin-bottom">
                    <Scrollbars className="scrollStyle" id="mortgageServicerTable" style={{ maxHeight: '68vh' }}>
                      <table className="table striped-table-own" style={{ backgroundColor: 'white' }}>
                        <thead id="mortgageServicerList" style={{ ...thead }}>
                          <tr>
                            <th>Mortgage Id</th>
                            <th>Borrower Name</th>
                            <th>City</th>
                            <th>State</th>
                            <th>MSA</th>
                            <th />
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.accountListData.length > 0 &&
                            this.props.accountListData.map((record, index) => (
                              <DisplayAccountList
                                key={index}
                                data={record}
                                viewAccountInfo={this.viewAccountInfo}
                                viewSwapHistory={this.viewSwapHistory}
                              />
                            ))}
                        </tbody>
                      </table>
                    </Scrollbars>
                  </div>
                ) : (
                  <h3 style={{ color: 'white', textAlign: 'center' }}>{this.state.status}</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      );
  }
}

const DisplayAccountList = props => {
  return (
    <tr>
      <td>{props.data.borrowerid}</td>
      <td>{props.data.borrower_name}</td>
      <td>{props.data.city}</td>
      <td>{props.data.sstatename}</td>
      <td>{props.data.smsaname}</td>
      <td>
        <button className="btn btn-orange" onClick={() => props.viewAccountInfo(props.data.propertyid)}>
          Account Info
        </button>
      </td>
      <td>
        <button className="btn btn-orange" onClick={() => props.viewSwapHistory(props.data.borrowerid)}>
          Swap Balance History
        </button>
      </td>
    </tr>
  );
};

const DisplaySwapBalanceRows = props => {
  return (
    <tr>
      <td>{props.data.store_date ? moment(props.data.store_date).format('MM/DD/YYYY') : null}</td>
      <td>{props.data.transaction_type}</td>
      <td>
        $
        {Number(props.data.adjustment_amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>
        $
        {Number(props.data.balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>{props.data.good_until ? moment(props.data.good_until).format('MM/DD/YYYY') : null}</td>
      <td onClick={props.payoffscreen}>
        $
        {Number(props.data.balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td onClick={props.payoffdatescreen}>
        {props.data.store_date ? moment(props.data.store_date).format('MM/DD/YYYY') : null}
      </td>
    </tr>
  );
};

const DisplayReportTableRows = props => {
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.email}</td>
      <td>{props.data.address}</td>
      <td>{props.data.totalAccountLinked}</td>
      <td>
        $
        {Number(props.data.totalSwapBalance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
    </tr>
  );
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    accountListData: state.mortService.AccountList,
    swapBalanceData: state.mortService.swapBalance,
    reportScreenValue: state.mortService.ReportScreenData,
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    accountList: data => dispatch(OnAccountList(data)),
    onSwapBalanceData: data => dispatch(OnSwapBalanceData(data)),
    onReportScreenData: data => dispatch(OnReportScreenData(data)),
    error: data => dispatch(error(data))
  };
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

MortgageServicer.defaultProps = {
  isLogin: false,
  userData: {}
};

MortgageServicer.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MortgageServicer));
