import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from 'react-responsive-modal';
import { clearSelectedMortgageData, saveSelectedMortgageData, getCompanyList } from '../actions/admin/admin-action';
import { updateMortgageList, getMortgageListWithPayments, get_adjust_payment, checkProperty } from '../ConfigUri';
import { getBorrowerPaymentHistory, addProperty } from '../actions/borrower/borrower-action';
import { error, success } from '../actions/login/loginAction';
import { userCreationInProperty } from '../actions/admin/mortgage_pool_container';

let hashCode = '';
let poolId = '';
let emailValid = true;
class PropertyUpdate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mortgageData: {},
      mortgagePayment: [],
      companyList: [],
      adjustPaymentBalance: [],
      amortizationsArray: [],
      fee: '',
      addToUserModal: false,
      confirmAssignModal: false,
      user: '',
      userEmail: '',
      userNotFoundModal: false,
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: 'Homeowner',
        password: '',
        confirmPassword: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      errors: {}
    };
    this.updatedMortgageData = {};
  }

  componentDidMount = () => {
    const { selectedMortgageData } = this.props;

    if (Object.keys(selectedMortgageData).length === 0) {
      this.props.clearSelectedMortgageData('', '');
      this.updateMortgage();
    } else {
      this.updateMortgage();
    }

    let hashcode = this.props.match.params.hashcode;
    poolId = this.props.match.params.poolId;
    hashCode = hashcode;
    if (!hashCode || hashCode === '') {
      //this.loadPaymentHistory(poolId);
    }

    getCompanyList(this.props.userData.token).then(response => {
      if (response && response.request && response && response.request.status === 401) {
        this.props.history.push('/login');
      } else if (response) {
        this.setState({
          isLoading: true,
          companyList: response
        });
      } else {
        this.setState({
          isLoading: true
        });
      }
    });

    this.setState({
      isLoading: false
    });
  };

  associate = () => {
    let id = this.props.match.params.id;
    let hashcode = this.props.match.params.hashcode;

    if (hashCode && hashCode !== '') {
      this.props.history.push('/property-association/' + id + '/' + hashcode);
    }
  };

  addToNewUser = () => {
    this.setState({
      addToUserModal: true
    });
  };

  checkAssignToUser = () => {
    let { userEmail } = this.state;
    let url = checkProperty + this.state.userEmail + '/' + this.props.match.params.hashcode;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.success) {
          success('This property is already assigned to this user.');

          this.setState({
            addToUserModal: false,
            userEmail: ''
          });
        } else if (!findresponse.success && findresponse.propertyid != null) {
          this.setState({
            addToUserModal: false,
            confirmAssignModal: true,
            user: findresponse.user
          });
        } else if (!findresponse.success && findresponse.propertyid == null) {
          let fields = Object.assign({}, this.state.fields);
          fields['hashcode'] = this.props.match.params.hashcode;

          this.setState({
            addToUserModal: false,
            confirmAssignModal: true,
            userNotFoundModal: true,
            fields
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

  finalAssignToUser = () => {
    let hashcode = this.props.match.params.hashcode;

    addProperty(this.props.userData.token, hashcode, this.state.user).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          addToUserModal: false,
          confirmAssignModal: false,
          userId: '',
          userEmail: ''
        });
      }
    });
  };

  handleValidation() {
    let fields = Object.assign({}, this.state.fields);
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields['firstName']) {
      formIsValid = false;
      errors['firstName'] = 'First Name Cannot be empty';
    }

    if (typeof fields['firstName'] !== 'undefined') {
      if (!fields['firstName'].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors['firstName'] = 'First Name has Only letters';
      }
    }

    if (!fields['lastName']) {
      formIsValid = false;
      errors['lastName'] = 'Last Name Cannot be empty';
    }

    if (typeof fields['lastName'] !== 'undefined') {
      if (!fields['lastName'].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors['lastName'] = 'Last Name has Only letters';
      }
    }

    if (!fields['hashcode']) {
      formIsValid = false;
      errors['hashcode'] = 'Cannot be empty';
    }

    if (typeof fields['hashcode'] !== 'undefined') {
      if (!fields['hashcode'].match(/^[2-9A-Z]+$/) || fields['hashcode'].length !== 10) {
        formIsValid = false;

        errors['hashcode'] = '10 charcter long includes capital letter and digit except 0 and 1';
      }
    }

    if (!fields['phoneNumber']) {
      formIsValid = false;
      errors['phoneNumber'] = 'phoneNumber Cannot be empty';
    }

    if (typeof fields['phoneNumber'] !== 'undefined') {
      if (!fields['phoneNumber'].match('^[0-9]+$')) {
        formIsValid = false;
        errors['phoneNumber'] = 'enter only number';
      }
    }

    if (!fields['countryCode']) {
      formIsValid = false;
      errors['countryCode'] = 'countryCode Cannot be empty';
    }

    if (typeof fields['countryCode'] !== 'undefined') {
      if (!fields['countryCode'].match('^[0-9]+$')) {
        formIsValid = false;
        errors['countryCode'] = 'enter only number';
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleChange(field, e) {
    let fields = Object.assign({}, this.state.fields);
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  contactSubmit = e => {
    // let fields = Object.assign({}, this.state.fields);
    // fields['email'] = this.state.userEmail;
    // this.setState({ fields: fields });
    if (this.handleValidation()) {
      userCreationInProperty(this.state.fields, this.props.userData.token).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res) {
          this.setState({
            fields: {
              firstName: '',
              lastName: '',
              email: '',
              role: '',
              password: '',
              confirmPassword: '',
              hashcode: '',
              phoneNumber: '',
              countryCode: '1'
            },
            userEmail: '',
            userNotFoundModal: false,
            addToUserModal: false,
            confirmAssignModal: false
          });
        }
      });
    }
  };

  clearInput = () => {
    this.setState({
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      errors: {},
      isPassword: false,
      isLoader: true
    });
  };

  onCloseModal = () => {
    this.setState({
      addToUserModal: false,
      userEmail: '',
      confirmAssignModal: false,
      userNotFoundModal: false
    });
  };

  handleUserEmail = e => {
    let email = e.target.value;

    if (email.length > 0) {
      let lastAtPos = email.lastIndexOf('@');
      let lastDotPos = email.lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          email.indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          email.length - lastDotPos > 2
        )
      ) {
        this.setState({
          userEmail: e.target.value,
          userEmailError: true
        });
      } else {
        let fields = Object.assign({}, this.state.fields);
        fields['email'] = e.target.value;
        this.setState({ fields: fields, userEmailError: false, userEmail: e.target.value });
        // this.setState({
        //   userEmail: e.target.value,
        //   userEmailError: false
        // });
      }
    } else {
      this.setState({
        userEmail: e.target.value,
        userEmailError: true
      });
    }
  };

  loadPaymentHistory = poolId => {
    let id = this.props.match.params.id;

    if (id) {
      getBorrowerPaymentHistory(this.props.userData.token, id, poolId).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res) {
          let a = 0;

          res.forEach(x => {
            a = Number(a) + Number(x.subscription_fee);
          });

          this.setState({
            fee: a,
            isLoader: true
          });
        }
      });
    } else {
      this.props.history.push('/');
    }
  };

  backToList = history => {
    const { searchMortgage, searchAdminText } = this.props;
    this.props.clearSelectedMortgageData(searchMortgage, searchAdminText);
    history.goBack();
  };

  submitMortgageData = event => {
    event.preventDefault();
    this.updatedMortgageData.id = this.state.mortgageData.id;

    fetch(updateMortgageList, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(this.updatedMortgageData)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.success) {
          success(findresponse.success);
        }

        this.props.saveSelectedMortgageData(this.state.mortgageData, this.state.mortgagePayment);
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  cancelMortgageUpdation = () => {
    const { searchMortgage, searchAdminText, history } = this.props;
    this.props.clearSelectedMortgageData(searchMortgage, searchAdminText);
    history.goBack();
  };

  handleMortgageChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.updatedMortgageData[name] = value;
    let mortgageData = Object.assign({}, this.state.mortgageData);
    mortgageData[name] = value;

    this.setState({
      mortgageData: mortgageData
    });
  };

  updateMortgage = () => {
    let id = this.props.match.params.id;
    let poolId = this.props.match.params.poolId;

    if (id !== '') {
      const url = getMortgageListWithPayments + id;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        })
      })
        .then(Response => Response.json())
        .then(response => {
          const mortgage = response.mortgage;
          const paymentsData = response.history;
          this.props.saveSelectedMortgageData(mortgage, paymentsData, poolId);

          const balance = Number(mortgage.first_mortgage_loan_amount);
          const interest = Number(mortgage.loan_intrest_rate);
          const term = Number(mortgage.loan_term);
          let firstPaymentDate = mortgage.monthly_payment_date;
          firstPaymentDate = new Date(firstPaymentDate);
          firstPaymentDate.setDate(1);
          firstPaymentDate = new Date(firstPaymentDate);
          let getAmortArray = [];

          if (balance > 0) {
            getAmortArray = this.amortCalculation(balance, interest, term, firstPaymentDate);
            // const monthlyPayment = Number(getAmortArray[0].interest + getAmortArray[0].principal);
          }

          const data = JSON.parse(sessionStorage.getItem('user'));

          this.setState(
            {
              mortgageData: mortgage,
              mortgagePayment: paymentsData,
              userData: data,
              amortizationsArray: getAmortArray,
              isLoading: true
            },
            paymentsData.length > 0
              ? () => this.props.calculateCuurentBalance(balance, interest, term, getAmortArray, paymentsData)
              : null
          );
          this.getAdjustPaymentData(data);
        })
        .catch(err => {
          error(err.message);
          if (err.request && err.request.status === 401) {
            this.props.history.push('/login');
          }
        });
    } else {
      this.props.history.goBack();
    }
  };

  getAdjustPaymentData = data => {
    let id = this.props.match.params.id;

    fetch(get_adjust_payment + id, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: data.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.length > 0) {
          this.setState({
            adjustPaymentBalance: findresponse,
            newAdjustPaymentRowIndex: undefined
          });
        } else {
          this.setState({ importStatus: 'Imported Successfully' });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  amortCalculation = (balance, interestRate, terms, firstPaymentDate) => {
    interestRate = interestRate / 100.0;
    var amortizationsData = [];

    var monthlyRate = interestRate / 12;

    var payment = balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -terms)));

    for (var count = 0; count < terms; ++count) {
      var amortization = {
        date: undefined,
        month: undefined,
        balance: undefined,
        interest: undefined,
        principal: undefined
      };

      var interest = 0;
      var monthlyPrincipal = 0;
      var month = count + 1;
      interest = balance * monthlyRate;
      monthlyPrincipal = payment - interest;
      if (count === 0) {
        // balance = balance;
      } else {
        balance = balance - monthlyPrincipal;
      }

      if (count > 1) {
        firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
      }

      firstPaymentDate = new Date(firstPaymentDate);
      amortization.month = month;
      amortization.balance = balance;
      amortization.interest = interest;
      amortization.principal = monthlyPrincipal;
      amortization.date = firstPaymentDate;
      amortization.amount = Number(interest + monthlyPrincipal);
      amortizationsData.push(amortization);
    }

    const lastdate = amortizationsData[amortizationsData.length - 1].date;
    lastdate.setMonth(lastdate.getMonth() + 1);
    amortizationsData[amortizationsData.length - 1].date = new Date(lastdate);
    return amortizationsData;
  };

  render() {
    let id = this.props.match.params.id;

    return (
      <div className="">
        {hashCode && hashCode !== '' ? (
          <div className="pad-up">
            <button type="button" className="btn btn-orange text-left" onClick={() => this.associate()}>
              Associate
            </button>
            <button
              type="button"
              className="btn btn-orange text-left"
              onClick={() => this.addToNewUser()}
              style={{ marginLeft: '10px' }}
            >
              Add New User
            </button>
          </div>
        ) : null}
        <div className="d-flex flex-wrap align-items-start mortgage-form mb-0">
          <span style={{ width: '36px' }} />
          {hashCode && hashCode !== '' ? null : (
            <div className="flex-1 text-center ">
              <div className="main-heading-big pb-1">{this.state.mortgageData.address1}</div>
              {/* <div className="text-center pb-1">Here is address</div> */}
              <div className="text-center">
                {' '}
                {this.state.mortgageData.city}, {this.state.mortgageData.state} {this.state.mortgageData.postalcode}
              </div>
            </div>
          )}
          <span className="back-arrow shadow-arrow ml-auto" onClick={() => this.backToList(this.props.history)}>
            <img src="img/back-arrow.png" alt="back-arrow" />
          </span>
        </div>

        <Modal
          open={this.state.addToUserModal}
          classNames={{ modal: 'custom-modal' }}
          onClose={this.onCloseModal}
          center
        >
          <h2 className="modal-header">Add To New User</h2>
          <div className="modal-body">
            <div className="row">
              <div className="col-xs-6">
                <input
                  type="text"
                  placeholder="Enter email of the user"
                  defaultValue={this.state.userEmail}
                  onChange={e => this.handleUserEmail(e)}
                  maxLength="30"
                />
                <br />
                {this.state.userEmailError ? <span style={{ color: 'red' }}>Invalid User Email Format</span> : null}
              </div>

              <div className="col-xs-3 col-xs-offset-6">
                <button onClick={() => this.checkAssignToUser()} className="btn btn-block orange-bg btn-own">
                  Submit
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
        <Modal
          open={this.state.confirmAssignModal}
          classNames={{ modal: 'custom-modal' }}
          onClose={this.onCloseModal}
          center
        >
          <h2 className="modal-header"> Would you like to associate this account with this property ? </h2>
          <div className="modal-body">
            <div className="row">
              <div className="col-xs-3 col-xs-offset-6">
                <button onClick={() => this.finalAssignToUser()} className="btn btn-block orange-bg btn-own">
                  Ok
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

        <Modal
          open={this.state.userNotFoundModal}
          classNames={{ modal: 'custom-modal' }}
          onClose={this.onCloseModal}
          center
        >
          <h2 className="modal-header"> Create New User </h2>
          <div className="modal-body">
            <div
              className="login-form"
              style={{
                maxWidth: '760px',
                marginTop: '0px',
                paddingTop: '40px',
                backgroundColor: 'rgb(124, 46, 129)',
                color: 'rgb(255, 255, 255)'
              }}
            >
              <div className="container-fluid">
                <div className="row">
                  <form name="contactform" className="contactform">
                    <div className=" col-xs-12 ">
                      <div className="col-xs-12 col-md-6 nopad">
                        {' '}
                        <label className="col-xs-12">Role</label>
                        <div className="col-xs-12 form-group">
                          <input type="text" className="form-control" id="role" disabled value="Homeowner" />
                          <div className="form-img-wrapper">
                            <img src="img/user-name-icon.png" alt="userImage" />
                          </div>
                          <br />
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-6 nopad">
                        {' '}
                        <label className="col-xs-12">First Name</label>
                        <div className="col-xs-12 form-group">
                          <input
                            name="first_name"
                            type="text"
                            className="form-control"
                            id="myfirstname"
                            onChange={this.handleChange.bind(this, 'firstName')}
                            value={this.state.fields['firstName']}
                          />
                          <div className="form-img-wrapper">
                            <img src="img/user-name-icon.png" alt="userImage" />
                          </div>
                          <span style={{ color: 'red' }}>{this.state.errors['firstName']}</span>
                          <br />
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-6 nopad">
                        <label className="col-xs-12">Last Name</label>
                        <div className="col-xs-12 form-group">
                          <input
                            name="last_name"
                            type="text"
                            className="form-control"
                            id="mylastname"
                            onChange={this.handleChange.bind(this, 'lastName')}
                            value={this.state.fields['lastName']}
                          />
                          <div className="form-img-wrapper">
                            <img src="img/user-name-icon.png" alt="userImage" />
                          </div>
                          <span style={{ color: 'red' }}>{this.state.errors['lastName']}</span>
                          <br />
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-6 nopad">
                        <label className="col-xs-12">Hash Code</label>
                        <div className="col-xs-12 form-group">
                          <input
                            name="hashcode"
                            type="text"
                            className="form-control"
                            id="hashcode"
                            disabled
                            value={this.props.match.params.hashcode}
                          />
                          <div className="form-img-wrapper">
                            <img src="img/lock-icon.png" alt="lockImage" />
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-12 nopad">
                        <label className="col-xs-12">Phone Number</label>
                        <div className="col-xs-12 form-group">
                          <div className="row mini-row">
                            <div className="col-xs-4 mini-pad">
                              <input
                                type="text"
                                name="countryCode"
                                className="form-control text-center"
                                maxLength="3"
                                id="mycountry"
                                onChange={this.handleChange.bind(this, 'countryCode')}
                                value={this.state.fields['countryCode']}
                                style={{ paddingLeft: '10px' }}
                              />
                            </div>
                            <div className="col-xs-8 mini-pad">
                              <input
                                type="text"
                                className="form-control"
                                maxLength="12"
                                id="myphoneNumber"
                                onChange={this.handleChange.bind(this, 'phoneNumber')}
                                value={this.state.fields['phoneNumber']}
                                style={{ paddingLeft: '12px' }}
                                name="phoneNumber"
                              />
                            </div>

                            <span style={{ color: 'red' }}>{this.state.errors['phoneNumber']}</span>
                            <span style={{ color: 'red' }}>{this.state.errors['countryCode']}</span>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 col-md-12 nopad">
                        <label className="col-xs-12">Email</label>
                        <div className="col-xs-12 form-group">
                          <input
                            name="email"
                            type="text"
                            className="form-control"
                            id="myemail"
                            defaultValue={this.state.userEmail}
                            maxLength="30"
                          />
                          <div className="form-img-wrapper">
                            <img src="img/user-name-icon.png" alt="userImage" />
                          </div>
                          <span style={{ color: 'red' }}>{this.state.errors['email']}</span>
                          <br />
                        </div>
                      </div>
                      <div className="col-xs-12 form-group pad-up">
                        <input
                          style={{
                            backgroundColor: 'rgb(138, 9, 66)',
                            color: '#fff'
                          }}
                          onClick={() => this.contactSubmit()}
                          type="button"
                          className="form-control"
                          defaultValue="Register"
                          name="submit"
                        />
                      </div>
                      <div className="col-xs-12 form-group pad-up">
                        <input
                          style={{ backgroundColor: '#8a0942', color: '#fff' }}
                          type="button"
                          className="form-control"
                          defaultValue="Clear"
                          onClick={this.clearInput}
                          name="clear"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {hashCode && hashCode !== '' ? (
          <form className="bg-white pad-down col-xs-12 nopad" onSubmit={e => this.submitMortgageData(e)}>
            <Scrollbars className="scrollStyle" style={{ maxHeight: '60vh' }}>
              <div className="col-xs-12 nopad">
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Postal Code</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="postalcode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.postalcode || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Address:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="address1"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.address1 || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>City:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="city"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.city || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>State:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="state"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.state || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Address:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="saddress"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.saddress || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S City:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="scityname"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.scityname || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Country:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="scountyname"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.scountyname || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Country Code:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="scountycode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.scountycode || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S MSA Name:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="smsaname"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.smsaname || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S MSA Code:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="smsacode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.smsacode || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Status:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="sstatus"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.sstatus || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Zip Code:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="szipcode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.szipcode || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Lat:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="slatitude"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.slatitude || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>S Long:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="slongitude"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.slongitude || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Service Unique Account Number :</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="propertyid"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.propertyid || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Servicer:</label>
                  <select
                    disabled={hashCode === '' || !hashCode}
                    className="form-control"
                    name="servicer"
                    value={this.state.mortgageData.servicer || ''}
                    onChange={this.handleMortgageChange}
                  >
                    <option disabled value="">
                      Select Company
                    </option>
                    {this.state.companyList.length > 0 &&
                      this.state.companyList.map((res, index) => (
                        <option key={index} value={res.id}>
                          {res.company_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Hash Code :</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="property_hashcode"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.property_hashcode || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>First Mortgage Loan Amount:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="first_mortgage_loan_amount"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.first_mortgage_loan_amount || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Loan Term</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="loan_term"
                    type="number"
                    className="form-control"
                    value={this.state.mortgageData.loan_term || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Loan Type</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="loan_type"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.loan_type || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Loan Interest Rate</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="loan_intrest_rate"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.loan_intrest_rate || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Loan Closing Date</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="loan_closing_date"
                    type="date"
                    className="form-control"
                    value={
                      this.state.mortgageData.loan_closing_date
                        ? moment(this.state.mortgageData.loan_closing_date).format('YYYY-MM-DD')
                        : new Date()
                    }
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>First Payment Date</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="first_payment_due_date"
                    type="date"
                    className="form-control"
                    value={
                      this.state.mortgageData.first_payment_due_date
                        ? moment(this.state.mortgageData.first_payment_due_date).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Monthly Payment Date</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="monthly_payment_date"
                    type="date"
                    className="form-control"
                    value={
                      this.state.mortgageData.monthly_payment_date
                        ? moment(this.state.mortgageData.monthly_payment_date).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Organization Date</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="organization_date"
                    type="date"
                    className="form-control"
                    value={
                      this.state.mortgageData.organization_date
                        ? moment(this.state.mortgageData.organization_date).format('YYYY-MM-DD')
                        : ''
                    }
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>GSE Loan</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="gse_loan"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.gse_loan || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Risk Holder</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="risk_holder"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.risk_holder || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Fico Score:</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="fico_score"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.fico_score || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Lat</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="lat"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.lat || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Long</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="long"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.long || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Icensu Year</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="icensusyear"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.icensusyear || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Appraised Value</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="appraised_value"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.appraised_value || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>

                <div className="form-group col-xs-6 col-sm-3">
                  <label>Arm Index</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="arm_index"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.arm_index || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Arm Margin</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="arm_margin"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.arm_margin || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Arm Periodic</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="arm_periodic"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.arm_periodic || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Arm Fequency Payment</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="arm_frequency_payment"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.arm_frequency_payment || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
                <div className="form-group col-xs-6 col-sm-3">
                  <label>Diversified Notional Price</label>
                  <input
                    disabled={hashCode === '' || !hashCode}
                    name="arm_diverse_notional_price"
                    type="text"
                    className="form-control"
                    value={this.state.mortgageData.arm_diverse_notional_price || ''}
                    onChange={this.handleMortgageChange}
                  />
                </div>
              </div>
            </Scrollbars>
            {hashCode && hashCode !== '' ? (
              <div className="col-xs-12 nopad" style={{ marginTop: '5px' }}>
                <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                  <button
                    type="submit"
                    disabled={
                      JSON.stringify(this.state.mortgageData) === JSON.stringify(this.props.selectedMortgageData)
                    }
                    className="btn btn-success btn-block"
                  >
                    Save
                  </button>
                </div>
                <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                  <button type="button" className="btn btn-orange btn-block" onClick={this.cancelMortgageUpdation}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        ) : (
          <div className="d-flex flex-wrap align-items-center pad-up-down col-xs-12 mt-3 bg-white">
            <div className="flex-1 px-3 font-16">
              <span>Current Balance: </span>
              <span className="font-600">{this.state.fee ? Number(this.state.fee).toFixed(2) : null}</span>
            </div>
            <div className="px-2 ml-auto">
              <button className="btn btn-orange">Pay Now</button>
            </div>
            <div className="col-xs-12 px-2 text-right pad-up-down">
              <Link to={'/user-payment/' + id + '/' + poolId}>View payment history page</Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}

PropertyUpdate.defaultProps = {
  poolHistoryStateData: [],
  selectedMortgageData: {},
  saveSelectedMortgageData: undefined,
  poolId: ''
};

PropertyUpdate.propTypes = {
  selectedMortgageData: PropTypes.object,
  poolId: PropTypes.string
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData,
    selectedMortgageData: state.admin.selectedMortgageData,
    poolId: state.borrow.poolId
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    saveSelectedMortgageData: (mortgageData, paymentData) =>
      dispatch(saveSelectedMortgageData(mortgageData, paymentData)),
    clearSelectedMortgageData: (searchMortgage, searchAdminText) =>
      dispatch(clearSelectedMortgageData(searchMortgage, searchAdminText)),
    error: data => dispatch(error(data)),
    success: data => dispatch(success(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PropertyUpdate));
