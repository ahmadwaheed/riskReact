import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { getMortgageList } from '../ConfigUri';
import { OnAccountList } from '../actions/mortage-service/mortage-service-action';
import { saveSelectedMortgageData, stopLoading } from '../actions/admin/admin-action';
import { getSelectedPoolMortgageList } from '../actions/admin/mortgage_pool_container';
import Loder from '../Loder/Loders';
import { error } from '../actions/login/loginAction';
import MessageNotification from '../MessageNotification';

class MortgageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentpage: 1,
      limit: 200,
      offset: 0,
      next: props.next,
      prev: props.prev,
      totalValues: props.totalValues,
      totalPages: props.totalPages,
      currentPoolList: []
    };
    this.filteredMortgageArray = [];
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
      window.scrollTo(0, 0);
    } else {
      if (document.getElementById('mortgageListScroll')) {
        document.getElementById('mortgageListScroll').children[0].addEventListener('scroll', this.handleBodyClick);
      }

      this.next(this.state.currentpage, this.state.limit);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageListScroll').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    let scroll = document.getElementById('mortgageList');

    if (scroll && translate) {
      scroll.style.transform = translate;
    }
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
        if (response.address.length === 0) {
          this.props.accountList([]);
          this.props.stopLoading();
        } else {
          const list = response.address;
          this.props.accountList(list, response.total_count);
          this.props.stopLoading();
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
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

  updateMortgage = selectedMortgagedData => {
    this.props.history.push(
      '/edit-property-data/' + selectedMortgagedData.propertyid + '/' + selectedMortgagedData.property_hashcode
    );
  };

  // openPoolDetails = async pool => {
  //   let property = 'property';
  //   await this.props
  //     .getSelectedPoolMortgageList(
  //       this.props.userData.token,
  //       pool.propertyid,
  //       pool.pool_name,
  //       pool.created_date,
  //       property
  //     )
  //     .then(res => {
  //       if (res && res.request && res && res.request.status == 401) {
  //         this.props.history.push('/login');
  //       }
  //     });
  //   this.props.history.push('./current-view');
  // };

  DisplayMortgageList = props => {
    let postal;

    if (props.postalcode && props.postalcode !== '' && props.postalcode.length < 5) {
      let length = props.postalcode.length;
      postal = props.postalcode;
      let res = 5 - length;

      for (let i = 1; i <= res; i++) {
        let a = '0';
        postal = a + postal;
      }
    } else {
      postal = props.postalcode;
    }

    return (
      <tr>
        <td onClick={() => this.updateMortgage(props)}>
          <u style={{ color: 'blue' }} className="cursor-own">
            {props.propertyid}
          </u>
        </td>
        <td>{props.property_hashcode ? props.property_hashcode : null}</td>
        <td>
          {props.address1}, {props.city} {props.state} {postal}
        </td>
        <td className="text-right">{Number(props.first_mortgage_loan_amount).toFixed(2)}</td>
        <td className="text-right">{props.total_swap_balances ? Number(props.total_swap_balances).toFixed(2) : ''}</td>
        <td className="text-right">{props.total_balances ? Number(props.total_balances).toFixed(2) : ''}</td>
        <td className="text-right">
          {props.total_combine_balances ? Number(props.total_combine_balances).toFixed(2) : ''}
        </td>
        <td className="text-right">{props.purchase_price ? Number(props.purchase_price).toFixed(2) : ''}</td>
        <td className="text-right">
          {props.diversified_national_price ? Number(props.diversified_national_price).toFixed(2) : ''}
        </td>
        {/* <td>
          {props.is_bool && props.is_bool !== '0' ? (
            <button className="btn btn-orange" onClick={() => this.openPoolDetails(props)}>
              Pool
            </button>
          ) : null}
        </td> */}
        <td>
          <button className="btn btn-orange" onClick={() => this.updateMortgage(props)}>
            Edit
          </button>
        </td>
      </tr>
    );
  };

  next = (pageno, pageSize) => {
    this.setState({
      isLoading: false
    });
    var data = {
      limit: this.props.limit,
      offset: (pageno - 1) * pageSize
    };

    fetch(getMortgageList, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(data)
    })
      .then(Response => Response.json())
      .then(response => {
        this.setState({
          isLoading: true
        });
        if (response.length === 0) {
          this.props.accountList([]);
          this.props.stopLoading();
        } else {
          const list = response.address;
          let pre;
          let next;
          pre = data.offset >= 200 ? true : false;

          next = response.address.length + data.offset < response.total_count ? true : false;
          this.props.accountList(list, response.total_count, pre, next);
          this.props.stopLoading();

          this.setState({
            currentpage: pageno,
            currentPoolList: response.address
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

  displayNext() {
    return (
      <div className="flex-center" style={{ marginTop: '10px' }}>
        <div className="total-value" />
        <div
          style={{
            backgroundColor: '#fff',
            padding: '5px 5px',
            marginLeft: 'auto',
            marginRight: '10px'
          }}
        >
          Pages :{this.state.currentpage}/{this.props.totalPages}
        </div>

        <ul className="pagination-own list-inline">
          {this.props.prev ? (
            <li onClick={() => this.next(this.state.currentpage - 1, this.state.limit)}>
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          ) : (
            <li className="disabled">
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          )}
          {this.props.next ? (
            <li onClick={() => this.next(this.state.currentpage + 1, this.state.limit)}>
              <i className="fa fa-angle-double-right" />{' '}
            </li>
          ) : (
            <li className="disabled">
              <i className="fa fa-angle-double-right" />
            </li>
          )}
        </ul>
      </div>
    );
  }

  render() {
    const { searchAdminText, searchMortgage } = this.props;
    let { mortgageList } = this.props;
    let List = [];

    if (this.props.searchMortgageList.length > 0 && this.props.isValue) {
      List = this.props.searchMortgageList;
    } else if (this.props.searchMortgageList.length === 0 && this.props.isValue) {
      List = [];
    } else {
      List = this.state.currentPoolList;
    }

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
          <MessageNotification />
          <Scrollbars className="scrollStyle" id="mortgageListScroll" style={{ maxHeight: '80vh' }}>
            {!this.state.isLoading ? <Loder myview={this.state.isLoading} /> : null}
            {List.length > 0 ? (
              <table className="table striped-table-own" style={{ backgroundColor: 'white' }}>
                <thead id="mortgageList" style={{ ...thead }}>
                  <tr>
                    <th>Property Id</th>
                    <th>Hash Code</th>
                    <th>Address</th>
                    <th>F.M. Loan Amount</th>
                    <th>Total Swap Bal.</th>
                    <th>1st Mort. Bal.</th>
                    <th>Combine Bal.</th>
                    <th>Purchase Price</th>
                    <th>Diversified Ntl Price</th>
                    <th />
                  </tr>
                </thead>
                {List.length > 0
                  ? List.map((record, index) => <tbody key={index}>{this.DisplayMortgageList(record)}</tbody>)
                  : null}
              </table>
            ) : this.props.isValue ? (
              <div style={{ color: '#fff' }} className="text-white text-center">
                No Search Data Available
              </div>
            ) : null}
          </Scrollbars>
          {(this.props.next || this.props.prev) && List.length > 0 ? <div>{this.displayNext()} </div> : null}
        </div>
      );
    else {
      return (
        <div className="fullscreen-loader">
          <Loder myview={this.state.isLoading} />
        </div>
      );
    }
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

MortgageList.defaultProps = {
  searchAdminText: '',
  searchMortgage: '',
  accountList: undefined,
  saveSelectedMortgageData: undefined,
  stopLoading: undefined,
  getSelectedPoolMortgageList: undefined,
  isLogin: false,
  userData: {},
  prev: false,
  next: false,
  limit: null,
  searchMortgageList: []
};

MortgageList.propTypes = {
  mortgageList: PropTypes.arrayOf(Object).isRequired,
  searchMortgageList: PropTypes.arrayOf(Object),
  searchAdminText: PropTypes.string,
  searchMortgage: PropTypes.string,
  accountList: PropTypes.func,
  saveSelectedMortgageData: PropTypes.func,
  stopLoading: PropTypes.func,
  getSelectedPoolMortgageList: PropTypes.func,
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  prev: PropTypes.bool,
  next: PropTypes.bool,
  limit: PropTypes.number
};

const mapStateToProps = state => {
  return {
    mortgageList: state.mortService.AccountList,
    searchAdminText: state.admin.searchAdminText,
    searchMortgage: state.admin.searchMortgage,
    mortgageListLoading: state.admin.mortgageListLoading,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    prev: state.mortService.prev,
    next: state.mortService.next,
    limit: state.mortService.limit,
    totalPages: state.mortService.totalPages
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    accountList: (data, total_count, pre, next) => dispatch(OnAccountList(data, total_count, pre, next)),
    saveSelectedMortgageData: (mortgageData, paymentsData, poolId) =>
      dispatch(saveSelectedMortgageData(mortgageData, paymentsData, poolId)),
    stopLoading: () => dispatch(stopLoading()),
    getSelectedPoolMortgageList: (userData, poolId, poolName, data, value) =>
      dispatch(getSelectedPoolMortgageList(userData, poolId, poolName, data, value)),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MortgageList));
