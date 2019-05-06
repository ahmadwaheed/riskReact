import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import { getBorrowerPaymentHistory, getBorrowerBillDetail } from '../actions/borrower/borrower-action';
import Loader from '../Loder/Loders';

class UserPayments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isPayment: false,
      paymentData: [],
      billDetail: {}
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.loadPaymentHistory();
    }
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('userDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    let scroll = document.getElementById('userData');

    if (scroll && translate) {
      scroll.style.transform = translate;
    }
  };

  loadPaymentHistory = () => {
    let id = this.props.match.params.id;
    let poolId = this.props.match.params.poolId;

    if (id || this.props.userData.borrower[0].propertyid) {
      let propertyId = id || this.props.userData.borrower[0].propertyid;

      getBorrowerPaymentHistory(this.props.userData.token, propertyId, poolId).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res) {
          this.setState({
            paymentData: res,
            isLoader: true
          });
        }
      });
    } else {
      this.props.history.push('/');
    }
  };

  goToInvoice = data => {
    this.props.history.push('/pay-invoice/' + data.id + '/' + data.poolid);
  };

  openPayment = data => {
    getBorrowerBillDetail(this.props.userData.token, data.id, data.poolid).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          billDetail: res,
          isLoader: true,
          isPayment: true
        });
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  onCloseModal = () => {
    this.setState({
      isPayment: false
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad" />
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12" />
                <div className="col-xs-12 pad-up">
                  <h2 className="pull-left" style={{ marginTop: '0' }}>
                    Payment
                  </h2>
                  <span className="back-arrow shadow-arrow">
                    <img src="img/back-arrow.png" onClick={this.goBack} alt="back-arrow" />
                  </span>
                </div>
                <div className="col-xs-12 table-responsive">
                  {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                  <table className="table table-borderless">
                    <thead id="userData" style={{ backgroundColor: '#fff' }}>
                      <tr>
                        <th className="text-center">Invoice Date</th>
                        {/* <th className="text-center">Payment Date</th> */}
                        <th className="text-center">Payment Due</th>
                        <th className="text-center">Pool Name</th>
                        {/* <th className="text-center">Homeowner Name</th> */}
                        <th className="text-center">Property Address</th>
                        <th className="text-center">Basis points fee</th>
                        <th className="text-center">Monthly flat subscription fee</th>
                        <th className="text-center">Sub. Fee</th>

                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.paymentData &&
                        this.state.paymentData.length > 0 &&
                        this.state.paymentData.map((data, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {data.invoicedate ? moment(data.invoicedate).format('MM/DD/YYYY') : null}
                            </td>
                            {/* <td className="text-center">
                              {data.paymentdate ? moment(data.paymentdate).format('MM/DD/YYYY') : null}
                            </td> */}
                            <td className="text-center">
                              {data.payment_due_date ? moment(data.payment_due_date).format('MM/DD/YYYY') : null}
                            </td>
                            <td className="text-center">{data.pool_name}</td>
                            {/* <td className="text-center">
                              {data.first_name} {data.last_name}
                            </td> */}
                            <td className="text-center">{data.address1}</td>
                            <td className="text-center">
                              {data.subscription_annual_basis_point_fee
                                ? Number(data.subscription_annual_basis_point_fee).toFixed(2)
                                : null}
                            </td>
                            <td className="text-center">
                              {data.subscription_monthly_fee ? Number(data.subscription_monthly_fee).toFixed(2) : null}
                            </td>
                            <td className="text-center">
                              {data.subscription_fee ? Number(data.subscription_fee).toFixed(2) : null}
                            </td>

                            <td className="text-center">
                              {!data.is_payment ? (
                                <button
                                  style={{ minWidth: '100px' }}
                                  className="btn orange-bg btn-own"
                                  onClick={() => this.goToInvoice(data)}
                                >
                                  Pay Invoice
                                </button>
                              ) : (
                                <button
                                  style={{ minWidth: '100px' }}
                                  className="btn orange-bg btn-own"
                                  onClick={() => this.openPayment(data)}
                                >
                                  Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={this.state.isPayment} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
          <h2 className="modal-header">Invoice</h2>
          <div className="modal-body">
            <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh', minHeight: '25vh' }}>
              <table className="table table-borderless">
                <thead id="userData" style={{ backgroundColor: '#fff' }}>
                  <tr>
                    <th className="text-center">Invoice Date</th>
                    <th className="text-center">Payment Date</th>
                    {/* <th className="text-center">Homeowner Name</th> */}
                    <th className="text-center">Pool Name</th>
                    <th className="text-center">Property Address</th>
                    <th className="text-center">State</th>
                    <th className="text-center">City</th>

                    <th className="text-center">Subscription Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.billDetail &&
                    this.state.billDetail.length > 0 &&
                    this.state.billDetail.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          {data.invoicedate ? moment(data.invoicedate).format('MM/DD/YYYY') : null}
                        </td>
                        <td className="text-center">
                          {data.paymentdate ? moment(data.paymentdate).format('MM/DD/YYYY') : null}
                        </td>
                        {/* <td className="text-center">
                          {' '}
                          {data.first_name} {data.last_name}
                        </td> */}
                        <td className="text-center">{data.pool_name}</td>
                        <td className="text-center">{data.address1}</td>
                        <td className="text-center">{data.state}</td>
                        <td className="text-center">{data.city}</td>

                        <td className="text-center">{Number(data.subscription_fee).toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="row pad-up">
              <div className="col-xs-3 text-right">
                <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

UserPayments.defaultProps = {
  getBorrowerPaymentHistory: undefined,
  getBorrowerBillDetail: undefined,
  userData: {}
};

UserPayments.propTypes = {
  getBorrowerPaymentHistory: PropTypes.func,
  getBorrowerBillDetail: PropTypes.func,
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getBorrowerPaymentHistory, getBorrowerBillDetail }
)(withRouter(UserPayments));
