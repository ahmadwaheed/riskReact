import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchMortgage from '../SearchMortgageList';
import MortgageList from '../property/MortgageList';
import Loder from '../Loder/Loders';
import NavigationBar from '../../src/home/NavigationTab';
import { startLoading, stopLoading } from '../actions/admin/admin-action';
import { getMortgageList } from '../ConfigUri';
import { OnAccountList } from '../actions/mortage-service/mortage-service-action';
import { error } from '../actions/login/loginAction';

class MortgageListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      searchList: [],
      isValue: false,
      isLoad: true,
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
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    }
  }

  next = (pageno, pageSize, value) => {
    this.setState({
      isLoading: false
    });
    var data = {
      limit: this.props.limit,
      offset: (pageno - 1) * pageSize,
      searchText: value
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
            searchList: response.address
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

  handleSubmit = value => {
    if (value && value.length > 0) {
      this.setState({
        searchList: [],
        isValue: true,
        isLoad: false
      });
      this.next(1, this.state.limit, value);
    } else {
      this.setState({
        searchList: [],
        isValue: false
      });
    }
  };

  resetInput = () => {
    this.next(this.state.currentpage, 200);

    this.setState({
      isValue: false
    });
  };

  handleChange = data => {
    if (data.length === 0) {
      this.resetInput();
    }
  };

  addPropertyView = () => {
    this.props.history.push('/add-property');
  };

  render() {
    const { isLoading } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              <NavigationBar isMorgageList={true} />
              <div className="col-md-4 pull-right" style={{ marginTop: '20px' }}>
                <SearchMortgage
                  handleSubmit={this.handleSubmit}
                  handleReset={this.resetInput}
                  handleOnchange={this.handleChange}
                />
              </div>
              <div style={{ marginTop: '62px' }}>
                <button className="btn btn-orange" onClick={() => this.addPropertyView()}>
                  Add Property
                </button>
              </div>
              {isLoading ? (
                <div className="fullscreen-loader">
                  <Loder myview={this.state.isLoad} />
                </div>
              ) : null}
              <MortgageList
                isValue={this.state.isValue}
                getNewList={this.handleSubmit}
                searchMortgageList={this.state.searchList}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MortgageListContainer.defaultProps = {
  isMortgageUpdate: false,
  isLoading: true,
  startLoading: undefined,
  searchMortgageList: [],
  userData: {},
  prev: false,
  next: false,
  limit: null
};

MortgageListContainer.protoTypes = {
  isMortgageUpdate: PropTypes.bool,
  isLoading: PropTypes.bool,
  startLoading: PropTypes.func,
  searchMortgageList: PropTypes.arrayOf(Object),
  userData: PropTypes.objectOf(String),
  prev: PropTypes.bool,
  next: PropTypes.bool,
  limit: PropTypes.number
};

const mapStateToProps = state => {
  return {
    isMortgageUpdate: state.admin.isMortgageUpdate,
    isLoading: state.admin.isLoading,
    searchMortgageList: state.admin.searchMortgageList,
    userData: state.login.userData,
    prev: state.mortService.prev,
    next: state.mortService.next,
    limit: state.mortService.limit,
    totalPages: state.mortService.totalPages
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
    accountList: (data, total_count, pre, next) => dispatch(OnAccountList(data, total_count, pre, next)),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MortgageListContainer);
