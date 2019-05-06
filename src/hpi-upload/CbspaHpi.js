import React from 'react';
import { withRouter } from 'react-router-dom';
import * as myapi from './../ConfigUri';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NavigationBar from '../home/NavigationTab';
import { handleRecentDataMetro, handleUploadErrorMetro, handleUploadFileMetro } from '../actions/metro/MetroActions';
import { error, success } from '../actions/login/loginAction';
import MessageNotification from '../MessageNotification';
import ExportCsv from './ExportCsv';
import Loader from '../Loder/Loders';
let isTrue = false;

class CbspaHpi extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputURL: null,
      color: null,
      message: null,
      isAlertb: true,
      isLoader: false,
      items: [],
      matchData: [],
      errorMessage: ''
    };
  }

  componentDidUpdate = () => {
    if (this.props.hpiCbsaData && this.props.hpiCbsaData.length > 0 && !isTrue) {
      this.setState({
        isLoader: true
      });
      isTrue = true;
    }
  };

  recursive = () => {
    setTimeout(() => {
      let hasMore = this.state.items.length + 1 < this.props.hpiCbsaData.length;

      this.setState((prev, props) => ({
        items: props.hpiCbsaData.slice(0, prev.items.length + 1)
      }));
      if (hasMore) this.recursive();
    }, 0);
  };

  //for handling of closing of the recent view
  handleRecentComponentClose = () => {
    this.props.handleRecentDataMetro({}, false);
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
  onChange = e => {
    var regex = new RegExp('(.*?).(csv)$');
    var regex2 = new RegExp('(.*?).(txt)$');

    if (!regex.test(e.target.value.toLowerCase()) && !regex2.test(e.target.value.toLowerCase())) {
      this.props.handleUploadErrorMetro(true);
    } else {
      this.props.handleUploadFileMetro(e.target.files[0], false);
      this.props.handleUploadErrorMetro(false);
    }
  };

  //the file upload function
  fileUpload = file => {
    var this2 = this;

    if (file) {
      this.setState({
        isLoader: false
      });
      const url = myapi.Upload_cbsa_file; //api to hit

      const data = new FormData();
      data.append('cbsa', file);

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
            this2.setState({
              matchData: res.matched,
              isLoader: true,
              errorMessage: ''
            });
          } else if (res && res.matched && res.matched.length === 0) {
            document.getElementById('fileType').value = '';
            this.props.handleUploadFileMetro('', false);
            success('Cbsa Data Upload Successfully');

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
      this.props.handleUploadErrorMetro(true);
    }
  };

  //recent data api and other functions
  recentData = () => {
    fetch(myapi.RecentUpdateMetro, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.isSuccess === 0) {
          this.props.handleRecentDataMetro({}, false);
        } else {
          this.props.handleRecentDataMetro(findresponse, true);
          console.log(findresponse);
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
    this.setState({ inputURL: e.target.value });
  };

  downloadURL = () => {
    //this method will only work when chrome security is disabled
    //run this cmd in terminal
    //google-chrome --user-data-dir=”/var/tmp/Chrome” --disable-web-security

    var url = this.state.inputURL;

    //var url = this.state.inputURL;
    fetch(url, {
      method: 'GET'
    })
      .then(res => res.text())
      .then(body => {
        console.log(body);
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  componentDidMount() {
    var data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    }
  }

  cancelChange = () => {
    document.getElementById('fileType').value = '';
    this.props.handleUploadFileMetro('', false);

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
      const url = myapi.Replace_Upload_Data + 'cbsa'; //api to hit

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
          if (res && res.message && res.message === 'Cbsa Data Updated Successfully') {
            document.getElementById('fileType').value = '';
            this.props.handleUploadFileMetro('', false);
            success(res.message);

            this.setState({
              matchData: [],
              isLoader: true,
              items: [],
              errorMessage: ''
            });
            this.recursive();
          } else {
            error(res.message);

            this.setState({
              isLoader: true
            });
          }
        })
        .catch(err => {
          error(err.message);

          this.setState({
            isLoader: true
          });
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
                <NavigationBar isMetro={true} />
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div>
                  <ExportCsv type="cbsa" recursive={this.recursive} />
                </div>
                <div className="col-xs-12 text-center  white-bg">
                  <h1>Metro File Upload</h1>
                  <form
                    style={this.state.matchData.length === 0 ? { display: 'block' } : { display: 'none' }}
                    onSubmit={!this.props.noFileMetro ? this.onFormSubmit : null}
                    className="col-xs-12 nopad"
                  >
                    <div className="col-xs-12 file-input-wrapper text-center pad-up-down">
                      <input accept=".txt,.csv" id="fileType" type="file" name="metroFile" onChange={this.onChange} />
                    </div>
                    {this.state.errorMessage && this.state.errorMessage !== '' ? (
                      <div className="text-danger">{this.state.errorMessage}</div>
                    ) : null}
                    {this.props.noFileMetro ? (
                      <h4 className="col-xs-12 text-center text-danger">
                        Please select correct file format .csv or .txt.
                      </h4>
                    ) : null}
                    <div className="col-xs-12 text-center">
                      <button disabled={this.props.noFileMetro} type="submit" className="btn orange-bg btn-own">
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
                  {this.state.items && this.state.items.length > 0 && this.state.matchData.length === 0 ? (
                    <div className="col-xs-12 table-responsive">
                      {' '}
                      <table className="table table-borderless">
                        <thead id="mortgageData" style={{}}>
                          <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Year</th>
                            <th className="text-center">CBSA</th>
                            <th className="text-center">HPI</th>
                            <th className="text-center">HPI with 1990 base</th>
                            <th className="text-center">HPI with 2000 base</th>
                            <th className="text-center">Annual change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items &&
                            this.state.items.length > 0 &&
                            this.state.items.map((data, index) => (
                              <tr key={index}>
                                <td className="text-center">{data.name}</td>
                                <td className="text-center">{data.year}</td>
                                <td className="text-center">{data.cbsa}</td>
                                <td className="text-center">{data.hpi}</td>
                                <td className="text-center">{data.hpi_with_1990_base}</td>
                                <td className="text-center">{data.hpi_with_2000_base}</td>
                                <td className="text-center"> {data.annual_change}</td>
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
                              <th className="text-center">Name</th>
                              <th className="text-center">Year</th>
                              <th className="text-center">CBSA</th>
                              <th className="text-center">Annual change</th>
                              <th className="text-center">Original Data</th>
                              <th className="text-center">Replace Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.matchData &&
                              this.state.matchData.length > 0 &&
                              this.state.matchData.map((data, index) => (
                                <tr key={index}>
                                  <td className="text-center">{data.name}</td>
                                  <td className="text-center">{data.year}</td>
                                  <td className="text-center">{data.cbsa}</td>
                                  <td className="text-center"> {data.annual_change}</td>
                                  <td className="text-center"> {data.hpi}</td>
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

//getting the values from the reduce .....you can use this.props.ctr in the above component to acces the value
const mapStateToProps = state => {
  return {
    ctr: state.hpi.counter,
    auth: state.hpi.authData,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    isRecentView: state.metro.isRecentView,
    noFileMetro: state.metro.noFileMetro,
    file: state.metro.file,
    hpiCbsaData: state.hpi.hpiCbsaData
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    //  onCbseMetro: (data) => dispatch(OnMetroRecentData(data)),
    handleRecentDataMetro: (payload, value) => dispatch(handleRecentDataMetro(payload, value)),
    handleUploadErrorMetro: value => dispatch(handleUploadErrorMetro(value)),
    error: value => dispatch(error(value)),
    success: value => dispatch(success(value)),
    handleUploadFileMetro: (file, value) => dispatch(handleUploadFileMetro(file, value))
  };
};

CbspaHpi.defaultProps = {
  isLogin: false,
  userData: {},
  isRecentView: [],
  noFileMetro: false,
  file: null,
  hpiCbsaData: []
};

CbspaHpi.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  isRecentView: PropTypes.bool,
  noFileMetro: PropTypes.bool,
  hpiCbsaData: PropTypes.arrayOf(Object)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CbspaHpi));
