import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { handleViewPayment } from '../../actions/map/MapAction';

class ViewPayment extends React.Component {
  render() {
    return (
      <div>
        <div className="col-xs-12 col-sm-6 pad-half">
          <section className="col-xs-12 details-screen-hedaing-section">
            <div className="details-upper-section">
              <div className="name-mail-wrapper">
                <div className="details-name">{this.props.detailedData.borrower_name}</div>
                <div className="details-account">A/c: {this.props.detailedData.propertyid}</div>
              </div>
            </div>
            <div className="details-address text-uppercase">
              {this.props.detailedData.address1}
              <br />
              {this.props.detailedData.city},{this.props.detailedData.scountyname}-{this.props.detailedData.postalcode}{' '}
            </div>
          </section>
          <div className="col-xs-12 nopad table-responsive details-table fix-height-table-payment">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Fee</th>
                  <th className="text-right">Interest Paid</th>
                  <th className="text-right">Insurance</th>
                  <th className="text-right">Escrow</th>
                  <th className="text-right">Swap Balance</th>
                </tr>
              </thead>
              <tbody>
                {this.props.payment.map((info, index) => (
                  <tr key={index}>
                    <td>{moment(info.payment_date).format('MM/DD/YYYY')}</td>
                    <td className="text-right">
                      $
                      {Number(info.fees).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="text-right">
                      $
                      {Number(info.principal_interest).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="text-right">
                      $
                      {Number(info.insurance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="text-right">
                      $
                      {Number(info.escrow).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="text-right">
                      $
                      {Number(info.swap_balances).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="total-payment-txt col-xs-12 text-right">
            <span>Total Monthly Payment</span>
            <span className="amount-txt">
              ${' '}
              {Number('1500').toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ViewPayment.defaultProps = {
  isLogin: false,
  userData: {}
};

ViewPayment.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    addressList: state.map.addressList,
    detailedData: state.map.detailedData,
    payment: state.map.payment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleViewPayment: (findresponse, paymentlist) => dispatch(handleViewPayment(findresponse, paymentlist))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ViewPayment));
