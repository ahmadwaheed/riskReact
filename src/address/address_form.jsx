import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as myapi from './../ConfigUri'; // we imported the ConfigUri file for getting all url
import { DisplayAddressRecord } from '../home/DisplayAddressRecord';
import { handleFetchingRecordsAddress, inputAddress } from '../actions/home/HomeActions';
import { error, success } from '../actions/login/loginAction';

class AddressForm extends Component {
  constructor() {
    super();

    this.state = {
      address: '',
      fetchRecords: [],
      importStatus: '',
      type: 'matchAny'
    };
  }

  handleInputChange = event => {
    this.props.inputAddress(event.target.value);
  };

  handleImportAddress = event => {
    event.preventDefault();

    fetch(myapi.Import_Address, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.length === 0) {
          this.setState({ importStatus: 'Server Error' });
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

  handleSubmit = event => {
    event.preventDefault();

    fetch(`https://beta.riskreductionmortgage.com/api/searchaddress`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        sSingleLine: this.props.address,
        iCensusYear: '2017'
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (!findresponse.d) {
          this.props.handleFetchingRecordsAddress([], 'No Record found');
        } else {
          this.props.handleFetchingRecordsAddress(findresponse.d, 'Imported Successfully');
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  onTypeChange = e => {
    this.setState({
      type: e.currentTarget.value
    });
  };

  render() {
    let disable = this.props.address !== '' ? false : true;

    return (
      <div className="col-xs-12 text-center">
        <h2>Address Form </h2>
        <form onSubmit={this.handleSubmit}>
          <label style={{ marginRight: '12px' }}>Address</label>
          <input
            type="text"
            name="address"
            value={this.props.address}
            onChange={this.handleInputChange}
            autoComplete="off"
            className="form-control"
            style={{ width: '30%', display: 'inline' }}
          />
          <br />
          <br />
          <button
            disabled={disable}
            type="submit"
            className="btn btn-default"
            style={{
              color: 'rgb(0, 0, 0)',
              backgroundColor: '#fff',
              border: '1px solid black',
              minWidth: '40px',
              marginLeft: '5px'
            }}
          >
            Submit
          </button>
        </form>
        <br />
        <br />
        {Object.keys(this.props.fetchedRecordsAddress).length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>City Name</th>
                <th>State Name</th>
                <th>Country Name</th>
                <th>State Code</th>

                <th>Country Code</th>
                <th>State Abbr </th>
                <th>Tract Code</th>
                <th>Zip Code</th>
                <th>MSA Name</th>

                <th>MSA Code</th>
                <th>Census Year</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.props.fetchedRecordsAddress).length > 0 ? (
                <DisplayAddressRecord data={this.props.fetchedRecordsAddress} />
              ) : null}
            </tbody>
          </table>
        ) : (
          <h3>{this.props.statusAddress}</h3>
        )}
      </div>
    );
  }
}

AddressForm.defaultProps = {
  isLogin: false,
  userData: {}
};

AddressForm.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  zipCode: PropTypes.string,
  statusAddress: PropTypes.string
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    fetchedRecordsAddress: state.home.fetchedRecordsAddress,
    statusAddress: state.home.statusAddress,
    address: state.home.address
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleFetchingRecordsAddress: (records, status) => dispatch(handleFetchingRecordsAddress(records, status)),
    inputAddress: ZipCode => dispatch(inputAddress(ZipCode)),
    error: ZipCode => dispatch(error(ZipCode)),
    success: ZipCode => dispatch(success(ZipCode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddressForm));
