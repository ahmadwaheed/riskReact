import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as myapi from '../../ConfigUri';
import { handleViewPayment } from '../../actions/map/MapAction';
import { error } from '../../actions/login/loginAction';

class MortageDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment: '',
      paymentData: '',
      infoArray: props.infoArray,
      isdata: false
    };
  }

  //XXXXXXXXXXXXXXXXXX function XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  viewPayment = data => {
    let paymentlist = { ...data };

    fetch(`${myapi.viewPayment}/${paymentlist.propertyid}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (!findresponse) {
          return;
        } else {
          this.props.handleViewPayment(findresponse, paymentlist, false);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  render() {
    return (
      <div>
        <div className="col-xs-12 col-sm-6 pad-half">
          <section className="col-xs-12 details-screen-hedaing-section">
            <div className="details-upper-section">
              <div className="name-mail-wrapper">
                <div className="details-name">{this.props.detailedData.borrower_name}</div>
                <div className="details-mail">{this.props.detailedData.borrower_mail}</div>
              </div>
              <button className="btn btn-orange" onClick={() => this.viewPayment(this.props.detailedData)}>
                View Payment
              </button>
            </div>
            <div className="details-address text-uppercase">
              {this.props.detailedData.address1}
              <br />
              {this.props.detailedData.city},{this.props.detailedData.scountyname}-{this.props.detailedData.postalcode}
            </div>
          </section>
          <div className="col-xs-12 nopad table-responsive details-table fix-height-table" />
          <ul className="details-list col-xs-12 list-unstyled">
            <li className="dot col-xs-12 green-dot">
              <div>Borrowers Income</div>
              <div>
                $
                {Number(this.props.detailedData.borrowers_income).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </li>
            <li className="dot col-xs-12 blue-dot">
              <div>Account Number</div>
              <div>{this.props.detailedData.propertyid}</div>
            </li>
            <li className="dot col-xs-12 red-dot">
              <div>Fico Score</div>
              <div>{this.props.detailedData.fico_score}</div>
            </li>
            <li className="dot col-xs-12 sky-blue-dot">
              <div>GSE Loan</div>
              <div>
                $
                {Number(this.props.detailedData.gse_loan).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </li>
            <li className="dot col-xs-12 yellow-dot">
              <div>Loan Type</div>
              <div>{this.props.detailedData.loan_type}</div>
            </li>
            <li className="dot col-xs-12 blue-dot">
              <div>Loan Term</div>
              <div>{this.props.detailedData.loan_term}</div>
            </li>
            <li className="dot col-xs-12 green-dot">
              <div>Loan Interest Rate</div>
              <div>{this.props.detailedData.loan_intrest_rate}</div>
            </li>
            <li className="dot col-xs-12 blue-dot">
              <div>Payment Due Date</div>
              <div>
                {this.props.detailedData.first_payment_due_date
                  ? moment(this.props.detailedData.first_payment_due_date).format('MM/DD/YYYY')
                  : null}
              </div>
            </li>
            <li className="dot col-xs-12 red-dot">
              <div>Loan Closing Date</div>
              <div>
                {this.props.detailedData.loan_closing_date
                  ? moment(this.props.detailedData.loan_closing_date).format('MM/DD/YYYY')
                  : null}
              </div>
            </li>
            <li className="dot col-xs-12 sky-blue-dot">
              <div>Monthly Payment Date</div>
              <div>
                {this.props.detailedData.monthly_payment_date
                  ? moment(this.props.detailedData.monthly_payment_date).format('MM/DD/YYYY')
                  : null}
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

MortageDetail.defaultProps = {
  isLogin: false,
  userData: {}
};

MortageDetail.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    lat: state.map.lat,
    lang: state.map.lang,
    payment: state.map.payment,
    paymentData: state.map.paymentData,
    infoArray: state.map.infoArray,
    isdata: state.map.isdata,
    detailedData: state.map.detailedData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleViewPayment: (findresponse, paymentlist, ispaymentAdvanse) =>
      dispatch(handleViewPayment(findresponse, paymentlist, ispaymentAdvanse)),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MortageDetail));
