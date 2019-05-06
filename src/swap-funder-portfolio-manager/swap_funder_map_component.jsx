import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import htmlToJson from 'html-to-json';
import { Scrollbars } from 'react-custom-scrollbars';
import { GoogleMapsWrapper } from '../address/map_component';
import { Marker, KmlLayer } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import defaultImage from './default-property.jpg';
import * as myapi from './../ConfigUri';
import { BorrowerAccountInfo } from '../borrower/borrower_account_info';
import Loader from '../Loder/Loders';
import './swap_funder_map_component.css';
let circle;

class SwapFunderMapComponent extends React.Component {
  //XXXXXXXXXXXXXXXXXXXXX Constructor XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxXXXXXXX
  constructor(props) {
    super(props);

    this.state = {
      isViewDetail: false,
      isViewAccountInfo: false,
      isViewSwapHistory: false,
      isDisplayKml: false,
      isViewHeatMap: false,
      isViewLoader: false,
      swapBalanceHistoryStatus: '',
      selectedMarker: [],
      accountInfo: [],
      swapBalanceData: [],
      markers: [],
      userData: props.userData,
      token: props.userData.token,
      lat: 36.950901,
      lang: -122.04681,
      zoom: 3,
      isActiveHomeTab: true,
      isActiveSummaryTab: false,
      swapFunderSummaryData: [],
      swapFunderSummaryStatus: '',
      isViewPropertyDetail: false,
      propertyDetailData: {},
      propertyResponseCode: ''
    };
  }

  componentDidUpdate() {
    if (document.getElementById('portFolioSummary')) {
      document.getElementById('portFolioSummary').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    } else {
      const url = myapi.getMortgageListByMSA;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.state.token
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ markers: data });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    if (document.getElementById('portFolioSummary')) {
      let scrollEle = document.getElementById('portFolioSummary').children[0];
      var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
      document.getElementById('portFolioList').style.transform = translate;
    }
  };

  viewAccountInfo = accountNumber => {
    this.setState({
      isViewLoader: true,
      isViewDetail: false
    });
    const url = myapi.getSelectedBorrowerProfile + accountNumber;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length >= 1)
          this.setState({
            isViewAccountInfo: true,
            isViewDetail: false,
            isViewLoader: false,
            accountInfo: response[0]
          });
        else
          this.setState({
            isViewAccountInfo: true,
            isViewDetail: false,
            isViewLoader: false,
            accountInfo: []
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  viewPropertyDetail = (street, city, stateCode) => {
    this.setState({
      isViewDetail: false,
      isViewLoader: true
    });

    const url = myapi.getPropertyDetails + street + '&citystatezip=' + city + ' ' + stateCode;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.code === '508')
          this.setState({
            isViewPropertyDetail: true,
            isViewDetail: false,
            isViewLoader: false,
            propertyResponseCode: response.code,
            propertyDetailData: {}
          });
        else
          this.setState({
            isViewPropertyDetail: true,
            isViewDetail: false,
            isViewLoader: false,
            propertyResponseCode: response.code,
            propertyDetailData: response.data
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleAccountInfo = borrower_id => {
    this.setState({ isViewLoader: true, isViewAccountInfo: false });
    const url = myapi.getBorrowerSwapBalanceHistory + borrower_id;

    fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      })
    })
      .then(Response => Response.json())
      .then(response => {
        if (response.length === 0) {
          this.setState({
            swapBalanceHistoryStatus: 'No Records Found',
            swapBalanceData: [],
            isViewSwapHistory: true,
            isViewAccountInfo: false,
            isViewDetail: false,
            isViewLoader: false
          });
        } else {
          this.setState({
            swapBalanceData: response,
            swapBalanceHistoryStatus: '',
            isViewSwapHistory: true,
            isViewAccountInfo: false,
            isViewDetail: false,
            isViewLoader: false
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderBackButton() {
    if (this.state.isViewSwapHistory || this.state.isViewAccountInfo || this.state.isViewPropertyDetail)
      return (
        <span className="back-arrow" onClick={() => this.callBack()}>
          <img src="img/back-arrow.png" alt="back-arrow" />
        </span>
      );
    else
      return (
        <span className="back-arrow invisible">
          <img src="img/back-arrow.png" alt="back-arrow" />
        </span>
      );
  }

  callBack = () => {
    if (this.state.isViewAccountInfo || this.state.isViewPropertyDetail) {
      this.setState({
        isViewAccountInfo: false,
        isViewDetail: true,
        isViewSwapHistory: false,
        isViewPropertyDetail: false
      });
    } else {
      this.setState({
        isViewAccountInfo: true,
        isViewDetail: false,
        isViewSwapHistory: false,
        isViewPropertyDetail: false
      });
    }
  };

  addlayer = () => {
    this.setState({ isDisplayKml: !this.state.isDisplayKml });
  };

  viewHeatMapLayer = () => {
    this.setState({ isViewHeatMap: !this.state.isViewHeatMap });
  };

  KmlLayer() {
    if (this.state.isDisplayKml) {
      return (
        <KmlLayer
          url="https://s3-th-west-1.amazonaws.com/client/13244.kml"
          options={{
            preserveViewport: true
          }}
          onClick={this.onDragEnd}
        />
      );
    }
  }

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
      this.state.markers
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

  onDragEnd = event => {
    const constructor = this;

    htmlToJson.parse(
      event.featureData.description,
      {
        text: function($doc) {
          return $doc.find('center').text();
        }
      },
      function(err, result) {
        const str = result.text;
        const searchString = str.substring(str.lastIndexOf('CBSAFP') + 6, str.lastIndexOf('AFFGEOID'));
        const data = searchString.replace(/\s/g, '');
        constructor.getMSACodeData(data);
      }
    );
  };

  getMSACodeData(code) {
    this.setState({ isViewLoader: true });
    const data = {
      smsacode: code
    };

    fetch(myapi.getsmscodedata, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      }),
      body: JSON.stringify(data)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          selectedMarker: findresponse,
          isViewDetail: true,
          isViewSwapHistory: false,
          isViewAccountInfo: false,
          isViewPropertyDetail: false,
          isViewLoader: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  displaymap() {
    let heatMapData = [];

    if (this.state.isViewHeatMap) {
      this.state.markers.forEach(element => {
        heatMapData.push({
          location: new window.google.maps.LatLng(element.lat, element.long),
          weight: element.weight
        });
      });
    }

    return (
      <div className="own-container">
        <div
          className="col-xs-12 pad-half white-bg curve-own pad-up-down margin-bottom-xs"
          style={{ marginTop: '-20px' }}
        >
          <div className="col-sm-6 col-xs-12 pad-half margin-bottom-xs">
            <ul className="list-inline polygon-img-wrapper" style={{ marginLeft: '13px' }}>
              <li onClick={this.addlayer}>
                <img src="img/primary-kig-polygon.png" alt="primary-kig-polygon" />
              </li>
              <li onClick={this.viewHeatMapLayer}>
                <img src="img/icon-button-heat.png" alt="heat-map-layer" />
              </li>
            </ul>

            <div className="col-xs-12 nopad">
              <GoogleMapsWrapper
                ref="map"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `calc(100vh - 240px)` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                zoom={this.state.zoom}
                defaultCenter={{ lat: this.state.lat, lng: this.state.lang }}
              >
                <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
                  {this.state.markers.map((marker, index) => (
                    <Marker
                      key={index}
                      icon={{
                        url: `img/marker-icon.png`
                      }}
                      position={{
                        lat: Number(marker.lat),
                        lng: Number(marker.long)
                      }}
                      onClick={() => this.getDetails(marker)}
                    />
                  ))}
                </MarkerClusterer>
                {this.KmlLayer()}
                {this.state.isViewHeatMap ? (
                  <HeatmapLayer data={heatMapData} options={{ radius: 25, dissipating: true }} />
                ) : null}
              </GoogleMapsWrapper>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 nopad">
            {this.state.isViewLoader ? (
              <div style={{ marginTop: '65%' }}>
                <Loader myview={false} />
              </div>
            ) : null}
            {!this.state.isViewLoader ? this.renderContent() : null}
          </div>
        </div>
      </div>
    );
  }

  renderMapInfoTable() {
    return (
      <div className="col-xs-12  pad-half">
        <div className="col-xs-12 nopad table-responsive details-table fix-height-table fix-height-table-swap-funder">
          <Scrollbars className="scrollStyle" id="mortgageListScroll" style={{ maxHeight: '40vh' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Property Address</th>
                  <th>Original Loan Amount</th>
                  <th>Current Balance</th>
                  <th>Origination Date</th>
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.selectedMarker.map((info, index) => (
                  <tr key={index}>
                    <td>{info.propertyid}</td>
                    <td>
                      <span className="white-space">{info.address1}</span>
                      <br />
                      {info.city}
                      &#44;&nbsp;
                      {info.state}
                      &nbsp;
                      {info.postalcode}
                    </td>

                    <td>
                      $
                      {Number(info.gse_loan).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>
                      $
                      {((Number(info.gse_loan) * 40) / 100).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{moment(info.first_payment_due_date).format('MM/DD/YYYY')}</td>
                    <td>
                      <button className="btn btn-orange" onClick={() => this.viewAccountInfo(info.propertyid)}>
                        View Account
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-orange"
                        onClick={() => this.viewPropertyDetail(info.address1, info.city, info.state)}
                      >
                        View Property Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scrollbars>
        </div>
      </div>
    );
  }

  renderContent() {
    if (this.state.isViewDetail) {
      return <div>{this.renderMapInfoTable()}</div>;
    } else if (this.state.isViewAccountInfo) {
      return (
        <div className="col-xs-12 nopad swap-account-info-wrapper fix-height-240">
          <BorrowerAccountInfo accountInfo={this.state.accountInfo} handleAccountInfo={this.handleAccountInfo} />
        </div>
      );
    } else if (this.state.isViewSwapHistory) {
      return <div>{this.renderSwapBalanceTable()}</div>;
    } else if (this.state.isViewPropertyDetail) return <div>{this.renderPropertyDetail()}</div>;
  }

  renderPropertyDetail() {
    const property = this.state.propertyDetailData;
    if (this.state.propertyResponseCode === 0)
      return (
        <div className="col-xs-12 nopad swap-account-info-wrapper">
          <div className="img-details-wrapper text-center">
            <img src={property.deatil.imageUrl || defaultImage} alt="property_image" />
            <div className="txt-under-img">
              {property.address.street}
              <br />
              {property.address.city}, {property.address.state}
              &nbsp;
              {property.address.zipcode}
            </div>
          </div>
          <ul className="details-list col-xs-12 list-unstyled img-txt-list" style={{ backgroundColor: 'white' }}>
            {property.bedrooms ? (
              <li className="dot col-xs-12 green-dot">
                <div>Number Of Bedrooms</div>
                <div>{property.bedrooms}</div>
              </li>
            ) : null}
            {property.bathrooms ? (
              <li className="dot col-xs-12 blue-dot">
                <div>Number Of Bathrooms</div>
                <div>{property.bathrooms}</div>
              </li>
            ) : null}
            {property.totalRooms ? (
              <li className="dot col-xs-12 red-dot">
                <div>Number Of Rooms</div>
                <div>{property.totalRooms}</div>
              </li>
            ) : null}
            {property.finishedSqFt ? (
              <li className="dot col-xs-12 green-dot">
                <div>Area(sqft)</div>
                <div>{property.finishedSqFt}</div>
              </li>
            ) : null}
            {property.deatil.editedFacts && property.deatil.editedFacts.parkingType ? (
              <li className="dot col-xs-12 sky-blue-dot">
                <div>Parking Type</div>
                <div>{property.deatil.editedFacts.parkingType}</div>
              </li>
            ) : null}

            {property.deatil.editedFacts && property.deatil.editedFacts.heatingSources ? (
              <li className="dot col-xs-12 yellow-dot">
                <div>Heating Source</div>
                <div>{property.deatil.editedFacts.heatingSources}</div>
              </li>
            ) : null}
            {property.deatil.editedFacts && property.deatil.editedFacts.heatingSystem ? (
              <li className="dot col-xs-12 blue-dot">
                <div>Heating System </div>
                <div>{property.deatil.editedFacts.heatingSystem}</div>
              </li>
            ) : null}
            {property.deatil.editedFacts && property.deatil.editedFacts.coolingSystem ? (
              <li className="dot col-xs-12 green-dot">
                <div>Cooling System</div>
                <div>{property.deatil.editedFacts.coolingSystem}</div>
              </li>
            ) : null}
            {property.deatil.editedFacts && property.deatil.editedFacts.appliances ? (
              <li className="dot col-xs-12 blue-dot">
                <div>Appliances</div>
                <div>{property.deatil.editedFacts.appliances}</div>
              </li>
            ) : null}
            {property.deatil.editedFacts && property.deatil.editedFacts.floorCovering ? (
              <li className="dot col-xs-12 red-dot">
                <div>Floor Covering</div>
                <div>{property.deatil.editedFacts.floorCovering}</div>
              </li>
            ) : null}
            <li className="dot col-xs-12 sky-blue-dot">
              <a style={{ color: 'blue', cursor: 'pointer' }} href={property.homedetails} target="_blank">
                see Zillow details page
              </a>
            </li>
          </ul>
        </div>
      );
    else
      return (
        <div style={{ color: 'black', textAlign: 'center', marginTop: '260px' }}>
          <h4>No Records Found</h4>
        </div>
      );
  }

  renderSwapBalanceTable = () => {
    if (this.state.swapBalanceData.history.length >= 1)
      return (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction type</th>
              <th>Adjustment amount</th>
              <th>Swap balance</th>
            </tr>
          </thead>

          {this.state.swapBalanceData.history.map((record, index) => (
            <DisplaySwapBalanceRows key={index} data={record} />
          ))}
        </table>
      );
    else
      return (
        <div style={{ color: 'black', textAlign: 'center', marginTop: '260px' }}>
          <h4>{this.state.swapBalanceHistoryStatus}</h4>
        </div>
      );
  };

  getDetails = selectedMarker => {
    this.getMSACodeData(selectedMarker.msa);
  };

  getAddressData = data => {
    this.setState({ isViewLoader: true, isViewDetail: false });

    fetch(myapi.Map_Details, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.state.token
      }),
      body: JSON.stringify(data)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        this.setState({
          selectedMarker: findresponse,
          isViewDetail: true,
          isViewSwapHistory: false,
          isViewAccountInfo: false,
          isViewPropertyDetail: false,
          isViewLoader: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleTab = props => {
    if (props === 'summary') {
      const url = myapi.getSwapFunderSummary;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.state.token
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.length >= 1)
            this.setState({
              swapFunderSummaryData: data,
              swapFunderSummaryStatus: '',
              isActiveHomeTab: !this.state.isActiveHomeTab,
              isActiveSummaryTab: !this.state.isActiveSummaryTab,
              isViewAccountInfo: false,
              isViewSwapHistory: false,
              isViewPropertyDetail: false
            });
          else
            this.setState({
              swapFunderSummaryData: [],
              swapFunderSummaryStatus: 'No Records Found',
              isActiveHomeTab: !this.state.isActiveHomeTab,
              isActiveSummaryTab: !this.state.isActiveSummaryTab,
              isViewAccountInfo: false,
              isViewSwapHistory: false,
              isViewPropertyDetail: false
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else
      this.setState({
        isActiveHomeTab: !this.state.isActiveHomeTab,
        isActiveSummaryTab: !this.state.isActiveSummaryTab,
        isViewAccountInfo: false,
        isViewSwapHistory: false,
        isViewPropertyDetail: false
      });
  };

  renderPortfolioSummaryComponent = () => {
    const { thead } = styles;
    if (this.state.swapFunderSummaryData.length >= 1)
      return (
        <div className="col-xs-12 table-responsive details-table no-shadow own-radious nopad striped-table-own margin-bottom">
          <Scrollbars className="scrollStyle" id="portFolioSummary" style={{ maxHeight: '75vh' }}>
            <table className="table" style={{ backgroundColor: 'white' }}>
              <thead id="portFolioList" style={{ ...thead }}>
                <tr>
                  <th>MSA</th>
                  <th>Index weight</th>
                  <th>Actual weight</th>
                  <th>Total mortgage value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.swapFunderSummaryData.map((record, index) => (
                  <DisplaySummaryRows key={index} data={record} />
                ))}
              </tbody>
            </table>
          </Scrollbars>
        </div>
      );
    else
      return (
        <div style={{ color: 'black', textAlign: 'center', marginTop: '260px' }}>
          <h4>{this.state.swapFunderSummaryStatus}</h4>
        </div>
      );
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div className="col-xs-12 nopad">
        <ul className="col-xs-12 col-sm-12 nopad list-unstyled list-inline own-tab swap-tab">
          <li
            className={this.state.isActiveHomeTab ? 'active' : 'inactive'}
            onClick={!this.state.isActiveHomeTab ? () => this.handleTab(null) : null}
          >
            Home
          </li>

          <li
            className={this.state.isActiveSummaryTab ? 'active' : 'inactive'}
            onClick={!this.state.isActiveSummaryTab ? () => this.handleTab('summary') : null}
          >
            Portfolio Analysis
          </li>
          <div className="pull-right">
            {this.props.userData.role === 'Admin' ? (
              <span className="back-arrow shadow-arrow" onClick={() => this.goBack()}>
                <img src="img/back-arrow.png" alt="back-arrow" style={{ marginBottom: '0px' }} />
              </span>
            ) : null}
          </div>
        </ul>
        {this.renderBackButton()}{' '}
        {this.state.isActiveHomeTab ? this.displaymap() : this.renderPortfolioSummaryComponent()}
      </div>
    );
  }
}

const DisplaySwapBalanceRows = props => {
  return (
    <tbody>
      <tr>
        <td>{props.data.store_date ? moment(props.data.store_date).format('MM/DD/YYYY') : null}</td>
        <td>{props.data.transaction_type}</td>
        <td>
          $
          {Number(props.data.adjustment_amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          ${Number(props.data.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    </tbody>
  );
};

const DisplaySummaryRows = props => {
  return (
    <tr>
      <td>
        {props.data.msacode} &nbsp; {props.data.msa_name}
      </td>
      <td>{props.data.index}</td>
      <td>{props.data.actuallweight}</td>
      <td>{props.data.total_weight_value}</td>
    </tr>
  );
};

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};
export default withRouter(SwapFunderMapComponent);
