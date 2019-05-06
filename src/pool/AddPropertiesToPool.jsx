import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getPropertiesForPool, addMortgageData } from '../actions/admin/mortgage_pool_container';
import { addProperty, getExitDate } from '../actions/borrower/borrower-action';
import Loader from '../Loder/Loders';
import SearchMortgage from '../SearchMortgageList';
import Modal from 'react-responsive-modal';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';

class AddPropertyToPool extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      propertiesData: [],
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
      isAddModal: false,
      assignDate: new Date(),
      proprtyId: '',
      minDate: new Date()
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    }

    if (document.getElementById('userDataElement')) {
      document.getElementById('userDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
    }

    this.loadProperties(this.state.currentpage, this.state.limit, this.state.searchText);
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

  loadProperties = (pageno, pageSize, value) => {
    this.setState({
      isLoader: false
    });
    var data = {
      limit: this.state.limit,
      offset: (pageno - 1) * pageSize
    };

    getPropertiesForPool(this.props.userData.token, data, value, this.props.poolId).then(res => {
      if (res && res.property) {
        let pre;
        let next;
        pre = data.offset >= 200 ? true : false;

        next = res.property.length + data.offset < res.total_count ? true : false;

        this.setState({
          propertiesData: res.property,
          isLoader: true,
          currentpage: pageno,
          prev: pre,
          next: next,
          totalPages: Math.ceil(res.total_count / this.state.limit)
        });
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isLoader: true
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
            <li
              onClick={() => this.loadProperties(this.state.currentpage - 1, this.state.limit, this.state.searchText)}
            >
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
            <li
              onClick={() => this.loadProperties(this.state.currentpage + 1, this.state.limit, this.state.searchText)}
            >
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
    this.loadProperties(1, 200, value);
  };

  resetInput = () => {
    this.setState({
      searchText: ''
    });
    this.loadProperties(1, 200, '');
  };

  handleChangeSeach = value => {
    if (value === '') {
      this.resetInput();
    }
  };

  associateProperties = () => {
    this.setState({
      isLoader: false,
      isAddModal: false
    });
    const date_added = this.state.assignDate;
    const pool_name = this.props.poolName;
    const pool_id = this.props.poolId;
    const mortgage_id = this.state.proprtyId;
    let data = {
      mortgage_id,
      pool_name,
      pool_id,
      date_added
    };

    addMortgageData(data, this.props.userData.token).then(res => {
      if (res && res.success) {
        this.props.onSuccess();

        this.setState({
          assignDate: new Date(),
          proprtyId: '',
          isLoader: true
        });
        this.loadProperties(1, 200, '');
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  openAddModal = data => {
    getExitDate(this.props.userData.token, this.props.poolId, data.propertyid).then(res => {
      if (res) {
        this.setState({
          isAddModal: true,
          proprtyId: data.propertyid,
          minDate: null
        });
        if (res.exit_date && res.exit_date !== '') {
          this.setState({
            minDate: new Date(res.exit_date)
          });
        }
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  closeAddModal = () => {
    this.setState({
      isAddModal: false,
      proprtyId: '',
      assignDate: new Date(),
      isLoader: true
    });
  };

  handleChange = date => {
    this.setState({
      assignDate: new Date(date)
    });
  };

  render() {
    return (
      <div>
        {/* <MessageNotification /> */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                {/* <NavigationBar  isPool={true} />        */}
                <div className="col-md-6 pull-right">
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
                          <th className="text-center">Property Id</th>
                          <th className="text-left">Address</th>
                          <th className="text-left">Hashode</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.propertiesData &&
                          this.state.propertiesData.length > 0 &&
                          this.state.propertiesData.map((data, index) => (
                            <tr key={index}>
                              <td className="text-center">{data.propertyid ? data.propertyid : null}</td>
                              <td className="text-center">
                                <div className="text-left">{data.address1 ? data.address1 : null}</div>
                                <div className="text-left">
                                  {data.city ? data.city + ', ' + data.state + ' ' + data.postalcode : null}
                                </div>
                              </td>
                              <td className="text-left">{data.property_hashcode ? data.property_hashcode : null}</td>
                              <td className="text-center">
                                <button className="btn orange-bg btn-own" onClick={() => this.openAddModal(data)}>
                                  Associate
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                  {(this.state.next || this.state.prev) && this.state.propertiesData.length > 0 ? (
                    <div>{this.displayNext()} </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal open={this.state.isAddModal} classNames={{ modal: 'custom-modal' }} onClose={this.closeAddModal} center>
          <h2 className="modal-header">Add property to pool</h2>
          <div className="modal-body">
            <div className="row form-group pad-down pad-half">
              <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '5px', paddingBottom: '6px' }}>
                Start Date:
              </label>
              <div className="col-xs-9 pad-half" style={{ marginBottom: '125px' }}>
                <DatePicker
                  className="custom-datepicker form-control"
                  dateFormat="MM/DD/YYYY"
                  showMonthDropdown={true}
                  showYearDropdown={true}
                  selected={moment(this.state.assignDate)}
                  onChange={this.handleChange}
                  dropdownMode="select"
                  minDate={this.state.minDate && this.state.minDate !== '' ? moment(this.state.minDate) : null}
                  peekNextMonth
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3 col-xs-offset-6">
                <button onClick={() => this.associateProperties()} className="btn btn-block orange-bg btn-own">
                  Associate
                </button>
              </div>
              <div className="col-xs-3 text-right">
                <button onClick={this.closeAddModal} className="btn btn-block orange-bg btn-own">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

AddPropertyToPool.defaultProps = {
  getPropertiesForPool: undefined,
  userData: {},
  addProperty: undefined,
  addMortgageData: undefined,
  getExitDate: undefined
};

AddPropertyToPool.propTypes = {
  getPropertiesForPool: PropTypes.func,
  userData: PropTypes.objectOf(String),
  addProperty: PropTypes.func,
  addMortgageData: PropTypes.func,
  getExitDate: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getPropertiesForPool, addProperty, addMortgageData, getExitDate }
)(withRouter(AddPropertyToPool));
