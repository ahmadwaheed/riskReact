import React, { Component } from 'react';
import * as myapi from '../../ConfigUri'; // we imported the ConfigUri file for getting all url'../../ConfigUri'
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Displayalllist from './displaylllist';
import {
  handleBackButtonFromAdavanceSearch,
  handleAdvancedSearchFilter,
  handleAdvanceSearchData
} from '../../actions/map/MapAction';
import { error } from '../../actions/login/loginAction';

class AdvanceSearch extends Component {
  //XXXXXXXXXXXXXXXXXXXXXXXXXfunction XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  bacKToMap = () => {
    this.props.handleBackButtonFromAdavanceSearch();
  };

  clearFilter() {
    var data = {
      limit: 10,
      offset: 0
    };
    document.getElementById('borrower_name').value = null;
    document.getElementById('accountno').value = null;
    document.getElementById('city').value = null;
    document.getElementById('state').value = null;
    document.getElementById('street').value = null;
    document.getElementById('msaname').value = null;

    fetch(myapi.advancesearchlist, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(data)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (!findresponse) {
          return;
        } else {
          this.props.handleAdvanceSearchData(findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  }

  getAdvanceSearch() {
    var data = {
      limit: 10,
      offset: 0,
      borrower_name: document.getElementById('borrower_name').value,
      propertyid: document.getElementById('accountno').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value.toUpperCase(),
      street: document.getElementById('street').value,
      smsacode: document.getElementById('msaname').value
    };

    fetch(myapi.filteraddress, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(data)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.length === 0) {
          this.props.handleAdvancedSearchFilter(true, []);
        } else {
          this.props.handleAdvancedSearchFilter(true, findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  }

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  render() {
    return (
      <div>
        <div className="container-fluid advance-search-section">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <ul className="col-xs-12 col-sm-4 nopad list-unstyled list-inline own-tab">
                  <li>
                    <Link to="/home">Home</Link>
                  </li>
                  <li className="active">Map</li>
                  <li>
                    {' '}
                    <Link to="/portfolio-manager">Swap Funder</Link>
                  </li>
                </ul>
                <div className="col-sm-8 col-xs-12 nopad text-right">
                  <span className="back-icon" onClick={() => this.bacKToMap()}>
                    <img src="img/back-arrow.png" alt="back-arrow" />
                  </span>
                </div>
              </div>

              <div className="col-xs-12 white-bg curve-own pad-up-down own-form-advance">
                <div className="col-xs-12 advance-search-header">Advanced Search</div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>Borrower Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Borrower Name"
                    id="borrower_name"
                    name="borrowerName"
                  />
                </div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>Street</label>
                  <input type="text" className="form-control" placeholder="Street" id="street" name="street" />
                </div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>City</label>
                  <input type="text" className="form-control" placeholder="City" id="city" name="city" />
                </div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>State</label>
                  <input type="text" className="form-control" placeholder="State" id="state" name="state" />
                </div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Account Number"
                    id="accountno"
                    name="accountNumber"
                  />
                </div>
                <div className="col-sm-6 col-md-4 col-xs-12 form-group">
                  <label>MSA Name</label>
                  <select className="form-control img-select" id="msaname">
                    <option />
                    {this.props.smsacode.map((info, index) => (
                      <option key={index}>{info.smsacode}</option>
                    ))}
                  </select>
                  <div className="icon-img-form">
                    <img src="img/angle-down.png" alt="angle-down" />
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 full-btn-wrapper">
                  <button className="btn btn-gray avc" onClick={() => this.clearFilter()}>
                    Clear
                  </button>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-4 full-btn-wrapper pull-right">
                  <button className="btn btn-orange" onClick={() => this.getAdvanceSearch()}>
                    Search
                  </button>
                </div>
              </div>

              <Displayalllist />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdvanceSearch.defaultProps = {
  isLogin: false,
  userData: {}
};

AdvanceSearch.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    markers: state.map.markers,
    smsacode: state.map.smsacode,
    isDetails: state.map.isDetails,
    isdata: state.map.isdata,
    ispayment: state.map.ispayment,
    infoArray: state.map.infoArray,
    isAdvanceSearch: state.map.isAdvanceSearch,
    addressList: state.map.addressList,
    totalValues: state.map.totalValues,
    totalPages: state.map.totalPages,
    prev: state.map.prev,
    next: state.map.next,
    isdisplaykml: state.map.isdisplaykml,
    lat: state.map.lat,
    lang: state.map.lang,
    zoom: state.map.zoom,
    isViewLoader: state.map.isViewLoader,
    isViewMapInfo: state.map.isViewMapInfo,
    limit: state.map.limit,
    offset: state.map.offset,
    detailedData: state.map.detailedData,
    paymentData: state.map.payment,
    payment: state.map.payment
  };
};

const mapDispatcherToProps = dispatch => {
  return {
    handleBackButtonFromAdavanceSearch: () => dispatch(handleBackButtonFromAdavanceSearch()),
    handleAdvancedSearchFilter: (data, addressList) => dispatch(handleAdvancedSearchFilter(data, addressList)),
    handleAdvanceSearchData: data => dispatch(handleAdvanceSearchData(data)),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(withRouter(AdvanceSearch));
