import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getLogsData } from '../actions/admin/mortgage_pool_container';
import { addProperty } from '../actions/borrower/borrower-action';
import Modal from 'react-responsive-modal';
import DatePicker from 'react-datepicker';

class PoolAddEditModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      poolList: [],
      minDate: new Date(),
      isRemove: false
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
              <th>Address</th>
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

  DisplayMortgageList = (props, value) => {
    return (
      <tr>
        {value === 'edit' ? (
          <td>
            <input
              type="radio"
              name="service"
              value={props.propertyid}
              onClick={() => this.editMortage(props.propertyid, props.user_id, props.entry_date)}
            />
          </td>
        ) : null}
        <td>{props.propertyid ? Number(props.propertyid) : ''}</td>
        {/* <td>{props.first_name}{' '}{props.last_name}</td> */}
        <td>
          {' '}
          <div>{props.address1 ? props.address1 : null}</div>
          <div>{props.city ? props.city + ', ' + props.state : null}</div>
        </td>
        {/* <td className="text-right">{Number(props.first_mortgage_loan_amount).toFixed(2)}</td>
            <td className="text-right">{props.total_swap_balances ? Number(props.total_swap_balances).toFixed(2) : ''}</td>
            <td className="text-right">{props.total_balances ? Number(props.total_balances).toFixed(2) : ''}</td>
            <td className="text-right">{props.total_combine_balances ? Number(props.total_combine_balances).toFixed(2) : ''}</td> */}
      </tr>
    );
  };

  handleChangeDescription = event => {
    this.props.handleChangeDescription(event);
  };

  onChangePool = event => {
    this.props.onChangePool(event);
  };

  onchangeMonthlyFee = event => {
    this.props.onchangeMonthlyFee(event);
  };

  onChangeAnnualyFee = event => {
    this.props.onChangeAnnualyFee(event);
  };

  editMortage = (id, userId, date) => {
    this.setState({
      isRemove: true,
      minDate: new Date(date)
    });
    this.props.editMortage(id, userId);
  };

  onChangeComment = event => {
    this.props.onChangeComment(event);
  };

  handleExitChange = event => {
    this.props.handleExitChange(event);
  };

  submitPool = () => {
    this.props.submitPool();
  };

  closeModal = () => {
    this.setState({
      isRemove: false
    });
    this.props.closeModal();
  };

  onCloseModal = () => {
    this.props.onCloseModal();
  };

  removeMortgageFromPool = (poolID, removalComment, removedMortgageId, userId) => {
    this.setState({ isRemove: false });
    this.props.removeMortgageFromPool(poolID, removalComment, removedMortgageId, userId);
  };

  render() {
    return (
      <Modal
        classNames={{ modal: 'custom-modal editor w-100' }}
        open={this.props.open}
        onClose={this.onCloseModal}
        center
      >
        <h2 className="modal-header">{this.props.modalHeader}</h2>
        <div className="modal-body">
          <div className="row form-group pad-down pad-half">
            <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '7px' }}>
              Name :
            </label>
            <div className="col-xs-9 pad-half">
              <input
                name="pool-name"
                placeholder="Pool Name"
                defaultValue={this.props.poolName}
                type="text"
                className="form-control"
                disabled={this.props.isEditPool}
                onChange={this.props.isEditPool ? null : event => this.onChangePool(event)}
              />
            </div>
          </div>
          <div className="row form-group pad-down pad-half">
            <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '7px' }}>
              Description :
            </label>
            {!this.props.isRemoveMortgage ? (
              <div>
                <div className="col-xs-9 pad-half">
                  <textarea
                    className="form-control"
                    htmlFor=""
                    maxLength="1000"
                    placeholder="Enter description of the pool"
                    name="description"
                    value={this.props.description}
                    onChange={event => this.handleChangeDescription(event)}
                  />
                </div>{' '}
                <div className="col-xs-12 col-xs-offset-2">(Maximum 1000 characters.)</div>{' '}
              </div>
            ) : (
              <div className="col-xs-9 pad-half">
                <textarea
                  className="form-control"
                  disabled
                  htmlFor=""
                  maxLength="1000"
                  placeholder="Enter description of the pool"
                  name="description"
                  value={this.props.description}
                  onChange={event => this.handleChangeDescription(event)}
                />
              </div>
            )}
          </div>
          {this.props.modalHeader === 'Add New Pool' ? (
            <div className="row form-group pad-down pad-half">
              <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '7px' }}>
                Monthly flat subscription fee:
              </label>
              <div className="col-xs-9 pad-half">
                <input
                  name="monthly"
                  placeholder="Subscription Monthly Fee"
                  defaultValue={this.props.subscriptionMonthlyFee}
                  type="text"
                  className="form-control"
                  disabled={this.props.isEditPool}
                  onChange={this.props.isEditPool ? null : event => this.onchangeMonthlyFee(event)}
                />
                {this.props.isMonthly ? <span style={{ color: 'red' }}>Please enter number only</span> : null}
              </div>
            </div>
          ) : null}

          {this.props.modalHeader === 'Add New Pool' ? (
            <div className="row form-group pad-down pad-half">
              <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '7px' }}>
                Basis points fee :
              </label>
              <div className="col-xs-9 pad-half">
                <input
                  name="annual"
                  placeholder="Subscription Annual Basis Point Fee"
                  defaultValue={this.props.subscriptionAnnualyFee}
                  type="text"
                  className="form-control"
                  disabled={this.props.isEditPool}
                  onChange={this.props.isEditPool ? null : event => this.onChangeAnnualyFee(event)}
                />
                {this.props.isAnnualy ? <span style={{ color: 'red' }}>Please enter number only</span> : null}
              </div>
            </div>
          ) : null}

          {this.props.isEditPool ? (
            <div style={{ height: '50vh' }}>
              <div className="row form-group pad-down pad-half">
                <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '5px', paddingBottom: '6px' }}>
                  Properties Info:
                </label>

                {this.props.selectedPoolMortgageList.length > 0 ? (
                  <div className="col-xs-12 pad-half">{this.gridMortageList('edit')}</div>
                ) : (
                  <div>No Property available for remove</div>
                )}
              </div>
              {this.props.selectedPoolMortgageList.length > 0 ? (
                <div className="row form-group pad-down pad-half">
                  <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '7px' }}>
                    Comment:
                  </label>
                  <div className="col-xs-9 pad-half">
                    <input
                      name="pool-name"
                      placeholder="Comment for remove"
                      value={this.props.removalComment}
                      type="text"
                      className="form-control"
                      onChange={event => this.onChangeComment(event)}
                    />
                  </div>
                </div>
              ) : null}
              {this.state.isRemove ? (
                <div className="row form-group pad-down pad-half top-calender">
                  <label htmlFor="" className="col-xs-2 pad-half" style={{ paddingTop: '5px', paddingBottom: '6px' }}>
                    Remove Date:
                  </label>
                  <div className="col-xs-9 pad-half" style={{ marginBottom: '90px' }}>
                    <DatePicker
                      className="custom-datepicker form-control"
                      dateFormat="MM/DD/YYYY"
                      showMonthDropdown={true}
                      showYearDropdown={true}
                      selected={moment(this.props.exitDate)}
                      onChange={this.handleExitChange}
                      dropdownMode="select"
                      peekNextMonth
                      minDate={moment(this.state.minDate)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          {!(this.state.isRemoveValid && this.state.removalComment.length) &&
          this.props.selectedPoolMortgageList.length > 0 ? (
            <span>Please Select User and add comment to remove the User from pool</span>
          ) : null}
          <div className="row">
            <div className="col-xs-12 text-right">
              {!this.props.isEditPool ? (
                <button
                  onClick={() => {
                    this.submitPool();
                  }}
                  className="btn orange-bg btn-own margin-right"
                  disabled={
                    this.props.poolName === '' ||
                    this.props.description === '' ||
                    this.props.isMonthly ||
                    this.props.isAnnualy ||
                    this.props.subscriptionAnnualyFee === '' ||
                    this.props.subscriptionMonthlyFee === ''
                  }
                >
                  {this.props.modalHeader === 'Add New Pool' ? 'Submit' : 'Update'}
                </button>
              ) : null}
              {this.props.isEditPool ? (
                <button
                  onClick={() => {
                    this.removeMortgageFromPool(
                      this.props.poolID,
                      this.props.removalComment,
                      this.props.removedMortgageId,
                      this.props.userId
                    );
                  }}
                  className="btn orange-bg btn-own margin-right"
                  disabled={!(this.props.isRemoveValid && this.props.removalComment.length)}
                >
                  Remove Property
                </button>
              ) : null}
              <button
                onClick={() => {
                  this.closeModal();
                }}
                className="btn orange-bg btn-own"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const styles = {
  modalOwn: {},
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

PoolAddEditModal.defaultProps = {
  getLogsData: undefined,
  userData: {},
  addProperty: undefined
};

PoolAddEditModal.propTypes = {
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
)(withRouter(PoolAddEditModal));
