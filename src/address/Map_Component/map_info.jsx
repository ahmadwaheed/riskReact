import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { handleIsDetail, handleViewDetail } from '../../actions/map/MapAction';

class MapInfo extends Component {
  viewDetails = detail => {
    let data = { ...detail };
    this.props.handleIsDetail(true, detail);
    this.props.handleViewDetail(data);
  };

  render() {
    return (
      <div>
        <div className="col-xs-12 col-sm-6 pad-half">
          <div className="col-xs-12 nopad table-responsive details-table fix-height-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Borrower Name</th>
                  <th>Account Number</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.props.infoArray.map((info, index) => (
                  <tr key={index}>
                    <td>{info.borrower_name}</td>
                    <td>{info.propertyid}</td>
                    <td>{info.address1}</td>
                    <td>{info.city}</td>
                    <td>{info.state}</td>
                    <td>
                      <button className="btn btn-orange" onClick={() => this.viewDetails(info)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-xs-12 flex-center pad-up-down csv-info">
            <CSVLink data={this.props.infoArray} className="btn btn-orange">
              {' '}
              Export CSV
            </CSVLink>
            <span className="csv-information">* Maximum first 100 addresses only listed above</span>
          </div>
        </div>
      </div>
    );
  }
}

MapInfo.defaultProps = {
  isLogin: false,
  userData: {}
};

MapInfo.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    infoArray: state.map.infoArray,
    isdata: state.map.isdata,
    lat: state.map.lat,
    lang: state.map.lang,
    zoom: state.map.zoom
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleIsDetail: (isDetails, data) => dispatch(handleIsDetail(isDetails, data)),
    handleViewDetail: data => dispatch(handleViewDetail(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MapInfo));
