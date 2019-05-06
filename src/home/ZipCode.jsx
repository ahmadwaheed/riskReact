import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as myapi from '../ConfigUri'; // we imported the ConfigUri file for getting all url
import { DisplayRecord } from './DisplayRecord';
import { handleFetchingRecordsZip, inputZipCode } from '../actions/home/HomeActions';
import { error } from '../actions/login/loginAction';
class ZipCode extends Component {
  constructor() {
    super();

    this.state = {
      isValid: false
    };
  }

  handleInputChange = event => {
    this.props.inputZipCode(event.target.value);
  };

  handleSubmit = event => {
    if (this.props.zipCode.length <= 5) {
      event.preventDefault();

      fetch(myapi.Zip_Code + this.props.zipCode, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        })
      })
        .then(Response => Response.json())
        .then(findresponse => {
          if (findresponse.length === 0) {
            this.props.handleFetchingRecordsZip([], 'No Record Found');
          } else {
            this.props.handleFetchingRecordsZip(findresponse, '');
          }
        })
        .catch(err => {
          error(err.message);
          if (err.request && err.request.status === 401) {
            this.props.history.push('/login');
          }
        });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label style={{ marginRight: '12px' }}>Zip Code </label>
          <input
            type="number"
            name="zipCode"
            value={this.props.zipCode}
            onChange={this.handleInputChange}
            autoComplete="off"
            className="form-control"
            style={{ width: '250px', display: 'inline' }}
          />
          <br />
          <br />
          <br />
          <button
            className="btn btn-default"
            disabled={this.props.zipCode.length > 5}
            type="submit"
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
        {this.props.fetchedRecordsZIP.length > 1 ? (
          <table>
            <thead>
              <tr>
                <th>zip_code</th>
                <th>yyyymm</th>
                <th>home_price_index</th>
                <th>std_deviation</th>
                <th>percent_diff_in_housing_prices_month_to_month</th>
              </tr>
            </thead>
            <tbody>
              {this.props.fetchedRecordsZIP.map((record, index) => (
                <DisplayRecord key={index} data={record} />
              ))}
            </tbody>
          </table>
        ) : (
          <h3>{this.props.statusZip}</h3>
        )}
      </div>
    );
  }
}

ZipCode.defaultProps = {
  isLogin: false,
  userData: {}
};

ZipCode.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  zipCode: PropTypes.string,
  fetchedRecordsZIP: PropTypes.array,
  statusZIP: PropTypes.string
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    fetchedRecordsZIP: state.home.fetchedRecordsZIP,
    statusZip: state.home.statusZip,
    zipCode: state.home.zipCode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleFetchingRecordsZip: (records, status) => dispatch(handleFetchingRecordsZip(records, status)),
    inputZipCode: ZipCode => dispatch(inputZipCode(ZipCode)),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ZipCode));
