import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import Loader from '../Loder/Loders';
import moment from 'moment';
import { getBorrowerPaidDetail } from '../actions/borrower/borrower-action';

class PayInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      paidDetail: {}
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      let id = this.props.match.params.id;
      let poolid = this.props.match.params.poolid;

      if (id && id !== '' && poolid && poolid !== '') {
        getBorrowerPaidDetail(this.props.userData.token, id, poolid).then(res => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res) {
            this.setState({
              isLoader: true,
              paidDetail: res
            });
          } else {
            this.setState({
              isLoader: true
            });
          }
        });
      } else {
        this.props.history.push('user-payment');
      }
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  openModal = () => {
    this.setState({
      isModalOpen: true
    });
  };

  onCloseModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad" />
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="container-fluid pad-up">
                  <span
                    onClick={this.goBack}
                    className="back-arrow shadow-arrow"
                    style={{ marginBottom: '0', marginTop: '-12px' }}
                  >
                    <img src="img/back-arrow.png" alt="back-arrow" />
                  </span>
                </div>
                {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                <div className="col-xs-12 text-center pad-down">
                  <h2>Payment</h2>
                </div>
                {this.state.paidDetail ? (
                  <div className="col-xs-12 col-md-6 col-md-offset-3 table-responsive">
                    <table className="table table-transparent table-borderless">
                      <tbody>
                        <tr>
                          <td>Property Id</td>
                          <td className="text-right">{this.state.paidDetail.propertyid}</td>
                        </tr>
                        <tr>
                          <td>Invoice Date</td>
                          <td className="text-right">
                            {this.state.paidDetail.invoicedate
                              ? moment(this.state.paidDetail.invoicedate).format('MM/DD/YYYY')
                              : null}
                          </td>
                        </tr>
                        <tr>
                          <td>Payment Due Date</td>
                          <td className="text-right">
                            {this.state.paidDetail.payment_due_date
                              ? moment(this.state.paidDetail.payment_due_date).format('MM/DD/YYYY')
                              : null}
                          </td>
                        </tr>
                        <tr>
                          <td>Pool Name</td>
                          <td className="text-right">{this.state.paidDetail.pool_name}</td>
                        </tr>
                        <tr>
                          <td>Address</td>
                          <td className="text-right">{this.state.paidDetail.address1}</td>
                        </tr>
                        <tr>
                          <td>State</td>
                          <td className="text-right">{this.state.paidDetail.state}</td>
                        </tr>
                        <tr>
                          <td>City</td>
                          <td className="text-right">{this.state.paidDetail.city}</td>
                        </tr>
                        <tr>
                          <td>Basis points fee</td>
                          <td className="text-right">
                            {this.state.paidDetail.subscription_annual_basis_point_fee
                              ? Number(this.state.paidDetail.subscription_annual_basis_point_fee).toFixed(2)
                              : null}
                          </td>
                        </tr>
                        <tr>
                          <td>Monthly flat subscription fee</td>
                          <td className="text-right">
                            {this.state.paidDetail.subscription_monthly_fee
                              ? Number(this.state.paidDetail.subscription_monthly_fee).toFixed(2)
                              : null}
                          </td>
                        </tr>
                        <tr>
                          <td>Subscription Fee</td>
                          <td className="text-right">
                            {this.state.paidDetail.subscription_fee
                              ? Number(this.state.paidDetail.subscription_fee).toFixed(2)
                              : null}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
                <div className="col-xs-12 col-md-6 col-md-offset-3 text-right pad-up-large pad-down">
                  <button className="btn btn-primary" style={{ minWidth: '100px' }} onClick={() => this.openModal()}>
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            open={this.state.isModalOpen}
            classNames={{ modal: 'custom-modal' }}
            onClose={this.onCloseModal}
            center
          >
            <h2 className="modal-header">Pay Now</h2>
            <div className="modal-body">
              <div>Date</div>{' '}
              <div>
                {' '}
                {this.state.paidDetail.paymentdate
                  ? moment(this.state.paidDetail.paymentdate).format('MM/DD/YYYY')
                  : null}
              </div>
              <div>Subscription fee</div>{' '}
              <div>
                {this.state.paidDetail.subscription_fee
                  ? Number(this.state.paidDetail.subscription_fee).toFixed(2)
                  : null}
              </div>
              <div className="row">
                <div className="col-xs-3 col-xs-offset-6" />
                <div className="col-xs-3 text-right">
                  <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

PayInvoice.defaultProps = {
  userData: {},
  getBorrowerPaidDetail: undefined
};

PayInvoice.propTypes = {
  userData: PropTypes.objectOf(String),
  getBorrowerPaidDetail: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getBorrowerPaidDetail }
)(withRouter(PayInvoice));
