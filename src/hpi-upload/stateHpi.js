import React from 'react';
import * as myapi from './../ConfigUri';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../home/NavigationTab';
import { OnIncrementCounter } from '../actions/hpi-upload/hpi-action';
import { handleUploadFileState, handleRecentDataState, handleUploadErrorState } from '../actions/state/StateAction';
import { error, success } from '../actions/login/loginAction';
import ExportCsv from './ExportCsv';
import MessageNotification from '../MessageNotification';
import Loader from '../Loder/Loders';
let isTrue = false;

class StateHpi extends React.Component {
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
    if (this.props.hpiStateData && this.props.hpiStateData.length > 0 && !isTrue) {
      this.setState({
        isLoader: true
      });
      isTrue = true;
    }
  };

  //for handling of closing of the recent view
  handleRecentComponentClose = () => {
    this.props.handleRecentDataState({}, false);
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
      this.props.handleUploadErrorState(true);
    } else {
      this.props.handleUploadFileState(e.target.files[0], false);
      this.props.handleUploadErrorState(false);
    }
  }

  fileUpload = file => {
    if (file) {
      this.setState({
        isLoader: false
      });
      const url = myapi.Upload_state_file; //api to hit

      const data = new FormData();
      data.append('state', file);

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
            document.getElementById('fileState').value = '';
            this.props.handleUploadFileState('', false);
            success('State Data Upload Successfully');

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
      this.props.handleUploadErrorState(true);
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
          this.props.handleRecentDataState({}, false);
        } else {
          this.props.handleRecentDataState(findresponse, true);
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

  cancelChange = () => {
    document.getElementById('fileState').value = '';
    this.props.handleUploadFileState('', false);

    this.setState({
      matchData: [],
      errorMessage: ''
    });
  };

  replaceData = () => {
    if (this.state.matchData.length > 0) {
      this.setState({
        isLoader: false
      });
      const data = this.state.matchData;
      const url = myapi.Replace_Upload_Data + 'state'; //api to hit

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
          if (res && res.message && res.message === 'State Data Updated Successfully') {
            document.getElementById('fileState').value = '';
            this.props.handleUploadFileState('', false);
            success(res.message);

            this.setState({
              matchData: [],
              isLoader: true,
              errorMessage: ''
            });
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
          <div className="row">
            <Loader myview={this.state.isLoader} />
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isState={true} />
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div>
                  <ExportCsv type="state" />
                </div>
                <div className="col-xs-12 text-center  white-bg">
                  <h1>State File Upload</h1>
                  <form
                    style={this.state.matchData.length === 0 ? { display: 'block' } : { display: 'none' }}
                    onSubmit={!this.props.noFileState ? this.onFormSubmit : null}
                    className="col-xs-12 nopad"
                  >
                    <div className="col-xs-12 file-input-wrapper text-center pad-up-down">
                      <input id="fileState" accept=".txt,.csv" type="file" name="stateFile" onChange={this.onChange} />
                    </div>
                    {this.state.errorMessage && this.state.errorMessage !== '' ? (
                      <div className="text-danger">{this.state.errorMessage}</div>
                    ) : null}
                    {this.props.noFileState ? (
                      <h4 className="col-xs-12 text-center text-danger">
                        Please select correct file format .csv or .txt.
                      </h4>
                    ) : null}
                    <div className="col-xs-12 text-center">
                      <button disabled={this.props.noFileState} type="submit" className="btn orange-bg btn-own">
                        Upload
                      </button>
                    </div>
                  </form>

                  {/* <button onClick={this.recentData} className="btn orange-bg btn-own">
                    Recent Update
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          {/* {this.props.isRecentView ? (
            <RecentUploadList closeWindow={this.handleRecentComponentClose} isAlertb={this.state.isAlertb} />
          ) : null} */}
          <div className="row">
            <div className="col-xs-12 pad-left-right-large" style={{ marginTop: '15px' }}>
              <div className="col-xs-12 white-bg curve-own pad-up-down">
                <div className="col-xs-12">
                  {this.props.hpiStateData &&
                  this.props.hpiStateData.length > 0 &&
                  this.state.matchData.length === 0 ? (
                    <div className="col-xs-12 table-responsive">
                      {' '}
                      <table className="table table-borderless">
                        <thead id="mortgageData" style={{}}>
                          <tr>
                            <th className="text-center">Quarter</th>
                            <th className="text-center">Year</th>
                            <th className="text-center">State</th>
                            <th className="text-center">Index NSA</th>
                            <th className="text-center">Index SA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.hpiStateData &&
                            this.props.hpiStateData.length > 0 &&
                            this.props.hpiStateData.map((data, index) => (
                              <tr key={index}>
                                <td className="text-center">{data.qtr}</td>
                                <td className="text-center">{data.year}</td>
                                <td className="text-center">{data.state}</td>
                                <td className="text-center">{data.index_nsa}</td>
                                <td className="text-center">{data.index_sa}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
                              <th className="text-center">Sate</th>
                              <th className="text-center">Year</th>
                              <th className="text-center">Indez NSA</th>
                              <th className="text-center">Quarter</th>
                              <th className="text-center">Original Data</th>
                              <th className="text-center">Replace Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.matchData &&
                              this.state.matchData.length > 0 &&
                              this.state.matchData.map((data, index) => (
                                <tr key={index}>
                                  <td className="text-center">{data.state}</td>
                                  <td className="text-center">{data.year}</td>
                                  <td className="text-center">{data.index_nsa}</td>
                                  <td className="text-center"> {data.qtr}</td>
                                  <td className="text-center"> {data.index_sa}</td>
                                  <td className="text-center" style={{ color: 'red' }}>
                                    {' '}
                                    {data.orignalhpi}
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

StateHpi.defaultProps = {
  isLogin: false,
  userData: {},
  isRecentView: [],
  noFileState: false,
  file: null
};

StateHpi.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  isRecentView: PropTypes.bool,
  noFileState: PropTypes.bool,
  hpiStateData: PropTypes.arrayOf(Object)
};

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    ctr: state.hpi.counter,
    auth: state.hpi.authData,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    isRecentView: state.stateReducer.isRecentView,
    noFileState: state.stateReducer.noFileState,
    file: state.stateReducer.file,
    hpiStateData: state.hpi.hpiStateData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    onIncrementCounter: () => dispatch(OnIncrementCounter()),
    handleRecentDataState: (payload, value) => dispatch(handleRecentDataState(payload, value)),
    handleUploadErrorState: value => dispatch(handleUploadErrorState(value)),
    error: value => dispatch(error(value)),
    success: value => dispatch(success(value)),
    handleUploadFileState: (file, value) => dispatch(handleUploadFileState(file, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StateHpi));
