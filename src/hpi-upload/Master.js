import React from 'react';
import * as myapi from '../ConfigUri';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../home/NavigationTab';
import { OnIncrementCounter } from '../actions/hpi-upload/hpi-action';
import {
  handleUploadFileMaster,
  handleRecentDataMaster,
  handleUploadErrorMaster
} from '../actions/master/MasterAction';
import { error, success } from '../actions/login/loginAction';
import ExportCsv from './ExportCsv';
import MessageNotification from '../MessageNotification';
import Loader from '../Loder/Loders';

let isTrue = false;

class Master extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: null,
      isNotificationAlert: false,
      recentComponentrender: false,
      color: null,
      message: null,
      isAlertb: true,
      isLoader: false,
      items: [],
      matchData: [],
      errorMessage: ''
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  componentDidMount() {
    var data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate = () => {
    if (this.props.hpiMasterData && this.props.hpiMasterData.length > 0 && !isTrue) {
      this.setState({
        isLoader: true
      });
      isTrue = true;
    }
  };

  handleRecentComponentClose = () => {
    this.props.handleRecentDataMaster({}, false);
  };

  //error remover handler
  handleErrorComp = () => {
    this.setState({
      isNotificationAlert: false
    });
  };

  //on submit button fire
  onFormSubmit = e => {
    e.preventDefault();
    this.fileUpload(this.props.file);
  };

  //on change event fire
  onChange(e) {
    var regex = new RegExp('(.*?).(csv)$');
    var regex2 = new RegExp('(.*?).(txt)$');

    if (!regex.test(e.target.value.toLowerCase()) && !regex2.test(e.target.value.toLowerCase())) {
      this.props.handleUploadErrorMaster(true);
    } else {
      this.props.handleUploadFileMaster(e.target.files[0], false);
      this.props.handleUploadErrorMaster(false);
    }
  }

  fileUpload = file => {
    if (file) {
      this.setState({
        isLoader: false
      });
      const url = myapi.Upload_master_file; //api to hit

      const data = new FormData();
      data.append('master', file);

      fetch(url, {
        method: 'POST',
        headers: new Headers({
          auth_token: this.props.userData.token
        }),
        body: data
      })
        .then(Response => Response.json())
        .then(res => {
          if (res && res.errorCode === 'upload Failed') {
            this.setState({
              errorMessage: res.details,
              isLoader: true
            });
          } else if (res && res.matched && res.matched.length > 0) {
            this.setState({
              matchData: res.matched,
              isLoader: true,
              errorMessage: ''
            });
          } else if (res && res.matched && res.matched.length === 0) {
            document.getElementById('fileMaster').value = '';
            this.props.handleUploadFileMaster('', false);
            success('Master Data Upload Successfully');

            this.setState({
              matchData: [],
              isLoader: true,
              errorMessage: ''
            });
          }
        })
        .catch(err => {
          error(err.message);
          if (err.request && err.request.status === 401) {
            this.props.history.push('/login');
          }

          this.setState({
            isLoader: true
          });
        });
    }

    if (!file) {
      this.props.handleUploadErrorMaster(true);
    }
  };

  //recent data api and other functions
  recentData = () => {
    fetch(myapi.RecentUpdateState, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.isSuccess === 0) {
          this.props.handleRecentDataMaster({}, false);
        } else {
          this.props.handleRecentDataMaster(findresponse, true);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  onUrlinsert = e => {
    this.setState({
      ...this.state,
      inputURL: e.target.value
    });
  };

  downloadURL = () => {
    //this method will only work when chrome security is disabled
    //run this cmd in terminal
    //google-chrome --user-data-dir=”/var/tmp/Chrome” --disable-web-security
    var url = this.state.inputURL;

    fetch(url, {
      method: 'GET'
    })
      .then(res => res.text())
      .then(body => {
        console.log(body);
        // fileDownload(body, "my.txt");
      });
  };

  recursive = () => {
    setTimeout(() => {
      let hasMore = this.state.items.length + 1 < this.props.hpiMasterData.length;

      this.setState((prev, props) => ({
        items: props.hpiMasterData.slice(0, prev.items.length + 1)
      }));
      if (hasMore) this.recursive();
    }, 0);
  };

  cancelChange = () => {
    document.getElementById('fileMaster').value = '';
    this.props.handleUploadFileMaster('', false);

    this.setState({
      matchData: [],
      items: [],
      errorMessage: ''
    });
    this.recursive();
  };

  replaceData = () => {
    if (this.state.matchData.length > 0) {
      this.setState({
        isLoader: false
      });
      const data = this.state.matchData;
      const url = myapi.Replace_Upload_Data + 'master'; //api to hit

      fetch(url, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        }),
        body: JSON.stringify(data)
      })
        .then(Response => Response.json())
        .then(res => {
          if (res && res.message && res.message === 'Master Data Updated Successfully') {
            document.getElementById('fileMaster').value = '';
            this.props.handleUploadFileMaster('', false);
            success(res.message);

            this.setState({
              matchData: [],
              isLoader: true,
              items: [],
              errorMessage: ''
            });
            this.recursive();
          } else {
            this.setState({
              isLoader: true
            });
            error(res.message);
          }
        })
        .catch(err => {
          this.setState({
            isLoader: true
          });
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
        <MessageNotification />
        <div className="container-fluid">
          <Loader myview={this.state.isLoader} />
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isMaster={true} />
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div>
                  <ExportCsv type="master" recursive={this.recursive} />
                </div>
                <div className="col-xs-12 text-center  white-bg">
                  <h1>Master File Upload</h1>
                  <form
                    style={this.state.matchData.length === 0 ? { display: 'block' } : { display: 'none' }}
                    onSubmit={!this.props.noFileMaster ? this.onFormSubmit : null}
                    className="col-xs-12 nopad"
                  >
                    <div className="col-xs-12 file-input-wrapper text-center pad-up-down">
                      <input
                        id="fileMaster"
                        accept=".txt,.csv"
                        type="file"
                        name="masterFile"
                        onChange={this.onChange}
                      />
                    </div>
                    {this.state.errorMessage && this.state.errorMessage !== '' ? (
                      <div className="text-danger">{this.state.errorMessage}</div>
                    ) : null}
                    {this.props.noFileMaster ? (
                      <h4 className="col-xs-12 text-center text-danger">
                        Please select correct file format .csv or .txt.
                      </h4>
                    ) : null}
                    <div className="col-xs-12 text-center">
                      {this.props.noFileMaster ? (
                        <button disabled type="submit" className="btn orange-bg btn-own">
                          Upload
                        </button>
                      ) : (
                        <button type="submit" className="btn orange-bg btn-own">
                          Upload
                        </button>
                      )}
                    </div>
                    .
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 pad-left-right-large" style={{ marginTop: '15px' }}>
              <div className="col-xs-12 white-bg curve-own pad-up-down">
                <div className="col-xs-12">
                  {this.state.items && this.state.items.length > 0 && this.state.matchData.length === 0 ? (
                    <div className="col-xs-12 table-responsive">
                      {' '}
                      <table className="table table-borderless">
                        <thead id="mortgageData" style={{}}>
                          <tr>
                            <th className="text-center">Yr</th>
                            <th className="text-center">Place Name</th>
                            <th className="text-center">Place Id</th>
                            <th className="text-center">Period</th>
                            <th className="text-center">Level</th>
                            <th className="text-center">Index SA</th>
                            <th className="text-center">Index NSA</th>
                            <th className="text-center">HPI Type</th>
                            <th className="text-center">HPI Flavor</th>
                            <th className="text-center">Frequency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items &&
                            this.state.items.length > 0 &&
                            this.state.items.map((data, index) => (
                              <tr key={index}>
                                <td className="text-center">{data.year}</td>
                                <td className="text-center">{data.place_name}</td>
                                <td className="text-center">{data.place_id}</td>
                                <td className="text-center">{data.period}</td>
                                <td className="text-center"> {data.level}</td>
                                <td className="text-center">{data.index_sa}</td>
                                <td className="text-center">{data.index_nsa}</td>
                                <td className="text-center">{data.hpi_type}</td>
                                <td className="text-center">{data.hpi_flavor}</td>
                                <td className="text-center"> {data.frequency}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>{' '}
                    </div>
                  ) : this.state.matchData && this.state.matchData.length > 0 ? (
                    <div className="col-xs-12 nopad">
                      <div className="col-xs-12 nopad text-center text-danger">
                        The following conflicts are detected. Do you wish to overwrite data?
                        <button
                          onClick={() => this.replaceData()}
                          className="btn orange-bg btn-own"
                          style={{ margin: '0 4px' }}
                        >
                          yes
                        </button>
                        <button
                          onClick={() => this.cancelChange()}
                          className="btn orange-bg btn-own"
                          style={{ margin: '0 4px' }}
                        >
                          cancel
                        </button>
                      </div>
                      <div className="col-xs-12 table-responsive pad-up">
                        <table className="table table-borderless">
                          <thead id="mortgageData" style={{}}>
                            <tr>
                              <th className="text-center">Place Name</th>
                              <th className="text-center">Year</th>
                              <th className="text-center">Place Id</th>
                              <th className="text-center">Period</th>
                              <th className="text-center">Level</th>
                              <th className="text-center">Index NSa</th>
                              <th className="text-center">Hpi Type</th>
                              <th className="text-center">Hpi Flavor</th>
                              <th className="text-center">Frequency</th>
                              <th className="text-center">Original Data</th>
                              <th className="text-center">Replace Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.matchData &&
                              this.state.matchData.length > 0 &&
                              this.state.matchData.map((data, index) => (
                                <tr key={index}>
                                  <td className="text-center">{data.place_name}</td>
                                  <td className="text-center">{data.year}</td>
                                  <td className="text-center">{data.place_id}</td>
                                  <td className="text-center"> {data.period}</td>
                                  <td className="text-center"> {data.level}</td>
                                  <td className="text-center"> {data.index_nsa}</td>
                                  <td className="text-center"> {data.hpi_type}</td>
                                  <td className="text-center"> {data.hpi_flavor}</td>
                                  <td className="text-center"> {data.frequency}</td>
                                  <td className="text-center"> {data.orignalhpi}</td>
                                  <td className="text-center" style={{ color: 'red' }}>
                                    {' '}
                                    {data.index_sa}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>{' '}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Master.defaultProps = {
  isLogin: false,
  userData: {},
  isRecentView: [],
  noFileMaster: false,
  file: null
};

Master.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  isRecentView: PropTypes.bool,
  noFileMaster: PropTypes.bool
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    ctr: state.hpi.counter,
    auth: state.hpi.authData,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    isRecentView: state.masterReducer.isRecentView,
    noFileMaster: state.masterReducer.noFileMaster,
    file: state.masterReducer.file,
    hpiMasterData: state.hpi.hpiMasterData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    onIncrementCounter: () => dispatch(OnIncrementCounter()),
    handleRecentDataMaster: (payload, value) => dispatch(handleRecentDataMaster(payload, value)),
    handleUploadErrorMaster: value => dispatch(handleUploadErrorMaster(value)),
    error: value => dispatch(error(value)),
    success: value => dispatch(success(value)),
    handleUploadFileMaster: (file, value) => dispatch(handleUploadFileMaster(file, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Master));
