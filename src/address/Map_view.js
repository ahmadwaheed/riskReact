import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import htmlToJson from 'html-to-json';
import * as myapi from './../ConfigUri'; // we imported the ConfigUri file for getting all url
import { GoogleMapsWrapper } from './map_component';
import { Marker, KmlLayer } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import AdvanceSearch from './Map_Component/AdvanceSearch';
import MapInfo from './Map_Component/map_info';
import Loader from '../Loder/Loders';
import NavigationBar from '../home/NavigationTab';
import MortageDetail from '../address/Map_Component/isDetailMoratage';
import ViewPayments from '../address/Map_Component/viewPayment';
import { error } from '../actions/login/loginAction';
import {
  handleFetchingMarkers,
  clearMarkers,
  getSmsCode,
  handleSmsaCodeData,
  handleAdvanceSearchData,
  beforeGetAddressData,
  addLayer,
  handleAddressData,
  handleIsViewMapInfo,
  handleIspayment,
  handleSwitchingTab
} from '../actions/map/MapAction';
let circle;

export class Map_view extends React.Component {
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXXXX
  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      this.props.handleSwitchingTab();
      const url = myapi.Map_View;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        })
      })
        .then(res => res.json())
        .then(data => {
          this.props.handleFetchingMarkers(data);
        });
    }
  }

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
    this.props.beforeGetAddressData();

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
          this.props.handleAddressData(findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  onCircleComplete = shape => {
    if (shape === null || !(shape instanceof window.google.maps.Circle)) return;
    if (circle !== null) {
      circle.setMap(null);
      circle = null;
    }

    circle = shape;

    this.checkMarkersWithinBounds(
      circle.getBounds().getNorthEast(),
      circle.getBounds().getSouthWest(),
      this.props.markers
    );
  };

  checkMarkersWithinBounds = (northEast, southEast, pins) => {
    let northlat = northEast.lat();
    let northlng = northEast.lng();
    let southlat = southEast.lat();
    let southlng = southEast.lng();
    let filteredValue = [];

    for (let i = 0; i < pins.length; i++) {
      let marker1 = pins[i];

      if (marker1.lat < northlat && marker1.lat > southlat) {
        if (marker1.long < northlng && marker1.lat > southlng) {
          filteredValue.push({ lat: marker1.lat, long: marker1.long });
        }
      }
    }

    var data = {
      filterArea: filteredValue
    };
    this.getAddressData(data);
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  viewPayment = data => {
    let paymentlist = { ...data };

    fetch(`${myapi.viewPayment}/${paymentlist.propertyid}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (!findresponse) {
          return;
        } else {
          this.setState({
            payment: findresponse,
            paymentData: paymentlist,
            ispayment: true,
            isDetails: false,
            isdata: true
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
  //XXBAck button handler parent getting child value XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  handleBackButtonFromAdavanceSearch = Value => {
    this.setState({ isAdvanceSearch: Value });
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.clearMarkers();
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
            this.props.handleFetchingMarkers(findresponse);
            let filteredValue = [];

            for (let i = 0; i < findresponse.length; i++) {
              let marker1 = findresponse[i];
              filteredValue.push({ lat: marker1.lat, long: marker1.long });
            }

            var data = {
              filterArea: filteredValue
            };
            this.getAddressData(data);
          } else {
            console.log(findresponse);
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

  // AdvanceSearch Button onClick listener XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  advanseSearch = () => {
    var data = {
      limit: this.props.limit,
      offset: this.props.offset
    };

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
          this.getsmsacode();
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  //logoutXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    this.props.history.push('/');
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  renderContent = () => {
    if (this.props.isViewMapInfo) {
      return (
        <div>
          <MapInfo />
        </div>
      );
    } else if (this.props.isDetails) {
      return <MortageDetail />;
    } else if (this.props.ispayment) {
      return (
        <div>
          <ViewPayments />
        </div>
      );
    }
  };

  renderBack() {
    if (this.props.isdata === true) {
      return (
        <span className="back-icon" onClick={() => this.callBack()}>
          <img src="img/back-arrow.png" alt="back-arrow" />
        </span>
      );
    }
  }

  callBack = () => {
    if (this.props.ispayment) {
      this.props.handleIspayment();
    } else {
      this.props.handleIsViewMapInfo();
    }
  };

  bacKToMap() {
    this.setState({ isAdvanceSearch: false });
  }

  //event for disable Circle(Drawing manager tool) when drawing mode disabled
  handleMapClick = () => {
    if (circle) circle.setMap(null);
  };

  displaymap() {
    if (!this.props.isAdvanceSearch) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isMap={true} />
                <div
                  className="col-sm-6 col-md-8 col-xs-12 nopad flex-center right-side-upper"
                  style={{ margin: '15 0 15 0' }}
                >
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here ..."
                      id="searchmap"
                      onKeyPress={event => this.handleKeyPress(event)}
                      name="search"
                    />
                    <i className="fa fa-search form-icon-wrapper" />
                  </div>
                  <button className="btn btn-advance-search" onClick={() => this.advanseSearch()}>
                    Advanced Search
                  </button>
                  {this.renderBack()}
                </div>
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-sm-6 col-xs-12 pad-half margin-bottom-xs">
                  <ul className="polygon-img-wrapper">
                    <li>
                      <img
                        src="img/primary-kig-polygon.png"
                        alt="primary-kig-polygon"
                        onClick={() => this.props.addLayer()}
                      />
                    </li>
                  </ul>

                  <div>
                    <GoogleMapsWrapper
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `calc(100vh - 240px)` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                      zoom={this.props.zoom}
                      defaultCenter={{
                        lat: this.props.lat,
                        lng: this.props.lang
                      }}
                      onClick={this.handleMapClick}
                    >
                      {this.props.markers.length >= 1 ? (
                        <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
                          {this.props.markers.map(marker => (
                            <Marker
                              key={marker.id}
                              icon={{
                                url: `img/marker-icon.png`
                              }}
                              position={{
                                lat: Number(marker.lat),
                                lng: Number(marker.long)
                              }}
                              onClick={() => this.getDetails(marker.id, marker.lat, marker.long)}
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
                        onCircleComplete={this.onCircleComplete}
                      />

                      {this.KmlLayer()}
                    </GoogleMapsWrapper>
                  </div>
                </div>
                {this.props.isViewLoader ? (
                  <div
                    style={{
                      width: '50%',
                      float: 'left',
                      height: 'calc(100vh - 240px)',
                      position: 'relative'
                    }}
                  >
                    <div style={{}}>
                      <Loader myview={false} />
                    </div>
                  </div>
                ) : null}{' '}
                {this.renderContent()}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.props.isAdvanceSearch) {
      return (
        <div>
          {' '}
          <AdvanceSearch />{' '}
        </div>
      );
    }
  }

  // My view is created in Map_component > displayllist.js XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxAbove component is created XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  //These are the method XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  getsmsacode = () => {
    fetch(myapi.getsmscodelist, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (!findresponse) {
          return;
        } else {
          this.props.getSmsCode(findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  onDragEnd = event => {
    var model = this;

    htmlToJson.parse(
      event.featureData.description,
      {
        text: function($doc) {
          return $doc.find('center').text();
        }
      },
      function(err, result) {
        var str = result.text;
        var searchString = str.substring(str.lastIndexOf('CBSAFP') + 6, str.lastIndexOf('AFFGEOID'));
        var data = searchString.replace(/\s/g, '');
        model.getsmsacodedata(data);
      }
    );
  };

  getsmsacodedata = code => {
    var data = {
      smsacode: code
    };

    fetch(myapi.getsmscodedata, {
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
          this.props.handleSmsaCodeData(findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  KmlLayer() {
    if (this.props.isdisplaykml) {
      return (
        <KmlLayer
          url="https://s3-th-west-1.amazonaws.com/client/test/1312.kml"
          options={{
            preserveViewport: true
          }}
          onClick={this.onDragEnd}
        />
      );
    }
  }

  closepayment() {
    this.setState({ ispaymentAdvanse: false });
  }

  render() {
    return <div>{this.displaymap()}</div>;
  }
}

Map_view.defaultProps = {
  isLogin: false,
  userData: {}
};

Map_view.propTypes = {
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
    offset: state.map.offset
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleFetchingMarkers: markers => dispatch(handleFetchingMarkers(markers)),
    clearMarkers: () => dispatch(clearMarkers()),
    getSmsCode: data => dispatch(getSmsCode(data)),
    handleSmsaCodeData: data => dispatch(handleSmsaCodeData(data)),
    handleAdvanceSearchData: data => dispatch(handleAdvanceSearchData(data)),
    addLayer: () => dispatch(addLayer()),
    handleAddressData: data => dispatch(handleAddressData(data)),
    beforeGetAddressData: () => dispatch(beforeGetAddressData()),
    handleIspayment: () => dispatch(handleIspayment()),
    handleIsViewMapInfo: () => dispatch(handleIsViewMapInfo()),
    handleSwitchingTab: () => dispatch(handleSwitchingTab()),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Map_view));
