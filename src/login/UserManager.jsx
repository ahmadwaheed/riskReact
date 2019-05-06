import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import { getUserList, getCompanyList, addUpdateUserData, deleteUser } from '../actions/admin/mortgage_pool_container';
import { forgetPassword } from '../actions/login/loginAction';
import NavigationBar from '../home/NavigationTab';
import Loader from '../Loder/Loders';
import MessageNotification from '../MessageNotification';
import SearchMortgage from '../SearchMortgageList';
import { Scrollbars } from 'react-custom-scrollbars';
let check = false;

class UserManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      userData: [],
      companyData: [],
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        userId: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1',
        isClass: false
      },
      isRole: false,
      companyName: '',
      isType: false,
      currentpage: 1,
      limit: 200,
      offset: 0,
      next: false,
      prev: false,
      totalValues: 0,
      totalPages: 0,
      errors: {},
      checked: false,
      searchText: '',
      isPassword: false
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

      this.loadUserList(this.state.currentpage, this.state.limit, this.state.searchText, this.state.checked);
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

  loadUsers = (currentpage, limit, searchText, checked) => {
    if (document.getElementById('userDataElement')) {
      document.getElementById('userDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
    }

    this.loadUserList(currentpage, limit, searchText, checked);
  };

  loadUserList = (pageno, pageSize, value, check) => {
    this.setState({
      isLoading: false
    });
    var data = {
      limit: this.state.limit,
      offset: (pageno - 1) * pageSize
    };
    let showArchive = 0;

    if (check) {
      showArchive = 1;
    }

    getUserList(this.props.userData.token, data, value, showArchive).then(res => {
      if (res && res.data) {
        let pre;
        let next;
        pre = data.offset >= 200 ? true : false;
        next = res.data.length + data.offset < res.total_count ? true : false;

        this.setState({
          userData: res.data,
          isLoader: true,
          currentpage: pageno,
          prev: pre,
          next: next,
          totalPages: Math.ceil(res.total_count / this.state.limit)
        });
        if (check) {
          this.setState({
            isClass: true
          });
        } else {
          this.setState({
            isClass: false
          });
        }
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }
    });
  };

  displayNext() {
    return (
      <div className="flex-center" style={{ marginTop: '10px' }}>
        <div className="total-value" />
        <div
          style={{
            backgroundColor: '#fff',
            padding: '5px 5px',
            marginLeft: 'auto',
            marginRight: '10px'
          }}
        >
          Pages :{this.state.currentpage}/{this.state.totalPages}
        </div>
        <ul className="pagination-own list-inline">
          {this.state.prev ? (
            <li
              onClick={() =>
                this.loadUsers(this.state.currentpage - 1, this.state.limit, this.state.searchText, this.state.checked)
              }
            >
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          ) : (
            <li className="disabled">
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          )}
          {this.state.next ? (
            <li
              onClick={() =>
                this.loadUsers(this.state.currentpage + 1, this.state.limit, this.state.searchText, this.state.checked)
              }
            >
              <i className="fa fa-angle-double-right" />{' '}
            </li>
          ) : (
            <li className="disabled">
              <i className="fa fa-angle-double-right" />
            </li>
          )}
        </ul>
      </div>
    );
  }

  openModal = type => {
    this.setState({
      isModalOpen: true,
      modalHeader: type,
      companyData: [],
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        userId: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      companyName: '',
      isRole: false,
      isType: false
    });
  };

  openEditModal = (type, data) => {
    let partnerData;
    let array = [];

    if (data.company_name !== null && data.company_name !== 'null') {
      partnerData = {
        company_name: data.company_name,
        id: data.partner_id
      };
      array.push(partnerData);
    }

    this.setState({
      isModalOpen: true,
      modalHeader: type,
      fields: {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        role: data.role,
        userId: data.id,
        phoneNumber: data.phonenumber || '',
        countryCode: data.countrycode || '1'
      },
      companyName: data.partner_id,
      companyData: array,
      isRole: false,
      isType: false
    });
  };

  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
      modalHeader: '',
      companyData: [],
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        userId: '',
        hashcode: '',
        phoneNumber: '',
        countryCode: '1'
      },
      companyName: '',
      isRole: false,
      isType: false
    });
  };

  openDeleteModal = id => {
    this.setState({
      isDeletedOpen: true,
      fields: {
        userId: id
      }
    });
  };

  onDeleteCloseModal = () => {
    this.setState({
      isDeletedOpen: false,
      fields: {
        userId: ''
      }
    });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields['firstName']) {
      formIsValid = false;
      errors['firstName'] = 'First Name Cannot be empty';
    }

    if (!fields['lastName']) {
      formIsValid = false;
      errors['lastName'] = 'Last Name Cannot be empty';
    }

    //Password
    if (this.state.fields.role !== 'Homeowner' && this.state.modalHeader !== 'Update User') {
      if (!fields['password']) {
        formIsValid = false;
        errors['password'] = 'Cannot be empty';
      }

      if (typeof fields['password'] !== 'undefined') {
        if (!fields['password'].match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
          formIsValid = false;

          errors['password'] = 'Min. 8 charcter long and have atleast 1 uppercase,1 lowercase, 1 symbol, 1 number';
        }
      }

      if (!fields['confirmPassword']) {
        formIsValid = false;
        errors['confirmPassword'] = 'Cannot be empty';
      }

      if (typeof fields['confirmPassword'] !== 'undefined') {
        if (!fields['confirmPassword'].match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
          formIsValid = false;

          errors['confirmPassword'] =
            'Min. 8 charcter long and have atleast 1 uppercase,1 lowercase, 1 symbol, 1 number';
        }
      }
    }

    //Email
    if (!fields['email']) {
      formIsValid = false;
      errors['email'] = 'Email Cannot be empty';
    }

    if (typeof fields['email'] !== 'undefined') {
      let lastAtPos = fields['email'].lastIndexOf('@');
      let lastDotPos = fields['email'].lastIndexOf('.');

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields['email'].indexOf('@@') === -1 &&
          lastDotPos > 2 &&
          fields['email'].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors['email'] = 'Email is not valid';
      }
    }

    // if (this.state.fields.role === 'Homeowner' && this.state.modalHeader !== 'Update User') {
    //   if (!fields['hashcode']) {
    //     formIsValid = false;
    //     errors['hashcode'] = 'Cannot be empty';
    //   }

    //   if (typeof fields['hashcode'] !== 'undefined') {
    //     if (!fields['hashcode'].match(/^[2-9A-Z]+$/) || fields['hashcode'].length !== 10) {
    //       formIsValid = false;
    //       errors['hashcode'] = 'only capital letter and digit except 0 and 1';
    //     }
    //   }
    // }

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

  contactSubmit = e => {
    this.setState({
      isLoader: false
    });
    e.preventDefault();

    if (this.handleValidation()) {
      if (this.state.fields.role === '') {
        this.setState({
          isRole: true,
          isLoader: true
        });
      } else if (this.state.companyData.length > 0 && this.state.companyName === '') {
        this.setState({
          isType: true,
          isLoader: true
        });
      } else {
        if (this.state.fields.password === this.state.fields.confirmPassword) {
          this.setState({
            isPassword: false
          });

          addUpdateUserData(
            this.props.userData,
            this.state.fields.firstName,
            this.state.fields.lastName,
            this.state.fields.email,
            this.state.fields.role,
            this.state.companyName,
            this.state.fields.userId,
            this.state.fields.password,
            this.state.fields.hashcode,
            this.state.fields.phoneNumber,
            this.state.fields.countryCode
          ).then(res => {
            if (res && res.request && res.request.status === 401) {
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
                  userId: '',
                  hashcode: '',
                  phoneNumber: '',
                  countryCode: '1'
                },
                companyName: '',
                companyData: [],
                isType: false,
                isRole: false,
                isLoader: true
              });
              this.onCloseModal();

              this.loadUserList(1, 200, this.state.searchText, this.state.checked);
            } else {
              this.setState({
                isPassword: true,
                isLoader: true
              });
            }
          });
        } else {
          this.setState({
            isPassword: true,
            isLoader: true
          });
        }
      }
    }
  };

  handleChange(field, e) {
    if (field === 'role') {
      this.setState({
        companyName: '',
        companyData: []
      });
      if (e.target.value === 'Originator' || e.target.value === 'Swap Funder' || e.target.value === 'Servicer') {
        this.setState({
          isLoader: false
        });
        if (e.target.value === 'Homeowner') {
          this.setState({
            isPassword: false
          });
        }

        getCompanyList(this.props.userData.token, e.target.value).then(res => {
          if (res && res.data) {
            this.setState({
              companyData: res.data,
              isLoader: true
            });
          } else if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          }
        });
      }
    }

    if (field === 'companyName') {
      this.setState({
        companyName: e.target.value
      });
    } else {
      let fields = this.state.fields;
      fields[field] = e.target.value;
      this.setState({ fields });
    }
  }

  delete = () => {
    this.setState({
      isLoader: false
    });

    deleteUser(this.props.userData.token, this.state.fields.userId, this.state.checked).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          isLoader: true,
          companyData: []
        });

        this.loadUserList(this.state.currentpage, this.state.limit, this.state.searchText, this.state.checked);
        this.onDeleteCloseModal();
      }
    });
  };

  handleSubmitSearch = value => {
    this.setState({
      searchText: value
    });
    this.loadUserList(1, 200, value, this.state.checked);
  };

  resetInput = () => {
    this.setState({
      searchText: ''
    });
    this.loadUserList(1, 200, '', this.state.checked);
  };

  handleChangeSeach = value => {
    if (value === '') {
      this.resetInput();
    }
  };

  handleCheck = () => {
    check = !check;
    this.setState({ checked: check });
    if (check) {
      this.loadUserList(this.state.currentpage, this.state.limit, this.state.searchText, check);
    } else {
      this.loadUserList(this.state.currentpage, this.state.limit, this.state.searchText, check);
    }
  };

  resetPassword = email => {
    this.setState({
      isLoader: false
    });

    forgetPassword(email).then(res => {
      if (res) {
        this.setState({
          isLoader: true,
          isModalOpen: false
        });
      }
    });
  };

  render() {
    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isUser={true} />
                <div className="col-md-4 pull-right" style={{ marginTop: '20px' }}>
                  <SearchMortgage
                    handleSubmit={this.handleSubmitSearch}
                    handleReset={this.resetInput}
                    handleOnchange={this.handleChangeSeach}
                  />
                </div>
                <div style={{ marginTop: '62px' }}>
                  <button className="btn orange-bg btn-own" onClick={() => this.openModal('Add User')}>
                    Add New User
                  </button>
                </div>
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 text-right pad-down">
                  <div className="text-left">
                    <input
                      style={{
                        width: '1em',
                        height: '1em',
                        fontSize: '21px',
                        marginRight: '10px'
                      }}
                      type="checkbox"
                      name="archiveUser"
                      onChange={this.handleCheck}
                      defaultChecked={this.state.checked}
                    />
                    <span style={{ verticalAlign: 'top', fontSize: '22px' }}>Archive User</span>
                  </div>
                </div>
                <div className="col-xs-12" />
                <div className="col-xs-12 table-responsive">
                  <Scrollbars
                    id="userDataElement"
                    className="scrollStyle"
                    style={{ maxHeight: '50vh', minHeight: '50vh' }}
                  >
                    {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                    <table className="table table-borderless">
                      <thead id="userData" style={{ backgroundColor: '#fff' }}>
                        <tr>
                          <th className="text-center">User Id</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Email</th>
                          <th className="text-center">Role</th>
                          <th className="text-center">Phone Number</th>
                          <th className="text-center">Company Name</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.userData &&
                          this.state.userData.length > 0 &&
                          this.state.userData.map((data, index) => (
                            <tr className={this.state.isClass ? 'bg-danger' : null} key={index}>
                              <td className="text-center">{data.id}</td>
                              <td className="text-center">
                                {data.first_name} {data.last_name}
                              </td>
                              <td className="text-center">{data.email}</td>
                              <td className="text-center">{data.role}</td>
                              <td className="text-center">
                                {data.countrycode && data.phonenumber
                                  ? '(' + data.countrycode + ')-' + data.phonenumber
                                  : null}
                              </td>
                              <td className="text-center">{data.company_name}</td>
                              <td className="text-center">
                                {!this.state.isClass ? (
                                  <button
                                    style={
                                      this.state.isClass
                                        ? { backgroundColor: '#78094e' }
                                        : { backgroundColor: '#ff8505' }
                                    }
                                    type="button"
                                    title="Edit"
                                    className="btn-controls"
                                    onClick={() => this.openEditModal('Update User', data)}
                                  >
                                    <i className="fa fa-pencil" />
                                  </button>
                                ) : null}
                                <button
                                  style={
                                    this.state.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }
                                  }
                                  type="button"
                                  title={this.state.checked ? 'UnArchive' : 'Archive'}
                                  className="btn-controls"
                                  onClick={() => this.openDeleteModal(data.id)}
                                >
                                  <i className="fa fa-times" aria-hidden="true" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                  {(this.state.next || this.state.prev) && this.state.userData.length > 0 ? (
                    <div>{this.displayNext()} </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal open={this.state.isModalOpen} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
          <h2 className="modal-header">{this.state.modalHeader}</h2>
          <div className="modal-body">
            {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
            <div className=" pad-left-righ-xs">
              <section
                className="login-form"
                style={{
                  maxWidth: '760px',
                  minHeight: '630px',
                  marginTop: '0px',
                  paddingTop: '40px',
                  backgroundColor: 'rgb(124, 46, 129)',
                  color: '#fff'
                }}
              >
                <div className="container-fluid">
                  <div className="row">
                    <form name="contactform" className="contactform">
                      <div className=" col-xs-12 ">
                        <div className="col-xs-12 col-md-6 nopad">
                          {' '}
                          <label className="col-xs-12">First Name</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              name="firstName"
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
                              type="text"
                              name="lastName"
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
                          <label className="col-xs-12">Email</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              name="email"
                              className="form-control"
                              id="myemail"
                              onChange={this.handleChange.bind(this, 'email')}
                              value={this.state.fields['email']}
                            />
                            <div className="form-img-wrapper">
                              <img src="img/user-name-icon.png" alt="userImage" />
                            </div>
                            <span style={{ color: 'red' }}>{this.state.errors['email']}</span>
                            <br />
                          </div>
                        </div>

                        <div className="col-xs-12 col-md-6 nopad">
                          <label className="col-xs-12">Phone Number</label>
                          <div className="col-xs-12 form-group">
                            <div className="row mini-row">
                              <div className="col-xs-3 mini-pad">
                                <input
                                  type="text"
                                  name="country"
                                  className="form-control text-center"
                                  maxLength="3"
                                  id="mycountry"
                                  onChange={this.handleChange.bind(this, 'countryCode')}
                                  value={this.state.fields['countryCode']}
                                  style={{ paddingLeft: '10px' }}
                                />
                              </div>
                              <div className="col-xs-9 mini-pad">
                                <input
                                  type="text"
                                  name="phoneNumber"
                                  className="form-control"
                                  maxLength="12"
                                  id="myphoneNumber"
                                  onChange={this.handleChange.bind(this, 'phoneNumber')}
                                  value={this.state.fields['phoneNumber']}
                                  style={{ paddingLeft: '12px' }}
                                />
                              </div>

                              <span style={{ color: 'red' }}>{this.state.errors['phoneNumber']}</span>
                              <span style={{ color: 'red' }}>{this.state.errors['countryCode']}</span>
                              <br />
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-12 col-md-6 nopad">
                          <label className="col-xs-12">Role </label>
                          <div className="col-xs-12 form-group">
                            <select
                              className="form-control"
                              value={this.state.fields['role'] || ''}
                              onChange={this.handleChange.bind(this, 'role')}
                            >
                              <option disabled value="">
                                Select Role
                              </option>
                              <option value="Admin">Admin</option>
                              <option value="Homeowner">Home Owner</option>
                              <option value="Originator">Originator</option>
                              <option value="Swap Funder">Swap Funder</option>
                              <option value="Servicer">Servicer</option>
                            </select>
                            {this.state.isRole ? <span style={{ color: 'red' }}>Please Select Role</span> : null}
                            <br />
                          </div>
                        </div>
                        {this.state.fields.userId === '' &&
                        this.state.fields.role !== 'Homeowner' &&
                        this.state.modalHeader !== 'Update User' ? (
                          <div className="col-xs-12 nopad">
                            <div className="col-xs-12 col-md-6 nopad">
                              <label className="col-xs-12">Password</label>
                              <div className="col-xs-12 form-group">
                                <input
                                  type="password"
                                  name="password"
                                  className="form-control"
                                  id="mypassword"
                                  onChange={this.handleChange.bind(this, 'password')}
                                  value={this.state.fields['password']}
                                />
                                <div className="form-img-wrapper">
                                  <img src="img/lock-icon.png" alt="lockImage" />
                                </div>
                                <span style={{ color: 'red' }}>{this.state.errors['password']}</span>
                                <br />
                              </div>
                            </div>

                            <div className="col-xs-12 col-md-6 nopad">
                              <label className="col-xs-12">Confirm Password</label>
                              <div className="col-xs-12 form-group">
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  className="form-control"
                                  id="myconfirmpassword"
                                  onChange={this.handleChange.bind(this, 'confirmPassword')}
                                  value={this.state.fields['confirmPassword']}
                                />
                                <div className="form-img-wrapper">
                                  <img src="img/lock-icon.png" alt="lockImage" />
                                </div>
                                <span style={{ color: 'red' }}>{this.state.errors['confirmPassword']}</span>
                                {this.state.isPassword ? (
                                  <span style={{ color: 'red' }}>Password miss match</span>
                                ) : null}
                                <br />
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* {this.state.fields.role === 'Homeowner' && this.state.modalHeader !== 'Update User' ? (
                          <div className="col-xs-12 col-md-6 nopad">
                            <label className="col-xs-12">Hash Code</label>
                            <div className="col-xs-12 form-group">
                              <input
                                type="text"
                                name="hashCode"
                                className="form-control"
                                id="hashcode"
                                onChange={this.handleChange.bind(this, 'hashcode')}
                                value={this.state.fields['hashcode']}
                              />
                              <div className="form-img-wrapper">
                                <img src="img/lock-icon.png" alt="lockImage" />
                              </div>
                              <span style={{ color: 'red' }}>{this.state.errors['hashcode']}</span>

                              <br />
                            </div>
                          </div>
                        ) : null} */}
                        {this.state.companyData && this.state.companyData.length > 0 ? (
                          <div className="col-xs-12 col-md-6 nopad">
                            <label className="col-xs-12">Company </label>
                            <div className="col-xs-12 form-group">
                              <select
                                className="form-control"
                                value={this.state.companyName || ''}
                                onChange={this.handleChange.bind(this, 'companyName')}
                              >
                                <option disabled value="">
                                  Select Company
                                </option>
                                {this.state.companyData && this.state.companyData.length > 0
                                  ? this.state.companyData.map((com, index) => (
                                      <option key={index + 'opt'} value={com.id}>
                                        {com.company_name}
                                      </option>
                                    ))
                                  : null}
                              </select>
                              {this.state.isType ? <span style={{ color: 'red' }}>Please Select Company</span> : null}
                              <br />
                            </div>
                          </div>
                        ) : null}

                        <div className="col-xs-12 form-group pad-up">
                          <input
                            style={{
                              backgroundColor: 'rgb(138, 9, 66)',
                              color: '#fff'
                            }}
                            onClick={this.contactSubmit.bind(this)}
                            type="button"
                            className="form-control"
                            defaultValue={this.state.modalHeader !== 'Update User' ? 'Register' : 'Edit'}
                          />
                        </div>
                        {this.state.modalHeader === 'Update User' ? (
                          <div className="col-xs-12 form-group pad-up">
                            <input
                              style={{
                                backgroundColor: 'rgb(138, 9, 66)',
                                color: '#fff'
                              }}
                              onClick={() => this.resetPassword(this.state.fields['email'])}
                              type="button"
                              className="form-control"
                              defaultValue="Reset Password"
                              name="resetPassword"
                            />
                          </div>
                        ) : null}
                        <div className="col-xs-12 form-group pad-up">
                          <input
                            style={{
                              backgroundColor: '#8a0942',
                              color: '#fff'
                            }}
                            type="button"
                            className="form-control"
                            defaultValue="Cancel"
                            onClick={this.onCloseModal}
                            name="closeModal"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Modal>
        <Modal
          open={this.state.isDeletedOpen}
          classNames={{ modal: 'custom-modal' }}
          onClose={this.onDeleteCloseModal}
          center
        >
          <h2 className="modal-header">{this.state.checked ? 'Un-Archive' : 'Archive'}</h2>
          <div className="modal-body">
            <p className="pad-down">
              {this.state.checked
                ? 'Are you sure you want to un-archive(show) this user?'
                : 'Are you sure you want to archive(hide) this user?'}
            </p>
            <div className="row">
              <div className="col-xs-3 col-xs-offset-6">
                <button onClick={() => this.delete()} className="btn btn-block orange-bg btn-own">
                  YES
                </button>
              </div>
              <div className="col-xs-3 text-right">
                <button onClick={this.onDeleteCloseModal} className="btn btn-block orange-bg btn-own">
                  NO
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

UserManager.defaultProps = {
  getUserList: undefined,
  getCompanyList: undefined,
  userData: {},
  addUpdateUserData: undefined,
  deleteUser: undefined,
  forgetPassword: undefined
};

UserManager.propTypes = {
  poolPeriods: PropTypes.arrayOf(Object),
  getUserList: PropTypes.func,
  getCompanyList: PropTypes.func,
  userData: PropTypes.objectOf(String),
  addUpdateUserData: PropTypes.func,
  deleteUser: PropTypes.func,
  forgetPassword: PropTypes.func
};

const mapStateToProps = state => {
  return {
    poolPeriods: state.admin.poolPeriods,
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getUserList, getCompanyList, addUpdateUserData, deleteUser, forgetPassword }
)(withRouter(UserManager));
