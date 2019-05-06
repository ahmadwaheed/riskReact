import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getLogsData } from './actions/admin/mortgage_pool_container';
import { addProperty } from './actions/borrower/borrower-action';
import NavigationBar from './home/NavigationTab';
import Loader from './Loder/Loders';
import MessageNotification from './MessageNotification';
import SearchMortgage from './SearchMortgageList';
import { Scrollbars } from 'react-custom-scrollbars';

class LogComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      userData: [],
      companyData: [],
      currentpage: 1,
      limit: 200,
      offset: 0,
      next: false,
      prev: false,
      totalValues: 0,
      totalPages: 0,
      errors: {},
      checked: false,
      searchText: '',
      clearText: false
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      if (document.getElementById('userDataElement')) {
        document.getElementById('userDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
      }

      this.loadLogs(this.state.currentpage, this.state.limit, this.state.searchText);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('userDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    let scroll = document.getElementById('userData');

    if (scroll && translate) {
      scroll.style.transform = translate;
    }
  };

  loadLogs = (pageno, pageSize, value) => {
    this.setState({
      isLoader: false
    });
    var data = {
      limit: this.state.limit,
      offset: (pageno - 1) * pageSize
    };

    getLogsData(this.props.userData.token, data, value).then(res => {
      if (res && res.activity) {
        let pre;
        let next;
        pre = data.offset >= 200 ? true : false;
        next = res.activity.length + data.offset < res.totalCount ? true : false;

        this.setState({
          userData: res.activity,
          isLoader: true,
          currentpage: pageno,
          prev: pre,
          next: next,
          totalPages: Math.ceil(res.totalCount / this.state.limit)
        });
      } else if (res && res.request && res && res.request.status === 401) {
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
          Pages :{this.state.currentpage}/{this.state.totalPages}
        </div>
        <ul className="pagination-own list-inline">
          {this.state.prev ? (
            <li onClick={() => this.loadLogs(this.state.currentpage - 1, this.state.limit, this.state.searchText)}>
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          ) : (
            <li className="disabled">
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          )}
          {this.state.next ? (
            <li onClick={() => this.loadLogs(this.state.currentpage + 1, this.state.limit, this.state.searchText)}>
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

  handleSubmitSearch = value => {
    this.setState({
      searchText: value,
      clearText: false
    });
    this.loadLogs(1, 200, value);
  };

  resetInput = () => {
    this.setState({
      searchText: ''
    });
    this.loadLogs(1, 200, '');
  };

  handleChangeSeach = value => {
    if (value === '') {
      this.resetInput();
    }
  };

  AssignUser = data => {
    this.setState({
      isLoader: false
    });
    let hashcode = this.props.match.params.hashcode;

    addProperty(this.props.userData.token, hashcode, data.id).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.loadLogs(1, 200, '');

        this.setState({
          clearText: true
        });

        this.setState({
          clearText: false
        });
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  render() {
    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isLog={true} />
                <div className="col-md-4 pull-right" style={{ marginTop: '20px' }}>
                  <SearchMortgage
                    handleSubmit={this.handleSubmitSearch}
                    clearText={this.state.clearText}
                    handleReset={this.resetInput}
                    handleOnchange={this.handleChangeSeach}
                  />
                </div>
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12" />
                <div className="col-xs-12 table-responsive">
                  <Scrollbars
                    id="userDataElement"
                    className="scrollStyle"
                    style={{ maxHeight: '50vh', minHeight: '50vh' }}
                  >
                    {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                    <table className="table table-borderless">
                      <thead id="userData" style={{ backgroundColor: '#fff' }}>
                        <tr>
                          <th className="text-center">Action Performaed</th>
                          <th className="text-center">Description</th>
                          <th className="text-center">Date</th>
                          <th className="text-center">Ip address</th>
                          <th className="text-center">User Email</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.userData &&
                          this.state.userData.length > 0 &&
                          this.state.userData.map((data, index) => (
                            <tr key={index}>
                              <td className="text-center">{data.actionperformed ? data.actionperformed : null}</td>
                              <td className="text-center">{data.actiondescription ? data.actiondescription : null}</td>
                              <td className="text-center">
                                {data.auditdateandtime ? moment(data.auditdateandtime).format('MM/DD/YYYY') : null}
                              </td>
                              <td className="text-center">{data.ipaddress ? data.ipaddress : null}</td>
                              <td className="text-center">{data.useremail ? data.useremail : null}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                  {(this.state.next || this.state.prev) && this.state.userData.length > 0 ? (
                    <div>{this.displayNext()} </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LogComponent.defaultProps = {
  getLogsData: undefined,
  userData: {},
  addProperty: undefined
};

LogComponent.propTypes = {
  getLogsData: PropTypes.func,
  userData: PropTypes.objectOf(String),
  addProperty: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getLogsData, addProperty }
)(withRouter(LogComponent));
