import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getHomeOwnerProperties, getUserPoolData, setPoolId, addProperty } from '../actions/borrower/borrower-action';
import Loader from '../Loder/Loders';

class UserProperties extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      isPoolModal: false,
      poolDetails: [],
      hashcode: '',
      error: ''
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
    let id = this.props.match.params.id;

    if (id || this.props.userData.borrower.id) {
      let userId = id || this.props.userData.borrower.id;

      getHomeOwnerProperties(this.props.userData.token, userId).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res && res.length > 0) {
          this.setState({
            isLoader: true
          });
        } else {
          this.setState({
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

  // openPool = data => {
  //   getUserPoolData(this.props.userData.token, data.propertyid, data.poolid).then(res => {
  //     if (res && res.request && res && res.request.status == 401) {
  //       this.props.history.push('/login');
  //     } else if (res) {
  //       this.setState({
  //         poolDetails: res,
  //         isLoader: true,
  //         isPoolModal: true,
  //       });
  //     }
  //   });
  // };

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

  // openPayment = data => {
  //   this.props.userData.borrower.length == 0 ? this.props.history.push("/user-payment/0") : this.props.history.push("/user-payment/" + data.propertyid + '/' + data.poolid);
  // }

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
          {props.address1}, {props.city} {props.state} {postal}
        </td>
        <td className="text-right">
          <button
            style={{ marginLeft: '5px' }}
            className="btn btn-orange"
            onClick={() => this.openDetail(props.propertyid, props.poolid)}
          >
            View Detail
          </button>
          {/* <button style={{marginLeft: '5px'}} className="btn btn-orange" onClick={() => this.openPayment(props)}>
            Payments
          </button>
          {props.poolid && props.poolid !== '' ? (
       
            <button style={{marginLeft: '5px'}} className="btn btn-orange" onClick={() => this.openPool(props)}>
              Pool
            </button>
        ) : null} */}
        </td>
      </tr>
    );
  };

  submitCode = () => {
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
            this.loadPropertiesList();
          }
        });
      }
    }
  };

  onChangeInput = event => {
    this.setState({
      hashcode: event.target.value
    });
  };

  render() {
    let postal;

    if (this.props.propertiesList.length > 0) {
      this.props.propertiesList.forEach(res => {
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
                {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                <div className="col-xs-12" />
                <div className="col-xs-12 pad-up">
                  <h2 className="pull-left" style={{ marginTop: '0' }}>
                    Properties
                  </h2>
                  <span className="back-arrow shadow-arrow">
                    <img src="img/back-arrow.png" onClick={this.goBack} alt="back-arrow" />
                  </span>
                </div>
                {this.props.propertiesList.length > 0 ? (
                  <div className="col-xs-12 table-responsive">
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
                      {this.props.propertiesList.length > 0
                        ? this.props.propertiesList.map((record, index) => (
                            <tbody key={index}>{this.DisplayPropertiesList(record)}</tbody>
                          ))
                        : null}
                    </table>
                  </div>
                ) : this.state.isLoader ? (
                  <div className="col-xs-12 text-center">
                    <p>
                      There are no properties associated with your account. Enter your property registration code
                      provided by Home Diversification Corp to add a property to your account.
                    </p>
                    <div className="form-group row pad-up">
                      <label style={{ paddingTop: '6px' }} className="col-sm-2 col-sm-offset-2">
                        Registration code:
                      </label>
                      <div className="col-sm-4">
                        <input
                          onChange={e => this.onChangeInput(e)}
                          type="text"
                          className="form-control"
                          placeholder="Hashcode"
                          name="hashcode"
                        />
                        <span style={{ color: 'red' }}>{this.state.error}</span>
                      </div>
                      <div className="col-sm-2">
                        <button onClick={() => this.submitCode()} className="btn btn-block orange-bg btn-own">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserProperties.defaultProps = {
  getHomeOwnerProperties: undefined,
  getUserPoolData: undefined,
  userData: {},
  propertiesList: [],
  setPoolId: undefined
};

UserProperties.propTypes = {
  getHomeOwnerProperties: PropTypes.func,
  getUserPoolData: PropTypes.func,
  userData: PropTypes.objectOf(String),
  propertiesList: PropTypes.arrayOf(Object),
  setPoolId: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData,
    propertiesList: state.borrow.propertiesList
  };
};

export default connect(
  mapStateToProps,
  { getHomeOwnerProperties, getUserPoolData, setPoolId }
)(withRouter(UserProperties));
