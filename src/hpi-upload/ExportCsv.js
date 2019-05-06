import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { CSVLink } from 'react-csv';
import PropTypes from 'prop-types';
import {
  exportCsvData,
  getCbsaData,
  getStateData,
  getZipData,
  getZip3Data,
  getMasterData
} from '../actions/hpi-upload/hpi-action';

class ExportCsv extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      finaldata: []
    };
  }

  componentDidMount() {
    var data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.exportCsv();
    }
  }

  exportCsv = () => {
    if (
      this.props.hpiStateData.length === 0 ||
      this.props.hpiCbsaData.length === 0 ||
      this.props.hpiZipData.length === 0 ||
      this.props.hpiZip3Data.length === 0 ||
      this.props.hpiMasterData.length === 0
    ) {
      exportCsvData(this.props.userData.token, this.props.type).then(res => {
        if (res && res.request && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res && res.length > 0) {
          if (this.props.type === 'state') {
            let stateArray = [];

            res.forEach(state => {
              let oldArray = {};
              oldArray['qtr'] = state.qtr || '';
              oldArray['state'] = state.state || '';
              oldArray['year'] = state.year || '';
              oldArray['index_nsa'] = state.index_nsa || '';
              oldArray['index_sa'] = state.index_sa || '';
              stateArray.push(oldArray);
            });
            this.props.getStateData(stateArray);
          } else if (this.props.type === 'cbsa') {
            this.props.getCbsaData(res);
            this.props.recursive();
          } else if (this.props.type === 'zip') {
            this.props.getZipData(res);
            this.props.recursive();
          } else if (this.props.type === 'master') {
            this.props.getMasterData(res);
            this.props.recursive();
          } else if (this.props.type === 'zip3') {
            this.props.getZip3Data(res);
            this.props.recursive();
          }
        } else if (res) {
          this.setState({
            isLoader: true
          });
        }
      });
    }
  };

  render() {
    let finaldata = [];

    if (this.props.type === 'state') {
      finaldata = this.props.hpiStateData;
    } else if (this.props.type === 'cbsa') {
      finaldata = this.props.hpiCbsaData;
    } else if (this.props.type === 'zip') {
      finaldata = this.props.hpiZipData;
    } else if (this.props.type === 'master') {
      finaldata = this.props.hpiMasterData;
    } else if (this.props.type === 'zip3') {
      finaldata = this.props.hpiZip3Data;
    }

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 text-center  white-bg">
                  <div className="col-xs-12 text-right">
                    {this.props.type === 'state' && this.props.hpiStateData.length > 0 ? (
                      <CSVLink data={finaldata} className="btn btn-orange">
                        {' '}
                        Export CSV
                      </CSVLink>
                    ) : this.props.type === 'state' ? (
                      <button disabled className="btn orange-bg btn-own">
                        Export CSV
                      </button>
                    ) : null}
                    {this.props.type === 'cbsa' && this.props.hpiCbsaData.length > 0 ? (
                      <CSVLink data={finaldata} className="btn btn-orange">
                        {' '}
                        Export CSV
                      </CSVLink>
                    ) : this.props.type === 'cbsa' ? (
                      <button disabled className="btn orange-bg btn-own">
                        Export CSV
                      </button>
                    ) : null}
                    {this.props.type === 'zip' && this.props.hpiZipData.length > 0 ? (
                      <CSVLink data={finaldata} className="btn btn-orange">
                        {' '}
                        Export CSV
                      </CSVLink>
                    ) : this.props.type === 'zip' ? (
                      <button disabled className="btn orange-bg btn-own">
                        Export CSV
                      </button>
                    ) : null}
                    {this.props.type === 'zip3' && this.props.hpiZip3Data.length > 0 ? (
                      <CSVLink data={finaldata} className="btn btn-orange">
                        {' '}
                        Export CSV
                      </CSVLink>
                    ) : this.props.type === 'zip3' ? (
                      <button disabled className="btn orange-bg btn-own">
                        Export CSV
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExportCsv.defaultProps = {
  isLogin: false,
  userData: {},
  exportCsvData: undefined,
  getCbsaData: undefined,
  getStateData: undefined,
  getZipData: undefined,
  getZip3Data: undefined,
  getMasterData: undefined,
  hpiCbsaData: [],
  hpiStateData: [],
  hpiZipData: [],
  hpiZip3Data: [],
  hpiMasterData: []
};

ExportCsv.propTypes = {
  userData: PropTypes.objectOf(String),
  exportCsvData: PropTypes.func,
  getCbsaData: PropTypes.func,
  getStateData: PropTypes.func,
  getZipData: PropTypes.func,
  getZip3Data: PropTypes.func,
  getMasterData: PropTypes.func,
  hpiCbsaData: PropTypes.arrayOf(Object),
  hpiStateData: PropTypes.arrayOf(Object),
  hpiZipData: PropTypes.arrayOf(Object),
  hpiZip3Data: PropTypes.arrayOf(Object),
  hpiMasterData: PropTypes.arrayOf(Object)
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    userData: state.login.userData,
    hpiCbsaData: state.hpi.hpiCbsaData,
    hpiStateData: state.hpi.hpiStateData,
    hpiZipData: state.hpi.hpiZipData,
    hpiZip3Data: state.hpi.hpiZip3Data,
    hpiMasterData: state.hpi.hpiMasterData
  };
};

export default connect(
  mapStateToProps,
  { exportCsvData, getCbsaData, getStateData, getZipData, getZip3Data, getMasterData }
)(withRouter(ExportCsv));
