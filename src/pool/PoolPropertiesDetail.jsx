import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { getPoolPropertiesDetail } from '../actions/admin/mortgage_pool_container';
import NavigationBar from '../home/NavigationTab';
import Loader from '../Loder/Loders';
import MessageNotification from '../MessageNotification';
import { CSVLink } from 'react-csv';
let postalCode;
let poolId;

class PoolPropertiesDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false,
      modalHeader: '',
      isModalOpen: false,
      isDeletedOpen: false,
      userData: [],
      poolPropertieDetail: [],
      metaData: ''
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      poolId = this.props.match.params.poolId;
      let year = this.props.match.params.year;
      let quarter = this.props.match.params.quarter;
      postalCode = this.props.match.params.postalCode;
      if (poolId !== '' && year !== '' && quarter !== '' && postalCode !== '') {
        this.loadPoolData(poolId, year, quarter, postalCode);
      } else if (poolId !== '') {
        this.props.history.push('/pool-data/' + poolId);
      } else {
        this.props.history.push('/mortgage-pool');
      }

      if (document.getElementById('userDataElement')) {
        document.getElementById('userDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
      }
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('userDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    let scroll = document.getElementById('userData');

    if (scroll && translate) {
      scroll.style.transform = translate;
    }
  };

  loadPoolData = (poolId, year, quarter, postalCode) => {
    this.setState({
      isLoading: false
    });
    let body = {
      year: year,
      quater: quarter,
      poolid: poolId,
      postalcode: postalCode
    };

    getPoolPropertiesDetail(this.props.userData.token, body).then(res => {
      if (res && res.data) {
        this.setState({
          poolPropertieDetail: res.data.hpiData,
          metaData: res.data.metadata,
          isLoader: true
        });
      } else if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  goBack = () => {
    this.props.history.push('/pool-data/' + poolId);
  };

  downloadCsv = url => {
    window.open(url);
  };

  render() {
    return (
      <div>
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isPools={true} />
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12">
                  <h2 className="col-xs-12">
                    Pool Properties Data
                    <span className="back-arrow shadow-arrow">
                      <img src="img/back-arrow.png" onClick={this.goBack} alt="back-arrow" />
                    </span>
                  </h2>
                </div>
                <div className="col-xs-12 py-own text-center">{this.state.metaData}</div>
                <div className="col-xs-12 table-responsive">
                  <Scrollbars
                    id="userDataElement"
                    className="scrollStyle"
                    style={{ maxHeight: '50vh', minHeight: '50vh' }}
                  >
                    {!this.state.isLoader ? <Loader myview={this.state.isLoader} /> : null}
                    <table className="table table-borderless">
                      <thead id="userData" style={{ backgroundColor: '#fff' }}>
                        <tr>
                          <th style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                            Year
                          </th>
                          <th style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                            Quarter
                          </th>
                          <th style={{ width: '160px', maxWidth: '160px' }} className="text-center">
                            Address
                          </th>
                          <th style={{ width: '160px', maxWidth: '160px' }} className="text-center">
                            Source
                          </th>
                          <th style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                            HPI
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.poolPropertieDetail &&
                          this.state.poolPropertieDetail.length > 0 &&
                          this.state.poolPropertieDetail.map((data, index) => (
                            <tr key={index}>
                              <td style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                                {data.year}
                              </td>
                              <td style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                                {data.qtr ? data.qtr : null}
                              </td>
                              <td style={{ width: '160px', maxWidth: '160px' }} className="text-center">
                                <div className="text-center">{data.address1 ? data.address1 : null}</div>
                                <div className="text-center">
                                  {data.city ? data.city + ', ' + data.state + ' ' + postalCode : null}
                                </div>
                              </td>
                              <td style={{ width: '160px', maxWidth: '160px' }} className="text-center">
                                {data.source && data.area && data.source !== '' && data.area !== ''
                                  ? data.source + '-' + data.area
                                  : data.source}
                              </td>
                              <td style={{ width: '20px', maxWidth: '80px' }} className="text-center">
                                {data.local ? Number(data.local).toFixed(2) : null}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Scrollbars>
                </div>
              </div>
              {this.state.poolPropertieDetail.length > 0 ? (
                <div className="col-xs-12 flex-center pad-up-down csv-info">
                  <div style={{ padding: '5px' }}>
                    {this.state.poolPropertieDetail[1].source_url !== '' &&
                    this.state.poolPropertieDetail[1].source_url ? (
                      <button
                        className="btn orange-bg btn-own"
                        onClick={() => this.downloadCsv(this.state.poolPropertieDetail[1].source_url)}
                      >
                        Unprocessed Hpi Data
                      </button>
                    ) : null}
                  </div>
                  <div style={{ padding: '5px' }}>
                    <CSVLink data={this.state.poolPropertieDetail} className="btn orange-bg btn-own">
                      {' '}
                      Processed Hpi Data
                    </CSVLink>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PoolPropertiesDetail.defaultProps = {
  getPoolPropertiesDetail: undefined,
  userData: {}
};

PoolPropertiesDetail.propTypes = {
  userData: PropTypes.objectOf(String),
  getPoolPropertiesDetail: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getPoolPropertiesDetail }
)(withRouter(PoolPropertiesDetail));
