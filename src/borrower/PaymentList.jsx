import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Modal from 'react-responsive-modal';
import { getHomeOwnerProperties, getUserPoolData } from '../actions/borrower/borrower-action';
import Loader from '../Loder/Loders';

class PaymentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      isPoolModal: false,
      propertiesList: [],
      poolDetails: []
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.loadPropertiesList();
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

  loadPropertiesList = () => {
    // let id = this.props.match.params.id;
    // if (id || this.props.userData.borrower.id) {
    //   let userId = id || this.props.userData.borrower.id;
    //   getHomeOwnerProperties(this.props.userData.token, userId).then(res => {
    //     if (res && res.request && res && res.request.status == 401) {
    //       this.props.history.push('/login');
    //     } else if (res && res.length > 0) {
    if (this.props.userData.borrower.length > 0) {
      this.setState({
        propertiesList: this.props.userData.borrower,
        isLoader: true
      });
    } else {
      this.setState({
        isLoader: true
      });
    }
    //     }

    //   });
    // } else {
    //   this.props.history.push('/');
    // }
  };

  goToInvoice = data => {
    this.props.history.push('/pay-invoice/' + data.id + '/' + data.poolid);
  };

  openPool = data => {
    getUserPoolData(this.props.userData.token, data.propertyid, data.poolid).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          poolDetails: res,
          isLoader: true,
          isPoolModal: true
        });
      }
    });
  };

  openDetail = (propertyId, poolid) => {
    this.props.history.push('/view-property-detail/' + propertyId);
  };

  onCloseModal = () => {
    this.setState({
      isPoolModal: false,
      poolDetails: []
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  openPayment = data => {
    this.props.userData.borrower.length === 0
      ? this.props.history.push('/user-payment/0')
      : this.props.history.push('/user-payment/' + data.propertyid + '/' + data.poolid);
  };

  DisplayPropertiesList = props => {
    let postal;

    if (props.postalcode && props.postalcode !== '' && props.postalcode.length < 5) {
      let length = props.postalcode.length;
      postal = props.postalcode;
      let res = 5 - length;

      for (let i = 1; i <= res; i++) {
        let a = '0';
        postal = a + postal;
      }
    } else {
      postal = props.postalcode;
    }

    return (
      <tr>
        <td>{props.propertyid}</td>
        {/* <td>{props.borrower_name}</td> */}
        <td>
          {props.address1}, {props.city}, {props.state} {postal}
        </td>
        <td className="text-right">
          <button style={{ marginLeft: '5px' }} className="btn btn-orange" onClick={() => this.openPayment(props)}>
            Payments
          </button>
          {props.poolid && props.poolid !== '' ? (
            <button style={{ marginLeft: '5px' }} className="btn btn-orange" onClick={() => this.openPool(props)}>
              Pool
            </button>
          ) : null}
        </td>
      </tr>
    );
  };

  render() {
    let postal;

    if (this.state.propertiesList.length > 0) {
      this.state.propertiesList.forEach(res => {
        if (res && res.postalcode && res.postalcode !== '' && res.postalcode.length < 5) {
          let lengths = res.postalcode.length;
          postal = res.postalcode;
          let repo = 5 - lengths;

          for (let i = 1; i <= repo; i++) {
            let a = '0';
            postal = a + postal;
          }
        } else {
          postal = res.postalcode;
        }
      });
    }

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
                    Payment List
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
                        <th>Property Id</th>
                        {/* <th>Homeowner Name</th> */}
                        <th>Address</th>
                        <th />
                        {/* <th />
                        <th /> */}
                      </tr>
                    </thead>
                    {this.state.propertiesList.length > 0
                      ? this.state.propertiesList.map((record, index) => (
                          <tbody key={index}>{this.DisplayPropertiesList(record)}</tbody>
                        ))
                      : null}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={this.state.isPoolModal} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
          <h2 className="modal-header">Invoice</h2>
          <div className="modal-body">
            <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh', minHeight: '25vh' }}>
              <table className="table table-borderless">
                <thead id="userData" style={{ backgroundColor: '#fff' }}>
                  <tr>
                    <th className="text-center">Pool Name</th>
                    <th className="text-center">Postal code</th>
                    <th className="text-center">Entry Date</th>
                    <th className="text-center">Exit Date</th>
                    <th className="text-center">Diversified Notional Price</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.poolDetails &&
                    this.state.poolDetails.length > 0 &&
                    this.state.poolDetails.map((data, index) => (
                      <tr key={index}>
                        <td>{data.pool_name}</td>
                        <td>{data.postalcode}</td>
                        <td> {data.entry_date ? moment(data.entry_date).format('MM/DD/YYYY') : null}</td>
                        <td>{data.exit_date ? moment(data.exit_date).format('MM/DD/YYYY') : null}</td>
                        <td>{data.diverse_notional_price ? Number(data.diverse_notional_price).toFixed(2) : null}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="row pad-up">
              <div className="col-xs-3 col-xs-offset-9 text-right">
                <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                  Close
                </button>
              </div>
              {/* <div className="col-xs-3 text-right">
                <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                  Close
                </button>
              </div> */}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

PaymentList.defaultProps = {
  getHomeOwnerProperties: undefined,
  getUserPoolData: undefined,
  userData: {}
};

PaymentList.propTypes = {
  getHomeOwnerProperties: PropTypes.func,
  getUserPoolData: PropTypes.func,
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getHomeOwnerProperties, getUserPoolData }
)(withRouter(PaymentList));
