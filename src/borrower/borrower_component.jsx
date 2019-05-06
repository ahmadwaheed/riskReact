import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BorrowerAccountInfo } from './borrower_account_info';
import { getBorrowerSwapBalanceHistory } from '../ConfigUri';
import { OnSwapBalanceData, addProperty } from '../actions/borrower/borrower-action';
import { Scrollbars } from 'react-custom-scrollbars';
import { error } from '../actions/login/loginAction';
import Modal from 'react-responsive-modal';
import MessageNotification from '../MessageNotification';

class Borrower extends React.Component {
  sum = 0;

  constructor() {
    super();

    this.state = {
      userData: [],
      viewBorrowerAccountInfo: true,
      isProperty: false,
      isPayment: false,
      swapBalanceHistoryStatus: '',
      isOpen: false,
      hashcode: '',
      error: ''
    };
  }

  componentDidUpdate = () => {
    if (document.getElementById('swapBalanceTable')) {
      document.getElementById('swapBalanceTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('swapBalanceTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('swapBalanceList').style.transform = translate;
  };

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    } else {
      this.setState({
        userData: data
      });
    }
  }

  handleAccountInfo = borrower_id => {
    var this_ = this;
    const url = getBorrowerSwapBalanceHistory + Number(borrower_id);
    let viewBorrowerAccountInfo = this.state.viewBorrowerAccountInfo;

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
          this_.props.abc(response);

          this.setState({
            swapBalanceHistoryStatus: 'No Records Found',

            viewBorrowerAccountInfo: !viewBorrowerAccountInfo
          });
        } else {
          this_.props.abc(response);

          this.setState({
            viewBorrowerAccountInfo: !viewBorrowerAccountInfo
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

  renderSwapBalanceTable = () => {
    const { thead } = styles;
    if (this.props.bdata.history.length >= 1)
      return (
        <div className="col-xs-12 nopad">
          <div className="table-responsive col-xs-12 nopad">
            <Scrollbars className="scrollStyle" id="swapBalanceTable" style={{ maxHeight: '80vh' }}>
              <table style={{ backgroundColor: 'white' }} className="table table-borderless table-body-striped">
                <thead id="swapBalanceList" style={{ ...thead }}>
                  <tr>
                    <th>Date</th>
                    <th>Transaction type</th>
                    <th>Adjustment amount</th>
                    <th>Swap balance</th>
                  </tr>
                </thead>
                {this.props.bdata.history.map((record, index) => (
                  <DisplaySwapBalanceRows key={index} data={record} />
                ))}
              </table>
            </Scrollbars>
            <div className="col-xs-12 white-bg pad-up-down total-amount text-right">
              <span>Total swap balance:</span>{' '}
              <span>
                {' '}
                ${' '}
                {Number(this.props.bdata.total_swapBalance).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      );
    else return <div style={{ color: 'white', textAlign: 'center' }}>{this.state.swapBalanceHistoryStatus}</div>;
  };

  openProperty = () => {
    this.setState({
      isProperty: true,
      isPayment: false
    });
    this.props.history.push('/user-properties/' + this.props.userData.id);
  };

  openPayment = () => {
    this.setState({
      isProperty: false,
      isPayment: true
    });
    this.props.history.push('/payment-list');
  };

  openPropertyModal = () => {
    this.setState({
      isOpen: true
    });
  };

  onCloseModal = () => {
    this.setState({
      isOpen: false
    });
  };

  handleChange = event => {
    this.setState({
      hashcode: event.target.value
    });
  };

  addProperty = () => {
    if (!this.state.hashcode) {
      this.setState({
        error: 'Cannot be empty'
      });
    } else if (typeof this.state.hashcode !== 'undefined') {
      if (!this.state.hashcode.match(/^[2-9A-Z]+$/) || this.state.hashcode.length !== 10) {
        this.setState({
          error: 'only capital letter and digit except 0 and 1'
        });
      } else {
        this.setState({
          error: ''
        });

        addProperty(this.props.userData.token, this.state.hashcode, this.props.userData).then(res => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res) {
            this.setState({
              hashcode: ''
            });
            this.onCloseModal();
          }
        });
      }
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <MessageNotification />
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              {this.state.viewBorrowerAccountInfo ? (
                <h3 className="col-md-4" style={{ color: 'white', margin: 0 }}>
                  Account information
                </h3>
              ) : (
                <span className="back-arrow shadow-arrow" onClick={this.handleAccountInfo}>
                  <img src="img/back-arrow.png" alt="back-arrow" />
                </span>
              )}
              <ul className="col-xs-8 nopad list-unstyled list-inline own-tab">
                {this.state.isProperty ? (
                  <li onClick={this.openProperty} className="active">
                    Properties
                  </li>
                ) : (
                  <li className="pull-right cursor-own" onClick={this.openProperty}>
                    Properties
                  </li>
                )}
                {this.state.isPayment ? (
                  <li className="active" onClick={this.openPayment}>
                    Payments
                  </li>
                ) : (
                  <li className="pull-right cursor-own" onClick={this.openPayment}>
                    Payments
                  </li>
                )}
                {this.state.isPayment ? (
                  <li className="active" onClick={this.openPropertyModal}>
                    Add Property
                  </li>
                ) : (
                  <li className="pull-right cursor-own" onClick={this.openPropertyModal}>
                    Add Property
                  </li>
                )}
              </ul>
              {this.state.viewBorrowerAccountInfo ? (
                <BorrowerAccountInfo
                  accountInfo={this.props.userData.borrower[0]}
                  handleAccountInfo={this.handleAccountInfo}
                />
              ) : (
                this.renderSwapBalanceTable()
              )}
            </div>
          </div>
          <Modal open={this.state.isOpen} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
            <h2 className="modal-header">Add Property</h2>
            <div className="modal-body">
              <div className="col-xs-12 col-md-6 nopad">
                <label className="col-xs-12">Hash Code</label>
                <div className="col-xs-12 form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="hashcode"
                    onChange={e => this.handleChange(e)}
                    value={this.state.hashcode}
                    name="search"
                  />
                  <span style={{ color: 'red' }}>{this.state.error}</span>
                  <br />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3 col-xs-offset-6">
                  <button onClick={() => this.addProperty()} className="btn btn-block orange-bg btn-own">
                    Add
                  </button>
                </div>
                <div className="col-xs-3 text-right">
                  <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  swapBalanceData;
}

const DisplaySwapBalanceRows = props => {
  return (
    <tbody>
      <tr>
        <td>{props.data.store_date ? moment(props.data.store_date).format('MM/DD/YYYY') : null}</td>
        <td>{props.data.transaction_type}</td>
        <td>
          ${' '}
          {Number(props.data.adjustment_amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          ${' '}
          {Number(props.data.balance).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
      </tr>
    </tbody>
  );
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    bdata: state.borrow.swapBalanceData,
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    abc: data => dispatch(OnSwapBalanceData(data)),
    error: data => dispatch(error(data)),
    addProperty: (token, data) => dispatch(addProperty(token, data))
  };
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

Borrower.defaultProps = {
  isLogin: false,
  userData: {}
};

Borrower.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Borrower));
