import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAssociateUserList } from '../actions/admin/mortgage_pool_container';
import { addProperty } from '../actions/borrower/borrower-action';
import NavigationBar from '../home/NavigationTab';
import Loader from '../Loder/Loders';
import MessageNotification from '../MessageNotification';
import SearchMortgage from '../SearchMortgageList';
import { Scrollbars } from 'react-custom-scrollbars';

class PropertAssociateAssign extends React.Component {
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
      clearText: false,
      property: {}
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

      this.loadUserList(this.state.currentpage, this.state.limit, this.state.searchText);
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

  loadUserList = (pageno, pageSize, value, check) => {
    this.setState({
      isLoader: false
    });
    var data = {
      limit: this.state.limit,
      offset: (pageno - 1) * pageSize
    };

    let id = this.props.match.params.id;

    getAssociateUserList(this.props.userData.token, id, data, value).then(res => {
      if (res && res.Users) {
        let pre;
        let next;
        pre = data.offset >= 200 ? true : false;
        next = res.Users.length + data.offset < res.totalcount ? true : false;

        this.setState({
          userData: res.Users,
          isLoader: true,
          currentpage: pageno,
          prev: pre,
          next: next,
          totalPages: Math.ceil(res.totalcount / this.state.limit)
        });
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }

      if (res.property) {
        this.setState({
          property: res.property
        });
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
            <li onClick={() => this.loadUserList(this.state.currentpage - 1, this.state.limit, this.state.searchText)}>
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
            <li onClick={() => this.loadUserList(this.state.currentpage + 1, this.state.limit, this.state.searchText)}>
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
    this.loadUserList(1, 200, value);
  };

  resetInput = () => {
    this.setState({
      searchText: ''
    });
    this.loadUserList(1, 200, '');
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

    addProperty(this.props.userData.token, hashcode, data).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.loadUserList(1, 200, '');

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
    let id = this.props.match.params.id;
    let hashcode = this.props.match.params.hashcode;
    const { property } = this.state;

    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar id={id} hashcode={hashcode} isAssociate={true} isMorgageList={true} />

                <div className="col-md-4 pull-right">
                  {' '}
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
                <h2 className="col-xs-12">Associate Homeowners with Property </h2>
                <div className="col-xs-12" style={{ paddingLeft: '15px' }}>
                  {property.propertyid ? ' Property Id :' + property.propertyid : null}
                </div>
                <div className="col-xs-12" style={{ paddingLeft: '15px' }}>
                  {property.address1
                    ? ' Address :' +
                      property.address1 +
                      ',' +
                      property.city +
                      ',' +
                      property.state +
                      ',' +
                      property.postalcode
                    : null}
                </div>
                <div className="col-xs-12 table-responsive" style={{ marginTop: '50px' }}>
                  <Scrollbars
                    id="userDataElement"
                    className="scrollStyle"
                    style={{ maxHeight: '50vh', minHeight: '50vh' }}
                  >
                    {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                    <table className="table table-borderless">
                      <thead id="userData" style={{ backgroundColor: '#fff' }}>
                        <tr>
                          <th className="text-center">Name</th>
                          <th className="text-center">Email</th>
                          <th className="text-center">Phone Number</th>
                          <th className="text-center">Action</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.userData &&
                          this.state.userData.length > 0 &&
                          this.state.userData.map((data, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                {data.first_name} {data.last_name}
                              </td>
                              <td className="text-center">{data.email}</td>
                              <td className="text-center">{data.phonenumber ? data.phonenumber : null}</td>
                              <td className="text-center">
                                <button className="btn orange-bg btn-own" onClick={() => this.AssignUser(data)}>
                                  Associate
                                </button>
                              </td>
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

PropertAssociateAssign.defaultProps = {
  getAssociateUserList: undefined,
  userData: {},
  addProperty: undefined
};

PropertAssociateAssign.propTypes = {
  getAssociateUserList: PropTypes.func,
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
  { getAssociateUserList, addProperty }
)(withRouter(PropertAssociateAssign));
