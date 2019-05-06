import React, { Component } from 'react';
import moment from 'moment';
import * as api from './../../ConfigUri';
import Loader from './../../Loder/Loders';
import { BorrowerAccountInfo } from './../../borrower/borrower_account_info';
import './mortgage_originator_home.css';
import { connect } from 'react-redux';
import {
  OnMonthData,
  OninfoWindowData,
  OnreportScreenData,
  OnAccountInfoData
} from './../../actions/mortage-originator/mortage-originator-action';
import { Scrollbars } from 'react-custom-scrollbars';
import { error } from './../../actions/login/loginAction';

class MortgageOriginatorHomeComponent extends Component {
  constructor(props) {
    super();

    this.state = {
      token: props.token,
      isViewLoader: true,
      isViewHomeScreen: false,
      isViewReportScreen: false,
      isViewAccountInfo: false
    };
  }

  componentDidUpdate() {
    if (document.getElementById('mortgageOriginatorTable')) {
      document.getElementById('mortgageOriginatorTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  }

  componentDidMount() {
    const url = api.getMortgageOriginatorMonthData;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(res => res.json())
      .then(response => {
        this.props.onMonthData(response.originators);

        this.props.oninfoWindowData(response.OrigniationInfo);

        this.setState({
          isViewLoader: false,
          isViewHomeScreen: true
        });
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  }

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageOriginatorTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';

    document.getElementById('mortgageOriginatorList').style.transform = translate;
  };

  viewMonthlyReportScreen = date => {
    this.setState({ isViewLoader: true, isViewHomeScreen: false });
    window.scrollTo(0, 0);
    const url = api.getMonthReportByDate + date;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(res => res.json())
      .then(response => {
        this.props.onreportScreenData(response);

        this.setState({
          isViewLoader: false,
          isViewReportScreen: true
        });
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  goToHomeScreen = () => {
    this.setState({ isViewHomeScreen: true, isViewReportScreen: false });
  };

  goToReportScreen = () => {
    this.setState({
      isViewHomeScreen: false,
      isViewReportScreen: true,
      isViewAccountInfo: false
    });
  };

  viewAccountInfo = accountNumber => {
    this.setState({
      isViewLoader: true,
      isViewHomeScreen: false,
      isViewReportScreen: false
    });
    const url = api.getSelectedBorrowerProfile + accountNumber;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length >= 1) {
          this.props.onAccountInfoData(response[0]);
          this.props.onAccountInfoData(response[0]);

          this.setState({
            isViewLoader: false,
            isViewAccountInfo: true
          });
        } else {
          this.props.onAccountInfoData();
          this.props.onAccountInfoData();

          this.setState({
            isViewAccountInfo: true
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

  renderMonthTable() {
    const { thead } = styles;

    return (
      <div className="col-xs-12 table-responsive details-table no-shadow own-radious nopad striped-table-own">
        <Scrollbars className="scrollStyle" id="mortgageOriginatorTable" style={{ maxHeight: '50vh' }}>
          <table className="table">
            <thead id="mortgageOriginatorList" style={{ ...thead }}>
              <tr>
                <th>Date</th>
                <th>Total Mortgage Made</th>
                <th>Total Mortgage Loan Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.props.MonthData.map((record, index) => (
                <DisplayRows key={index} data={record} viewMonthlyReportScreen={this.viewMonthlyReportScreen} />
              ))}
            </tbody>
          </table>
        </Scrollbars>
      </div>
    );
  }

  renderMonthReportScreen() {
    return (
      <div className="margin-half-minus">
        <div className="col-xs-12 pad-half">
          <span className="back-arrow shadow-arrow" onClick={this.goToHomeScreen}>
            <img src="img/back-arrow.png" alt="back-arrow" />
          </span>
        </div>
        <div className="col-xs-12 table-responsive details-table no-shadow own-radious nopad striped-table-own">
          <table className="table">
            <thead>
              <tr>
                <th>Mortgage Id</th>
                <th>Borrower Name</th>
                <th>City</th>
                <th>State</th>
                <th>Total Account Originated</th>
                <th>Count</th>
                <th>Balance</th>
                <th>Total Origination Fees Owed</th>
                <th>Paid</th>
                <th>Due</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.props.reportScreenData.map((record, index) => (
                <DisplayMonthlyReportScreenRows key={index} data={record} viewAccountInfo={this.viewAccountInfo} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
        {this.state.isViewLoader ? (
          <div style={{ marginTop: '65%' }}>
            <Loader myview={false} />
          </div>
        ) : null}
        {!this.state.isViewLoader && this.state.isViewHomeScreen ? (
          <div>
            <InfoComponent infoData={this.props.infoWindowData} />
            {this.renderMonthTable()}
          </div>
        ) : null}
        {!this.state.isViewLoader && this.state.isViewReportScreen ? this.renderMonthReportScreen() : null}
        {!this.state.isViewLoader && this.state.isViewAccountInfo ? (
          <div className="account-info">
            <div className="col-xs-12 nopad">
              <span className="back-arrow shadow-arrow" onClick={this.goToReportScreen}>
                <img src="img/back-arrow.png" alt="back-arrow" />
              </span>
            </div>
            <BorrowerAccountInfo accountInfo={this.props.accountInfo} />{' '}
          </div>
        ) : null}
      </div>
    );
  }
}

const DisplayRows = props => {
  return (
    <tr>
      <td style={{ cursor: 'pointer' }} onClick={() => props.viewMonthlyReportScreen(props.data.origination_date)}>
        {moment(props.data.origination_date).format('MM/YYYY')}
      </td>
      <td>{props.data.total_mortgage}</td>
      <td>
        ${' '}
        {props.data.total_mortgage_loan_balance
          ? props.data.total_mortgage_loan_balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          : null}
      </td>
    </tr>
  );
};

const InfoComponent = props => {
  return (
    <ul className="details-list originator-details-list col-xs-12 list-unstyled" style={{ backgroundColor: 'white' }}>
      <li className="dot col-xs-12 green-dot">
        <div>Total Account Originated</div>
        <div>
          ${' '}
          {Number(props.infoData.total_accounts_originator).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </li>
      <li className="dot col-xs-12 blue-dot">
        <div>Total Mortgage Originated</div>
        <div>{props.infoData.total_mortgage}</div>
      </li>
      <li className="dot col-xs-12 red-dot">
        <div>Balance</div>
        <div>
          ${' '}
          {Number(props.infoData.balance).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </li>
      <li className="dot col-xs-12 sky-blue-dot">
        <div>Total Origination Fees Owed</div>
        <div>
          ${' '}
          {Number(props.infoData.total_origination_fees).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </li>

      <li className="dot col-xs-12 blue-dot">
        <div>Paid</div>
        <div>
          ${' '}
          {Number(props.infoData.paid).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </li>
      <li className="dot col-xs-12 red-dot">
        <div>Due</div>
        <div>
          ${' '}
          {Number(props.infoData.due).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
      </li>
    </ul>
  );
};

const DisplayMonthlyReportScreenRows = props => {
  return (
    <tr>
      <td>{props.data.propertyid}</td>
      <td>{props.data.borrower_name}</td>
      <td>{props.data.city}</td>
      <td>{props.data.state}</td>

      <td>{Number(props.data.total_accounts_originator).toFixed(2)}</td>
      <td>{props.data.totalmoratge}</td>
      <td>
        $
        {Number(props.data.gse_loan).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>
        $
        {Number(props.data.total_origination_fees).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>
        $
        {Number(props.data.paid).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>
        $
        {Number(props.data.due).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </td>
      <td>
        <button className="btn btn-orange" onClick={() => props.viewAccountInfo(props.data.propertyid)}>
          Account Info
        </button>
      </td>
    </tr>
  );
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    MonthData: state.originator.monthData,
    infoWindowData: state.originator.windowData,
    reportScreenData: state.originator.ReportScreenData,
    accountInfo: state.originator.AccountInfoData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    onMonthData: data => dispatch(OnMonthData(data)),
    oninfoWindowData: data => dispatch(OninfoWindowData(data)),
    onreportScreenData: data => dispatch(OnreportScreenData(data)),
    onAccountInfoData: data => dispatch(OnAccountInfoData(data)),
    error: data => dispatch(error(data))
  };
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MortgageOriginatorHomeComponent);
