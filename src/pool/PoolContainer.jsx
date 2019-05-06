import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/admin/admin-action';
import {
  storeMortgagePools,
  savePoolData,
  updateFee,
  getUserInProperty,
  deleteMortgagePools,
  addMortgageData,
  removeMortgageData,
  getSelectedPoolMortgageList,
  getUserInPool,
  getPoolHistoryToExport,
  noPoolHistoryExportError
} from '../actions/admin/mortgage_pool_container';
import ReactAutocomplete from 'react-autocomplete';
import MessageNotification from '../MessageNotification';
import NavigationBar from '../../src/home/NavigationTab';
import Loder from '../Loder/Loders';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddPropertyToPool from '../pool/AddPropertiesToPool';
import PoolList from '../pool/PoolList';
import PoolAddEditModal from '../pool/PoolAddEditModal';
import PropertInPool from './PropertyInPool';
import PoolUpdationFeeModal from './PoolUpdationFeeModal';
import DeletePoolModal from './DeletePoolModal';
let check = false;

class MortgagePoolContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      isDeletedOpen: false,
      poolName: '',
      modalHeader: '',
      isMortgageOpen: false,
      poolID: '',
      selectedMortgage: '',
      openDrop: '',
      value: '',
      validSubmit: false,
      removalComment: '',
      removedMortgageId: undefined,
      poolList: [],
      assignDate: new Date(),
      exitDate: new Date(),
      description: '',
      isRemoveMortgage: false,
      isLoading: false,
      subscriptionMonthlyFee: '',
      subscriptionAnnualyFee: '',
      isMonthly: false,
      isAnnualy: false,
      isUserModal: false,
      userList: [],
      checked: false,
      isClass: false,
      isFee: false,
      userListInProperty: [],
      selectedUser: '',
      userId: undefined,
      isAddModal: false,
      poolHistToExport: {}
    };
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.setState({
        userData: data
      });
      this.loadPoolList(check);
    }
  }

  loadPoolList = checked => {
    storeMortgagePools(this.props.userData.token, checked).then(res => {
      if (check) {
        this.setState({
          isClass: true
        });
      } else {
        this.setState({
          isClass: false
        });
      }

      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          poolList: res,
          isLoading: true
        });
      } else {
        this.setState({
          isLoading: true
        });
      }
    });
  };

  openAddNewModal = () => {
    this.setState({
      open: true,
      modalHeader: 'Add New Pool',
      poolName: '',
      description: '',
      poolID: '',
      isRemoveMortgage: false,
      subscriptionMonthlyFee: '',
      subscriptionAnnualyFee: ''
    });
  };

  openEditPoolModal = async pool => {
    let description;

    if (pool.pool_description === null) {
      description = '';
    } else {
      description = pool.pool_description;
    }

    this.setState({
      open: true,
      modalHeader: 'Edit Pool',
      poolName: pool.pool_name,
      description: description,
      poolID: pool.poolid,
      isRemoveMortgage: false,
      subscriptionMonthlyFee: pool.subscription_monthly_fee,
      subscriptionAnnualyFee: pool.subscription_annual_basis_point_fee
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      poolName: '',
      description: '',
      poolID: '',
      subscriptionMonthlyFee: '',
      subscriptionAnnualyFee: '',
      removalComment: '',
      userListInProperty: [],
      selectedUser: ''
    });
  };

  openDeletePoolModal = pool => {
    this.setState({
      isDeletedOpen: true,
      modalHeader: 'Archive Pool',
      poolID: pool.poolid
    });
  };

  onDeleteCloseModal = () => {
    this.setState({
      isDeletedOpen: false,
      poolID: '',
      removalComment: '',
      userListInProperty: [],
      selectedUser: ''
    });
  };

  submitPool = () => {
    this.onCloseModal();

    savePoolData(
      this.state.poolName,
      this.props.userData,
      this.state.description,
      this.state.poolID,
      this.state.subscriptionMonthlyFee,
      this.state.subscriptionAnnualyFee
    ).then(res => {
      if (res.success) {
        this.setState({
          poolName: '',
          description: '',
          poolID: '',
          subscriptionMonthlyFee: '',
          subscriptionAnnualyFee: ''
        });
        this.loadPoolList(check);
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });
  };

  closeModal = () => {
    this.setState({
      poolName: '',
      removalComment: '',
      userListInProperty: [],
      selectedUser: ''
    });
    this.onCloseModal();
  };

  onChangePool = event => {
    this.setState({
      poolName: event.target.value
    });
  };

  addMortgageInPool = pool => {
    this.setState({
      isAddModal: true,
      poolID: pool.poolid,
      poolName: pool.pool_name
    });
  };

  closeAddModal = () => {
    this.setState({
      isAddModal: false,
      poolID: '',
      poolName: ''
    });
  };

  successAssociate = () => {
    this.loadPoolList(check);
  };

  closeMortgageModal = () => {
    this.setState({
      isMortgageOpen: false,
      poolName: '',
      value: '',
      validSubmit: false,
      removalComment: '',
      selectedUser: '',
      userListInProperty: []
    });
  };

  editPoolData = async pool => {
    let description;

    if (pool.pool_description === null) {
      description = '';
    } else {
      description = pool.pool_description;
    }

    let data = 'pool';

    await this.props.getSelectedPoolMortgageList(this.props.userData.token, pool.poolid, '', '', data).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });

    this.setState({
      modalHeader: 'Remove Property',
      open: true,
      poolName: pool.pool_name,
      poolID: pool.poolid,
      removedMortgage: undefined,
      isRemoveValid: false,
      description: description,
      subscriptionMonthlyFee: pool.subscription_monthly_fee,
      subscriptionAnnualyFee: pool.subscription_annual_basis_point_fee,
      isRemoveMortgage: true
    });
  };

  deletePool = () => {
    let isDelete = true;

    if (check === false) {
      isDelete = true;
    } else {
      isDelete = false;
    }

    deleteMortgagePools(this.props.userData.token, this.state.poolID, isDelete).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }

      this.setState({
        poolID: ''
      });
      this.onDeleteCloseModal();
      this.loadPoolList(check);
    });
  };

  viewDetails = poolId => {
    this.props.getPoolMortgages(poolId);
  };

  addMortgage = (mortgage_id, pool_name, pool_id, user_id) => {
    const date_added = this.state.assignDate;
    let data = {
      mortgage_id,
      pool_name,
      pool_id,
      date_added,
      user_id
    };

    addMortgageData(data, this.props.userData.token).then(res => {
      if (res && res.success) {
        this.setState({
          isMortgageOpen: false,
          poolName: '',
          validSubmit: false,
          value: '',
          assignDate: new Date(),
          userListInProperty: [],
          selectedUser: ''
        });
        this.loadPoolList(check);
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });
  };

  selectMorgage = value => {
    this.setState({
      selectedMortgage: value,
      openDrop: ''
    });
  };

  openDropdown = () => {
    this.setState({
      openDrop: 'open'
    });
  };

  autoChange = e => {
    this.setState({
      value: e.target.value,
      validSubmit: false,
      isRemoveValid: false
    });
  };

  mortageSelected = value => {
    this.setState({ value, validSubmit: true, isLoading: false });

    getUserInProperty(this.props.userData.token, value).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res && res.length > 0) {
        this.setState({
          userListInProperty: res,
          isLoading: true,
          validSubmit: false
        });
      } else {
        this.setState({
          isLoading: true
        });
      }
    });
  };

  selectUser = event => {
    this.setState({
      selectedUser: event.target.value,
      validSubmit: true
    });
  };

  viewPoolDetail = async pool => {
    let data = 'pool';

    await this.props
      .getSelectedPoolMortgageList(this.props.userData.token, pool.poolid, pool.pool_name, pool.created_date, data)
      .then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        }
      });
    this.props.history.push('./current-view');
  };

  removeMortgageFromPool = (poolID, removalComment, removedMortgageId, userId) => {
    const date_removed = this.state.exitDate;
    let data = {
      mortgage_id: removedMortgageId,
      pool_id: poolID,
      date_removed,
      reason_for_removal: removalComment
    };

    removeMortgageData(data, this.props.userData.token).then(res => {
      if (res.success) {
        this.setState({
          isMortgageOpen: false,
          poolName: '',
          validSubmit: false,
          value: '',
          isRemoveValid: false,
          open: false,
          removalComment: '',
          poolID: undefined,
          exitDate: new Date()
        });
        this.loadPoolList(check);
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });
  };

  gridMortageList = value => {
    const { thead } = styles;

    return (
      <div className="table-responsive max-height-table" style={{ maxHeight: '15vh', border: '1px solid #ddd' }}>
        <table className="table striped-table-own popup-table" style={{ backgroundColor: 'white' }}>
          <thead id="mortgageList" style={{ ...thead }}>
            <tr>
              {value === 'edit' ? <th /> : null}
              <th>Property Id</th>
              {/* <th>Homeowner Name</th> */}
              <th style={{ width: '160px', minWidth: '160px' }}>Address</th>
              {/* <th>FM Loans Amount</th>
              <th>Swap Balance</th>
              <th>FM Bal</th>
              <th>Combine Bal</th> */}
            </tr>
          </thead>
          {this.props.selectedPoolMortgageList.map((item, index) => (
            <tbody key={index}>{this.DisplayMortgageList(item, value)}</tbody>
          ))}
        </table>
      </div>
    );
  };

  editMortage = (value, user_id) => {
    this.setState({
      value,
      removedMortgageId: value,
      isRemoveValid: true,
      userId: user_id
    });
  };

  DisplayMortgageList = (props, value) => {
    return (
      <tr>
        {value === 'edit' ? (
          <td>
            <input
              type="radio"
              name="service"
              value={props.propertyid}
              onClick={() => this.editMortage(props.propertyid, props.user_id)}
            />
          </td>
        ) : null}
        <td>{props.propertyid ? Number(props.propertyid) : ''}</td>
        {/* <td>{props.first_name}{' '}{props.last_name}</td> */}
        <td>{props.address1}</td>
        {/* <td className="text-right">{Number(props.first_mortgage_loan_amount).toFixed(2)}</td>
        <td className="text-right">{props.total_swap_balances ? Number(props.total_swap_balances).toFixed(2) : ''}</td>
        <td className="text-right">{props.total_balances ? Number(props.total_balances).toFixed(2) : ''}</td>
        <td className="text-right">{props.total_combine_balances ? Number(props.total_combine_balances).toFixed(2) : ''}</td> */}
      </tr>
    );
  };

  viewPoolProperties = pool => {
    let id = pool.poolid;
    this.props.history.push('pool-data/' + id);
  };

  goToPortfolioProperties = () => {
    this.props.history.push('portfolio_performance');
  };

  handleChange = date => {
    this.setState({
      assignDate: new Date(date)
    });
  };

  handleExitChange = date => {
    this.setState({
      exitDate: new Date(date)
    });
  };

  handleChangeDescription = e => {
    this.setState({
      description: e.target.value
    });
  };

  onchangeMonthlyFee = e => {
    const re = new RegExp(/^-?\d+\.?\d*$/);

    // if value is not blank, then test the regex
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({
        subscriptionMonthlyFee: e.target.value,
        isMonthly: false
      });
    } else {
      this.setState({
        isMonthly: true
      });
    }
  };

  onChangeAnnualyFee = e => {
    const re = new RegExp(/^-?\d+\.?\d*$/);

    // if value is not blank, then test the regex
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({
        subscriptionAnnualyFee: e.target.value,
        isAnnualy: false
      });
    } else {
      this.setState({
        isAnnualy: true
      });
    }
  };

  openReport = pool => {
    this.setState({
      isLoading: false
    });

    getUserInPool(this.props.userData.token, pool.poolid).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }

      this.setState({
        isUserModal: true,
        isLoading: true,
        userList: res,
        poolID: pool.poolid
      });
    });
  };

  exportPoolHistory = pool => {
    getPoolHistoryToExport(this.props.userData.token, pool.poolid).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res.data.propertyData.length > 0) {
        this.setState({
          poolHistToExport: res.data
        });
        this.prepareDataToExport(res.data);
      } else if (res.data.propertyData.length === 0) {
        noPoolHistoryExportError();
      }

      console.log('response ', res.data);
    });
  };

  prepareDataToExport = data => {
    let periods = data.period;
    let propertyDatas = data.propertyData;
    let csvData = [];
    let csvHeader = [{ label: 'Period', key: 'cell.period' }];

    propertyDatas.forEach((element, index) => {
      let poolProp = element.pool_property.mortgage_id;
      csvHeader.push({ label: poolProp, key: 'cell.swapBalance-' + (index + 1) });
    });

    periods.forEach(period => {
      let cell = {
        period: period.quarter + '/' + period.year
      };

      propertyDatas.forEach((propertyData, propertyIndex) => {
        propertyData.hpiData.forEach((hpi, index) => {
          let matchFound = false;
          let swapbalance = 0;

          if (period.quarter === hpi.qtr && period.year === hpi.year) {
            matchFound = true;
            swapbalance = hpi.swapbalance;
          }

          if (matchFound) {
            cell['swapBalance-' + (propertyIndex + 1)] = swapbalance;
          } else {
            cell['swapBalance-' + (propertyIndex + 1)] = '';
          }
        });
      });
      csvData.push(cell);
    });
    let poolHistToExport = {
      header: csvHeader,
      data: csvData
    };

    this.setState({
      poolHistToExport: poolHistToExport
    });
  };

  closeUserModal = () => {
    this.setState({
      isUserModal: false,
      removalComment: '',
      userListInProperty: [],
      selectedUser: '',
      poolID: ''
    });
  };

  goToUserReport = data => {
    this.setState({
      isLoading: true,
      isUserModal: false
    });

    this.props.history.push('/user-payment/' + data.propertyid + '/' + this.state.poolID);
  };

  handleCheck = () => {
    check = !check;
    this.setState({ checked: check });
    if (check) {
      this.loadPoolList(check);
    } else {
      this.loadPoolList(check);
    }
  };

  openFeeModal = pool => {
    this.setState({
      isFee: true,
      subscriptionMonthlyFee: pool.subscription_monthly_fee,
      subscriptionAnnualyFee: pool.subscription_annual_basis_point_fee,
      poolID: pool.poolid
    });
  };

  onFeeClose = () => {
    this.setState({
      isFee: false,
      subscriptionMonthlyFee: '',
      subscriptionAnnualyFee: '',
      poolID: '',
      removalComment: '',
      userListInProperty: [],
      selectedUser: ''
    });
  };

  updateFee = () => {
    updateFee(
      this.props.userData,
      this.state.poolID,
      this.state.subscriptionMonthlyFee,
      this.state.subscriptionAnnualyFee
    ).then(res => {
      if (res.message) {
        this.setState({
          poolName: '',
          description: '',
          poolID: '',
          subscriptionMonthlyFee: '',
          subscriptionAnnualyFee: ''
        });
        this.onFeeClose();
        this.loadPoolList(check);
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });
  };

  onChangeComment = event => {
    this.setState({ removalComment: event.target.value });
  };

  render() {
    const isEditPool = this.state.modalHeader === 'Remove Property' ? true : false;

    if (this.state.poolList) {
      return (
        <div>
          <MessageNotification />
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 pad-left-right-large">
                <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                  <NavigationBar isPools={true} />
                </div>
                <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                  {!this.state.isLoading ? (
                    <div className="fullscreen-loader">
                      <Loder myview={this.state.isLoading} />
                    </div>
                  ) : null}
                  <div className="row" style={{ marginBottom: '10px' }}>
                    <div className="text-left col-xs-6">
                      <input
                        style={{
                          width: '1em',
                          height: '1em',
                          fontSize: '21px',
                          marginRight: '10px'
                        }}
                        type="checkbox"
                        onChange={() => this.handleCheck()}
                        checked={this.state.checked}
                      />
                      <span style={{ verticalAlign: 'top', fontSize: '22px' }}>Archive Pool</span>
                    </div>
                    {!this.state.checked ? (
                      <div className="text-right col-xs-6">
                        <button className="btn orange-bg btn-own" onClick={() => this.openAddNewModal()}>
                          Add New Pool
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {this.state.poolList.length > 0 ? (
                    <PoolList
                      poolList={this.state.poolList}
                      viewPoolProperties={this.viewPoolProperties}
                      addMortgageInPool={this.addMortgageInPool}
                      viewPoolDetail={this.viewPoolDetail}
                      editPoolData={this.editPoolData}
                      openFeeModal={this.openFeeModal}
                      openDeletePoolModal={this.openDeletePoolModal}
                      openEditPoolModal={this.openEditPoolModal}
                      openReport={this.openReport}
                      exportPoolHistory={this.exportPoolHistory}
                      checked={this.state.checked}
                      isClass={this.state.isClass}
                    />
                  ) : (
                    <div className="col-xs-12 table-responsive text-center">No pool archived.</div>
                  )}
                  <PoolAddEditModal
                    open={this.state.open}
                    modalHeader={this.state.modalHeader}
                    poolName={this.state.poolName}
                    isEditPool={isEditPool}
                    isRemoveMortgage={this.state.isRemoveMortgage}
                    description={this.state.description}
                    handleChangeDescription={this.handleChangeDescription}
                    onChangePool={this.onChangePool}
                    isMonthly={this.state.isMonthly}
                    subscriptionMonthlyFee={this.state.subscriptionMonthlyFee}
                    onchangeMonthlyFee={this.onchangeMonthlyFee}
                    onChangeAnnualyFee={this.onChangeAnnualyFee}
                    subscriptionAnnualyFee={this.state.subscriptionAnnualyFee}
                    selectedPoolMortgageList={this.props.selectedPoolMortgageList}
                    editMortage={this.editMortage}
                    removalComment={this.state.removalComment}
                    onChangeComment={this.onChangeComment}
                    exitDate={this.state.exitDate}
                    handleExitChange={this.handleExitChange}
                    isRemoveValid={this.state.isRemoveValid}
                    submitPool={this.submitPool}
                    isAnnualy={this.state.isAnnualy}
                    poolID={this.state.poolID}
                    userId={this.state.userId}
                    closeModal={this.closeModal}
                    onCloseModal={this.onCloseModal}
                    removeMortgageFromPool={this.removeMortgageFromPool}
                    removedMortgageId={this.state.removedMortgageId}
                  />
                  <DeletePoolModal
                    isDeletedOpen={this.state.isDeletedOpen}
                    onDeleteCloseModal={this.onDeleteCloseModal}
                    checked={this.state.checked}
                    deletePool={this.deletePool}
                  />
                  <Modal
                    open={this.state.isMortgageOpen}
                    classNames={{ modal: 'custom-modal editor w-100' }}
                    onClose={this.closeMortgageModal}
                    center
                  >
                    <h2 className="modal-header">Add Property to Pool</h2>
                    <div className="modal-body" style={{ paddingBottom: '30px' }}>
                      <div className="fullscreen-loader">
                        <Loder myview={this.state.isLoading} />
                      </div>
                      <div className="row form-group">
                        <label htmlFor="" className="col-xs-2" style={{ paddingTop: '7px' }}>
                          Pool Name :
                        </label>
                        <div className="col-xs-10">
                          <input
                            name="pool-name"
                            placeholder="Pool Name"
                            disabled
                            defaultValue={this.state.poolName}
                            onChange={event => this.onChangePool(event)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="row form-group pad-down">
                        {this.props.selectedPoolMortgageList.length > 0 ? (
                          <label htmlFor="" className="col-xs-3" style={{ paddingTop: '11px', marginBottom: '14px' }}>
                            Properties Info:
                          </label>
                        ) : null}
                        {this.props.selectedPoolMortgageList.length > 0 ? (
                          <div className="col-xs-12">
                            {this.props.selectedPoolMortgageList.length > 0 ? (
                              this.gridMortageList('add')
                            ) : (
                              <div className="col-xs-10 col-xs-offset-2" style={{ marginTop: '-35px' }}>
                                No Property in Pool
                              </div>
                            )}
                          </div>
                        ) : null}
                        <div className="col-xs-12 nopad" style={{ minHeight: '285px' }}>
                          <div className="col-xs-12 nopad pad-up">
                            <label htmlFor="" className="col-xs-2" style={{ paddingTop: '7px' }}>
                              Property :
                            </label>
                            <div className="col-xs-10 select-class" style={{ paddingBottom: '30px' }}>
                              {this.props.MortgageDropList.length > 0 ? (
                                <ReactAutocomplete
                                  className="input-dropdown"
                                  items={this.props.MortgageDropList}
                                  shouldItemRender={(item, value) => (item.id || '').toString().indexOf(value) > -1}
                                  getItemValue={item => item.id.toString()}
                                  renderItem={(item, highlighted) => (
                                    <div
                                      className="select-input-dropdown"
                                      key={item.id || ''}
                                      style={{
                                        backgroundColor: highlighted ? '#eee' : 'transparent',
                                        padding: '0 10px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {item.id}
                                    </div>
                                  )}
                                  value={this.state.value}
                                  onChange={e => this.autoChange(e)}
                                  onSelect={value => this.mortageSelected(value)}
                                />
                              ) : (
                                <div>No Property Available</div>
                              )}
                            </div>
                          </div>
                          {this.state.userListInProperty.length > 0 ? (
                            <div className="col-xs-12 nopad">
                              <label htmlFor="" className="col-xs-2" style={{ paddingTop: '7px' }}>
                                User :
                              </label>
                              <div className="col-xs-10 select-class" style={{ paddingBottom: '30px' }}>
                                <select
                                  className="form-control"
                                  value={this.state.selectedUser || ''}
                                  onChange={e => this.selectUser(e)}
                                >
                                  <option disabled value="">
                                    Select User
                                  </option>
                                  {this.state.userListInProperty && this.state.userListInProperty.length > 0
                                    ? this.state.userListInProperty.map((com, index) => (
                                        <option key={index + 'opt'} value={com.user_id}>
                                          {com.first_name} {com.last_name}
                                        </option>
                                      ))
                                    : null}
                                </select>
                              </div>
                            </div>
                          ) : null}
                          <div className="form-group col-xs-12 nopad top-calender">
                            <label
                              htmlFor=""
                              className="col-xs-2"
                              style={{
                                paddingTop: '5px',
                                paddingBottom: '6px'
                              }}
                            >
                              Assign Date:
                            </label>
                            <div className="col-xs-9" style={{ marginBottom: '90px' }}>
                              <DatePicker
                                className="custom-datepicker form-control"
                                dateFormat="MM/DD/YYYY"
                                showMonthDropdown={true}
                                showYearDropdown={true}
                                selected={moment(this.state.assignDate)}
                                onChange={this.handleChange}
                                dropdownMode="select"
                                peekNextMonth
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {!this.state.validSubmit ? <span>Please Select Property and user to add in a pool</span> : null}
                      <div className="row">
                        <div className="col-xs-12 text-right">
                          <button
                            onClick={() =>
                              this.addMortgage(
                                this.state.value,
                                this.state.poolName,
                                this.state.poolID,
                                this.state.selectedUser
                              )
                            }
                            className="btn orange-bg btn-own margin-right"
                            disabled={!this.state.validSubmit}
                          >
                            Submit
                          </button>

                          <button onClick={this.closeMortgageModal} className="btn orange-bg btn-own">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <PropertInPool
                    isUserModal={this.state.isUserModal}
                    closeUserModal={this.closeUserModal}
                    userList={this.state.userList}
                    goToUserReport={this.goToUserReport}
                  />
                  <PoolUpdationFeeModal
                    isFee={this.state.isFee}
                    onFeeClose={this.onFeeClose}
                    isMonthly={this.state.isMonthly}
                    subscriptionMonthlyFee={this.state.subscriptionMonthlyFee}
                    isAnnualy={this.state.isAnnualy}
                    subscriptionAnnualyFee={this.state.subscriptionAnnualyFee}
                    updateFee={this.updateFee}
                    onchangeMonthlyFee={this.onchangeMonthlyFee}
                    onChangeAnnualyFee={this.onChangeAnnualyFee}
                  />
                  <Modal
                    open={this.state.isAddModal}
                    classNames={{ modal: 'custom-modal w-100' }}
                    onClose={this.closeAddModal}
                    center
                  >
                    <h2 className="modal-header">Add property to pool</h2>
                    <div className="modal-body">
                      <AddPropertyToPool
                        onSuccess={this.successAssociate}
                        poolId={this.state.poolID}
                        poolName={this.state.poolName}
                      />
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isPools={true} />
              </div>
              <div className="fullscreen-loader">
                <Loder myview={this.state.isLoading} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const styles = {
  modalOwn: {},
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

MortgagePoolContainer.defaultProps = {
  isLoading: true,
  startLoading: undefined,
  savePoolData: undefined,
  updateFee: undefined,
  storeMortgagePools: undefined,
  getUserInProperty: undefined,
  deleteMortgagePools: undefined,
  pools: [],
  addMortgageData: undefined,
  removeMortgageData: undefined,
  selectedPoolMortgageList: [],
  getSelectedPoolMortgageList: undefined,
  MortgageDropList: [],
  isLogin: false,
  userData: {},
  poolDescription: '',
  poolName: '',
  getUserInPool: undefined,
  getPoolHistoryToExport: undefined
};

MortgagePoolContainer.protoTypes = {
  isLoading: PropTypes.bool,
  startLoading: PropTypes.func,
  savePoolData: PropTypes.func,
  updateFee: PropTypes.func,
  storeMortgagePools: PropTypes.func,
  getUserInProperty: PropTypes.func,
  deleteMortgagePools: PropTypes.func,
  pools: PropTypes.arrayOf(Object),
  addMortgageData: PropTypes.func,
  removeMortgageData: PropTypes.func,
  selectedPoolMortgageList: PropTypes.arrayOf(Object),
  getSelectedPoolMortgageList: PropTypes.func,
  MortgageDropList: PropTypes.arrayOf(Object),
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  poolDescription: PropTypes.string,
  poolName: PropTypes.string,
  getUserInPool: PropTypes.func,
  getPoolHistoryToExport: PropTypes.func
};

const mapStateToProps = state => {
  return {
    isLoading: state.admin.isLoading,
    pools: state.admin.pools,
    MortgageDropList: state.admin.MortgageDropList,
    selectedPoolMortgageList: state.admin.selectedPoolMortgageList,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    isPool: state.admin.isPool,
    poolDescription: state.admin.poolDescription,
    poolName: state.admin.poolName
  };
};

export default connect(
  mapStateToProps,
  {
    startLoading,
    stopLoading,
    savePoolData,
    updateFee,
    storeMortgagePools,
    deleteMortgagePools,
    addMortgageData,
    removeMortgageData,
    getSelectedPoolMortgageList,
    getUserInPool,
    getUserInProperty
  }
)(withRouter(MortgagePoolContainer));
