import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { getMortgageList, getMortgageListWithPayments } from '../ConfigUri';
import { OnAccountList } from '../actions/mortage-service/mortage-service-action';
import { saveSelectedMortgageData, stopLoading } from '../actions/admin/admin-action';
import Loder from '../Loder/Loders';
import { error } from '../actions/login/loginAction';

class PoolMortgageList extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.filteredMortgageArray = [];
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      if (document.getElementById('mortgageListScroll')) {
        document.getElementById('mortgageListScroll').children[0].addEventListener('scroll', this.handleBodyClick);
      }
    }

    this.getMortgageList();
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageListScroll').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('mortgageList').style.transform = translate;
  };

  shouldComponentUpdate(nextProps) {
    if (nextProps.searchMortgage.length && !(nextProps.searchAdminText === nextProps.searchMortgage)) return false;

    return true;
  }

  getMortgageList = () => {
    fetch(getMortgageList, {
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
          this.props.stopLoading();
        } else {
          const list = response;
          this.props.accountList(list);
          this.props.stopLoading();
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status == 401) {
          this.props.history.push('/login');
        }
      });
  };

  getFilteredList = (mortgageList, searchMortgage) => {
    if (mortgageList.length >= 1 && searchMortgage.length) {
      this.filteredMortgageArray = [];
      let searchedRegExp;
      let isRegExpValid = true;

      try {
        searchedRegExp = new RegExp(searchMortgage.toLowerCase());
      } catch (error) {
        isRegExpValid = false;
        return [];
      }

      if (mortgageList.length >= 1 && isRegExpValid) {
        for (let i = 0; i < mortgageList.length; i++) {
          if (
            mortgageList[i].borrowerid.toString().match(searchedRegExp) ||
            mortgageList[i].borrower_name.toLowerCase().match(searchedRegExp) ||
            mortgageList[i].address1.toLowerCase().match(searchedRegExp)
          ) {
            this.filteredMortgageArray.push(mortgageList[i]);
          }

          if (this.filteredMortgageArray.length >= 300) break;
        }

        return this.filteredMortgageArray;
      }
    }
  };

  updateMortgage = (selectedMortgagedData, propsHistory) => {
    const url = getMortgageListWithPayments + selectedMortgagedData.propertyid;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        const mortgage = response.mortgage;
        const paymentsData = response.history;
        this.props.saveSelectedMortgageData(mortgage, paymentsData);

        propsHistory.push(
          '/edit-property-data/' + selectedMortgagedData.propertyid + '/' + selectedMortgagedData.property_hashcode
        );
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status == 401) {
          this.props.history.push('/login');
        }
      });
  };

  render() {
    const { searchAdminText, searchMortgage } = this.props;
    let { mortgageList } = this.props;
    const { thead } = styles;

    if (searchAdminText.length && searchMortgage.length && searchAdminText === searchMortgage) {
      mortgageList = this.getFilteredList(mortgageList, searchMortgage);
    } else if (searchMortgage.length && this.filteredMortgageArray.length) {
      mortgageList = this.filteredMortgageArray;
    } else {
      this.filteredMortgageArray = [];
    }

    if (!this.props.mortgageListLoading)
      return (
        <div className="col-xs-12 nopad table-responsive margin-bottom">
          <Scrollbars className="scrollStyle" id="mortgageListScroll" style={{ maxHeight: '80vh' }}>
            <table className="table striped-table-own" style={{ backgroundColor: 'white' }}>
              <thead id="mortgageList" style={{ ...thead }}>
                <tr>
                  <th>Mortgage Id</th>
                  <th>Homeowner Name</th>
                  <th>Address</th>
                  <th>First Payment Date</th>
                  <th>First Mortgage Loan Amount</th>
                  <th>Total Swap Balance</th>
                  <th>First Mortgage Balance</th>
                  <th>Combine Balance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {mortgageList.map(record => (
                  <DisplayMortgageList
                    key={record.id}
                    data={record}
                    updateMortgage={this.updateMortgage}
                    propsHistory={this.props.history}
                  />
                ))}
              </tbody>
            </table>
          </Scrollbars>
        </div>
      );
    else {
      return (
        <div className="fullscreen-loader">
          <Loder myview={!this.props.mortgageListLoading} />
        </div>
      );
    }
  }
}

const DisplayMortgageList = props => {
  return (
    <tr>
      <td>{props.data.id}</td>
      <td>{props.data.borrower_name}</td>
      <td>{props.data.address1}</td>
      <td>
        {props.data.first_payment_due_date ? moment(props.data.first_payment_due_date).format('MM/DD/YYYY') : null}
      </td>
      <td>{Number(props.data.first_mortgage_loan_amount).toFixed(2)}</td>
      <td>{props.data.total_swap_balances ? Number(props.data.total_swap_balances).toFixed(2) : ''}</td>
      <td>{props.data.total_balances ? Number(props.data.total_balances).toFixed(2) : ''}</td>
      <td>{props.data.total_combine_balances ? Number(props.data.total_combine_balances).toFixed(2) : ''}</td>
      <td>
        <button className="btn btn-orange" onClick={() => props.updateMortgage(props.data, props.propsHistory)}>
          Edit
        </button>
      </td>
    </tr>
  );
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

PoolMortgageList.defaultProps = {
  searchAdminText: '',
  searchMortgage: '',
  accountList: undefined,
  saveSelectedMortgageData: undefined,
  stopLoading: undefined,
  isLogin: false,
  userData: {}
};

PoolMortgageList.propTypes = {
  mortgageList: PropTypes.arrayOf(Object).isRequired,
  searchAdminText: PropTypes.string,
  searchMortgage: PropTypes.string,
  accountList: PropTypes.func,
  saveSelectedMortgageData: PropTypes.func,
  stopLoading: PropTypes.func,
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    mortgageList: state.mortService.AccountList,
    searchAdminText: state.admin.searchAdminText,
    searchMortgage: state.admin.searchMortgage,
    mortgageListLoading: state.admin.mortgageListLoading,
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    accountList: data => dispatch(OnAccountList(data)),
    saveSelectedMortgageData: (mortgageData, paymentsData) =>
      dispatch(saveSelectedMortgageData(mortgageData, paymentsData)),
    stopLoading: () => dispatch(stopLoading()),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PoolMortgageList));
