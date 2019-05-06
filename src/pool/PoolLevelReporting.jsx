import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/admin/admin-action';
import { Scrollbars } from 'react-custom-scrollbars';
import { GoogleMapsWrapper } from '../address/map_component';
import { Marker } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import * as myapi from '../ConfigUri'; // we imported the ConfigUri file for getting all url
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import { error } from '../actions/login/loginAction';
let circle;

class PoolLevelReporting extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      infoArray: [],
      payment: [],
      markers: [],
      userData: {},
      isDetails: false,
      ispayment: false,
      paymentData: {},
      isViewLoader: false,
      isViewMapInfo: true,
      limit: 10,
      offset: 0,
      prev: false,
      next: false,
      lat: 36.950901,
      lang: -122.04681,
      zoom: 3,
      activeTab: true
    };
  }

  backToList = () => {
    this.props.history.push('./mortgage-pool');
  };

  componentDidMount() {
    if (this.props.poolName === '') {
      this.props.history.push('./mortgage-pool');
    }

    var data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    }
  }

  handleMapClick = () => {
    if (circle) circle.setMap(null);
  };

  getDetails = (id, lat, long) => {
    if (circle) {
      circle.setMap(null);
    }

    var data = {
      filterArea: [
        {
          lat: lat,
          long: long
        }
      ]
    };
    this.getAddressData(data);
  };

  getAddressData = data => {
    this.setState({ isViewLoader: true, isViewMapInfo: false });

    fetch(myapi.Map_Details, {
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
          this.setState({
            infoArray: findresponse,
            isDetails: false,
            isViewLoader: false,
            isViewMapInfo: true,
            isdata: false,
            ispayment: false
          });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.setState({ markers: [] });

      const searText = document.getElementById('searchmap').value;

      fetch(myapi.searchmortage, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        }),
        body: JSON.stringify({ searchText: searText })
      })
        .then(Response => Response.json())
        .then(findresponse => {
          if (findresponse.length >= 1) {
            this.setState({ markers: findresponse });
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

  switchTab = data => {
    this.setState({
      activeTab: data
    });
  };

  render() {
    const { thead } = styles;
    const { poolreporting } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-up nopad">
              <div className="col-xs-12 nopad">
                <span onClick={() => this.backToList()} className="back-arrow shadow-arrow">
                  <img src="img/back-arrow.png" alt="back-arrow" />
                </span>
                <ul className="col-xs-12 nopad list-unstyled list-inline own-tab with-a">
                  <li className={this.state.activeTab ? 'active' : null} onClick={() => this.switchTab(true)}>
                    <a href="javascript:;">Aggregate Report</a>
                  </li>
                  <li className={!this.state.activeTab ? 'active' : null} onClick={() => this.switchTab(false)}>
                    <a href="javascript:;">Monthly Breakdown</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
              <div className="col-xs-12 pageHeading">
                <label>Name of Pool:</label>
                <span className="">{this.props.poolName}</span>
                <label>Created Date:</label>
                <span>{moment(this.props.poolDate).format('MM/DD/YYYY')}</span>
                {this.state.activeTab ? (
                  <div className="search-box">
                    <input
                      name="created_date"
                      type="text"
                      className="form-control"
                      placeholder="Search here ..."
                      id="searchmap"
                      onKeyPress={event => this.handleKeyPress(event)}
                    />
                    <i style={{ bottom: '8px' }} className="fa fa-search form-icon-wrapper" />
                  </div>
                ) : null}
              </div>
              {this.state.activeTab ? (
                <div>
                  <div className="col-xs-12 col-sm-6">
                    <GoogleMapsWrapper
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `calc(100vh - 240px)` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      zoom={this.state.zoom}
                      defaultCenter={{
                        lat: this.state.lat,
                        lng: this.state.lang
                      }}
                      onClick={this.handleMapClick}
                    >
                      {poolreporting !== undefined &&
                      poolreporting.distance !== undefined &&
                      poolreporting.distance.length >= 1 ? (
                        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
                          {poolreporting.distance.map(marker => (
                            <Marker
                              key={marker.id}
                              icon={{
                                url: `img/marker-icon.png`
                              }}
                              position={{
                                lat: Number(marker.slatitude),
                                lng: Number(marker.slongitude)
                              }}
                              onClick={() => this.getDetails(marker.slatitude, marker.slongitude, marker.slongitude)}
                            />
                          ))}
                        </MarkerClusterer>
                      ) : null}
                      <DrawingManager
                        defaultOptions={{
                          drawingControl: true,
                          drawingControlOptions: {
                            position: window.google.maps.ControlPosition.TOP_CENTER,
                            drawingModes: [window.google.maps.drawing.OverlayType.CIRCLE]
                          },
                          circleOptions: {
                            fillColor: `#ffff00`,
                            fillOpacity: 1,
                            strokeWeight: 5,
                            clickable: false,
                            editable: true,
                            zIndex: 1
                          }
                        }}
                      />
                    </GoogleMapsWrapper>
                  </div>

                  {poolreporting !== undefined && poolreporting.aggregate !== undefined ? (
                    <div className="col-xs-12 col-sm-6 table-responsive">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <th>Total Mortagae Balance</th>
                            <td>{Number(poolreporting.aggregate.total_mortgage_balances).toFixed(3)}</td>
                          </tr>
                          <tr>
                            <th>Aggregate Principal</th>
                            <td>{Number(poolreporting.aggregate.principal).toFixed(3)}</td>
                          </tr>
                          <tr>
                            <th>Aggregate Swap Balance</th>
                            <td>{Number(poolreporting.aggregate.swap_balance).toFixed(3)}</td>
                          </tr>
                          <tr>
                            <th>Weighted Average Interest Rate</th>
                            <td>{Number(poolreporting.aggregate.weighted_average_interest_rate).toFixed(3)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="col-xs-12 table-responsive">
                  <Scrollbars id="poolDataElement" className="scrollStyle" style={{ maxHeight: '60vh' }}>
                    <table className="table table-borderless">
                      <thead id="poolData" style={{ ...thead }}>
                        <tr>
                          <th>Month</th>
                          <th className="text-right">Monthly Aggregate Principal</th>
                          <th className="text-right">Monthly Aggregate Swap Balance</th>
                          <th className="text-right">Monthly Aggregate InterestRate</th>
                          <th className="text-right">Monthly Aggregate Total Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.poolreporting.monthaggr.length > 0 &&
                          this.props.poolreporting.monthaggr.map((mor, index) => (
                            <tr key={index}>
                              <td className="text-right">{moment(mor.payment_date).format('MM/DD/YYYY')}</td>
                              <td className="text-right">{Number(mor.bal).toFixed(3)}</td>
                              <td className="text-right">{Number(mor.s_bal).toFixed(3)}</td>
                              <td className="text-right">
                                {Number(poolreporting.weighted_average_interest_rate[index]).toFixed(3)}
                              </td>
                              <td className="text-right">{Number(mor.c_bal).toFixed(3)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

PoolLevelReporting.defaultProps = {
  selectedPoolMortgageList: [],
  poolName: '',
  poolDate: '',
  poolreporting: [],
  isLogin: false,
  userData: {},
  error: undefined
};

PoolLevelReporting.protoTypes = {
  selectedPoolMortgageList: PropTypes.arrayOf(Object),
  poolName: PropTypes.string,
  poolDate: PropTypes.string,
  poolreporting: PropTypes.arrayOf(Object),
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  error: PropTypes.func
};

const mapStateToProps = state => {
  return {
    selectedPoolMortgageList: state.admin.selectedPoolMortgageList,
    poolName: state.admin.poolName,
    poolDate: state.admin.poolDate,
    poolreporting: state.admin.poolreporting,
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  {
    startLoading,
    stopLoading,
    error
  }
)(withRouter(PoolLevelReporting));
