import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
class IspaymentAdvanse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: props.userData,
      addressList: props.addressList,
      paymentData: props.payment,
      payment: props.payment,
      ispaymentAdvanse: props.ispaymentAdvanse,
      handleClosePayment: props.handleClosePayment,
      onSelectLanguage: props.onSelectLanguage
    };
  }

  componentDidMount = () => {
    if (document.getElementById('paymentAdvanceTable')) {
      document.getElementById('paymentAdvanceTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('paymentAdvanceTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('paymentAdvanceList').style.transform = translate;
  };
  //XXXXXXXXXXXXXXXX various Function XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  closepayment = x => {
    var lang = false;
    this.props.onSelectLanguage(lang);
    this.state.handleClosePayment();
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  render() {
    const { thead } = styles;

    if (this.state.ispaymentAdvanse) {
      return (
        <div>
          <div className="col-xs-12 nopad">
            <div className="cross-icon-wrpper">
              <img src="img/cross-icon.png" alt="cross" onClick={() => this.closepayment()} />
            </div>
            <section className="col-xs-12 details-screen-hedaing-section">
              <div className="details-upper-section">
                <div className="name-mail-wrapper">
                  <div className="details-name">{this.state.paymentData.borrower_name}</div>
                  <div className="details-account">A/c: {this.state.paymentData.propertyid}</div>
                </div>
              </div>
              <div className="details-address text-uppercase">
                {this.state.paymentData.address1}
                {this.state.paymentData.city}
                {this.state.paymentData.scountyname}
                {this.state.paymentData.postalcode}
              </div>
            </section>
            <div className="col-xs-12 nopad table-responsive white-bg details-table">
              <Scrollbars className="scrollStyle" id="paymentAdvanceTable" style={{ maxHeight: '50vh' }}>
                <table className="table">
                  <thead id="paymentAdvanceList" style={{ ...thead }}>
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
                    {this.state.payment.map((info, index) => (
                      <tr key={index}>
                        <td>{info.payment_date}</td>
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
              </Scrollbars>
            </div>
            <div className="total-payment-txt col-xs-12 text-right white-bg">
              <span>Total Monthly Payment</span>
              <span className="amount-txt">
                $
                {Number(0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {' '}
          {this.handleLangChange}
          <h1>hello world</h1>
        </div>
      );
    }
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};
export default IspaymentAdvanse;
