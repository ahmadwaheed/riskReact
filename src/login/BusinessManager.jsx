import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import { addUpdateBusiness, getBusinessList, deleteBusiness } from '../actions/admin/mortgage_pool_container';
import NavigationBar from '../home/NavigationTab';
import Loader from '../Loder/Loders';
import MessageNotification from '../MessageNotification';

class BusinessManager extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      businessData: [],
      fields: {
        businessName: '',
        phoneNumber: '',
        address: '',
        partnerType: '',
        publicUrl: '',
        businessId: '',
        notes: ''
      },
      businessType: '',
      isType: false,
      errors: {}
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.loadBusinessList();
    }
  };

  loadBusinessList = () => {
    getBusinessList(this.props.userData.token).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }

      this.setState({
        businessData: res,
        isLoader: true
      });
    });
  };

  openModal = type => {
    this.setState({
      isModalOpen: true,
      modalHeader: type,
      businessType: '',
      fields: {
        businessName: '',
        phoneNumber: '',
        address: '',
        publicUrl: '',
        businessId: '',
        notes: ''
      }
    });
  };

  openEditModal = (type, business) => {
    this.setState({
      isModalOpen: true,
      modalHeader: type,
      fields: {
        businessName: business.company_name !== null && business.company_name !== 'null' ? business.company_name : '',
        phoneNumber: business.phone_no !== null && business.phone_no !== 'null' ? business.phone_no : '',
        address: business.address !== null && business.address !== 'null' ? business.address : '',
        publicUrl: business.public_url !== null && business.public_url !== 'null' ? business.public_url : '',
        notes: business.note !== null && business.note !== 'null' ? business.note : '',
        businessId: business.id
      },
      businessType: business.partner_type !== null && business.partner_type !== 'null' ? business.partner_type : ''
    });
  };

  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
      modalHeader: '',
      isType: false,
      businessType: '',
      id: '',
      fields: {
        businessName: '',
        phoneNumber: '',
        address: '',
        publicUrl: '',
        businessId: '',
        notes: ''
      }
    });
  };

  openDeleteModal = id => {
    this.setState({ isDeletedOpen: true, id: id });
  };

  onDeleteCloseModal = () => {
    this.setState({ isDeletedOpen: false, id: '' });
  };

  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields['businessName']) {
      formIsValid = false;
      errors['businessName'] = 'Name Cannot be empty';
    }

    //address
    if (!fields['address']) {
      formIsValid = false;
      errors['address'] = 'Cannot be empty';
    }

    //notes
    if (!fields['notes']) {
      formIsValid = false;
      errors['notes'] = 'Cannot be empty';
    }

    //pub;icUrl
    if (!fields['publicUrl']) {
      formIsValid = false;
      errors['publicUrl'] = 'Cannot be empty';
    }

    //Email
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

    this.setState({ errors: errors });
    return formIsValid;
  }

  contactSubmit = e => {
    e.preventDefault();
    if (this.state.businessType === '') {
      this.setState({
        isType: true
      });
    }

    if (this.handleValidation() && this.state.businessType !== '') {
      addUpdateBusiness(
        this.props.userData,
        this.state.fields.businessName,
        this.state.fields.phoneNumber,
        this.state.fields.address,
        this.state.fields.publicUrl,
        this.state.businessType,
        this.state.fields.businessId,
        this.state.fields.notes
      ).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res) {
          this.setState({
            fields: {
              businessName: '',
              phoneNumber: '',
              address: '',
              publicUrl: '',
              businessId: '',
              notes: ''
            },
            businessType: '',
            isType: false
          });
          this.onCloseModal();
          this.loadBusinessList();
        }
      });
    }
  };

  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }

  onBusinessTypeChanged = e => {
    this.setState({
      businessType: e.currentTarget.value,
      isType: false
    });
  };

  delete = () => {
    this.setState({
      isLoader: false
    });

    deleteBusiness(this.props.userData.token, this.state.id).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      }

      this.setState({
        isLoader: true,
        id: ''
      });
      this.loadBusinessList();
      this.onDeleteCloseModal();
    });
  };

  render() {
    const { radioStyle, spanStyle } = styles;

    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isBusiness={true} />
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 text-right">
                  <button className="btn orange-bg btn-own" onClick={() => this.openModal('Add Business')}>
                    Add New Business
                  </button>
                </div>
                <div className="col-xs-12 table-responsive">
                  {/* <Scrollbars id="mortgageDataElement" className="scrollStyle" style={{ maxHeight: "60vh" }}> */}
                  <Loader myview={this.state.isLoader} />
                  <table className="table table-borderless">
                    <thead id="mortgageData" style={{}}>
                      <tr>
                        <th className="text-center">Business Name</th>
                        <th className="text-center">Phone Number</th>
                        <th className="text-center">Address</th>
                        <th className="text-center">Partner Type</th>
                        <th className="text-center">Public Url</th>
                        <th className="text-justify">Notes</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.businessData.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {data.company_name !== null && data.company_name !== 'null' ? data.company_name : ''}
                          </td>
                          <td className="text-center">
                            {data.phone_no !== null && data.phone_no !== 'null' ? data.phone_no : ''}
                          </td>
                          <td className="text-center">
                            {data.address !== null && data.address !== 'null' ? data.address : ''}
                          </td>
                          <td className="text-center">
                            {data.partner_type !== null && data.partner_type !== 'null' ? data.partner_type : ''}
                          </td>
                          <td className="text-center">
                            {data.public_url !== null && data.public_url !== 'null' ? data.public_url : ''}
                          </td>
                          <td className="text-justify" style={{ maxWidth: '150px' }}>
                            {data.note !== null && data.note !== 'null' ? data.note : ''}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              title="Edit"
                              className="btn-controls"
                              onClick={() => this.openEditModal('Update Business', data)}
                            >
                              <i className="fa fa-pencil" />
                            </button>
                            <button
                              type="button"
                              title="Remove"
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
                  {/* </Scrollbars> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal open={this.state.isModalOpen} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
          <h2 className="modal-header">{this.state.modalHeader}</h2>
          <div className="modal-body">
            <div className=" pad-left-righ-xs">
              <section
                className="login-form"
                style={{
                  marginTop: '0px',
                  paddingTop: '25px',
                  backgroundColor: 'rgb(124, 46, 129)',
                  color: '#fff'
                }}
              >
                <div className="container-fluid">
                  <div className="row">
                    <form name="contactform" className="contactform" onSubmit={this.contactSubmit.bind(this)}>
                      <div className=" col-xs-12 ">
                        <div>
                          {' '}
                          <label className="col-xs-12">Name</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              id="mybusinessname"
                              onChange={this.handleChange.bind(this, 'businessName')}
                              value={this.state.fields['businessName']}
                            />
                            <span style={{ color: 'red' }}>{this.state.errors['businessName']}</span>
                            <br />
                          </div>
                        </div>
                        <div>
                          <label className="col-xs-12">Phone Number</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              name="phone_number"
                              className="form-control"
                              maxLength="12"
                              id="myphoneNumber"
                              onChange={this.handleChange.bind(this, 'phoneNumber')}
                              value={this.state.fields['phoneNumber']}
                            />
                            <span style={{ color: 'red' }}>{this.state.errors['phoneNumber']}</span>
                            <br />
                          </div>
                        </div>
                        <div>
                          <label className="col-xs-12">Address</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              id="myaddress"
                              onChange={this.handleChange.bind(this, 'address')}
                              value={this.state.fields['address']}
                            />
                            <span style={{ color: 'red' }}>{this.state.errors['address']}</span>
                            <br />
                          </div>
                        </div>
                        <div>
                          <label className="col-xs-12">Public Url</label>
                          <div className="col-xs-12 form-group">
                            <input
                              type="text"
                              name="public_url"
                              className="form-control"
                              id="url"
                              onChange={this.handleChange.bind(this, 'publicUrl')}
                              value={this.state.fields['publicUrl']}
                            />
                            <span style={{ color: 'red' }}>{this.state.errors['publicUrl']}</span>
                            <br />
                          </div>
                        </div>
                        <div>
                          <label className="col-xs-12">Notes</label>
                          <div className="col-xs-12 form-group" style={{ minHeight: '72px' }}>
                            <textarea
                              style={{ minHeight: '72px' }}
                              className=" col-xs-12 form-control"
                              htmlFor=""
                              maxLength="100"
                              name="note"
                              onChange={this.handleChange.bind(this, 'notes')}
                              value={this.state.fields['notes']}
                            />
                            <span style={{ color: 'red' }}>{this.state.errors['notes']}</span>
                            <br />
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <label>
                            {' '}
                            <input
                              style={{ ...radioStyle }}
                              type="radio"
                              name="servicerType"
                              value="Servicer"
                              checked={this.state.businessType === 'Servicer'}
                              onChange={event => this.onBusinessTypeChanged(event)}
                            />
                            <span style={{ ...spanStyle }}>Servicer</span>
                          </label>

                          <label>
                            {' '}
                            <input
                              style={{ ...radioStyle }}
                              type="radio"
                              name="originators"
                              value="Originator"
                              checked={this.state.businessType === 'Originator'}
                              onChange={event => this.onBusinessTypeChanged(event)}
                            />
                            <span style={{ ...spanStyle }}>Originator</span>
                          </label>

                          <label>
                            {' '}
                            <input
                              style={{ ...radioStyle }}
                              type="radio"
                              name="swapFunder"
                              value="Swap Funder"
                              checked={this.state.businessType === 'Swap Funder'}
                              onChange={event => this.onBusinessTypeChanged(event)}
                            />
                            <span style={{ ...spanStyle }}>Swap Funder</span>
                          </label>
                          <div>
                            {this.state.isType ? <span style={{ color: 'red' }}>Select one Business type.</span> : null}
                          </div>
                        </div>

                        <div className="col-xs-12 form-group pad-up">
                          <input type="submit" className="form-control" defaultValue="Submit" />
                        </div>
                        <Loader myview={true} />
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
          <h2 className="modal-header">Delete</h2>
          <div className="modal-body">
            <p className="pad-down">Do you want to permanantly delete ?</p>
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

const styles = {
  radioStyle: {
    position: 'relative',
    top: '3px',
    marginRight: '5px',
    width: '1em',
    height: '1em',
    fontSize: '18px'
  },
  spanStyle: {
    marginRight: '10px',
    fontSize: '16px'
  }
};

BusinessManager.defaultProps = {
  addUpdateBusiness: undefined,
  userData: {},
  getBusinessList: undefined,
  deleteBusiness: undefined
};

BusinessManager.propTypes = {
  poolPeriods: PropTypes.arrayOf(Object),
  addUpdateBusiness: PropTypes.func,
  getBusinessList: PropTypes.func,
  userData: PropTypes.objectOf(String),
  deleteBusiness: PropTypes.func
};

const mapStateToProps = state => {
  return {
    poolPeriods: state.admin.poolPeriods,
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { addUpdateBusiness, getBusinessList, deleteBusiness }
)(withRouter(BusinessManager));
