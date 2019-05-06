import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { createRef } from 'create-react-ref';
import Modal from 'react-responsive-modal';
import DatePicker from 'react-datepicker';
import { getPoolPeriod, getPoolProperties, getCsvPoolData, getHpiData } from '../actions/admin/mortgage_pool_container';
import NavigationBar from '../../src/home/NavigationTab';
import Loader from '../Loder/Loders';
import SearchMortgage from '../SearchMortgageList';

let hpiDate;
let poolId;

class PoolPropertiesComponent extends React.Component {
  constructor() {
    super();
    this.csvLink = createRef();

    this.state = {
      isLoader: false,
      poolPeriodList: [],
      propertiesData: [],
      isOpen: false,
      poolType: '',
      poolMessage: '',
      modalHeader: '',
      currentYear: null,
      currentPeriod: {},
      currentpage: 1,
      limit: 200,
      offset: 0,
      next: false,
      prev: false,
      totalValues: 0,
      totalPages: 0,
      isCsv: false,
      newArray: [],
      searchText: '',
      clearText: false,
      assignDate: new Date(),
      propertyId: '',
      isPropertyId: false,
      hpiValue: '',
      originalHpiTimePeriodType: ''
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (!data) {
      this.props.history.push('/');
    } else {
      let id = this.props.match.params.id;
      let timePeriod = this.props.match.params.timePeriod;
      let quarter = this.props.match.params.quarter;

      if (id && id !== '') {
        poolId = id;

        getPoolPeriod(this.props.userData.token, id).then(res => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res.length > 0) {
            this.setState({
              isLoader: true,
              poolPeriodList: res
            });
            if (
              id !== '' &&
              timePeriod !== '' &&
              timePeriod &&
              timePeriod.length === 4 &&
              quarter !== '' &&
              quarter > 0 &&
              quarter < 5
            ) {
              let period = {
                year: timePeriod,
                quarter: quarter
              };
              this.scrollDown(period, 'clear');
            }
          } else {
            this.setState({
              isLoader: true
            });
          }
        });
      } else {
        this.props.history.push('mortgage-pool');
      }
    }
  };

  openModal = data => {
    if (data && poolId !== '' && this.state.currentPeriod.year && this.state.currentPeriod.quarter) {
      this.props.history.push(
        '/pool-properties-Detail/' +
          poolId +
          '/' +
          this.state.currentPeriod.year +
          '/' +
          this.state.currentPeriod.quarter +
          '/' +
          data.postalcode
      );
    }
  };

  displayNext() {
    return (
      <div className="flex-center" style={{ marginTop: '10px' }}>
        <div className="total-value" />
        <div
          style={{
            backgroundColor: '#fff',
            padding: '5px 5px',
            marginLeft: 'auto',
            marginRight: '10px'
          }}
        >
          Pages :{this.state.currentpage}/{this.state.totalPages}
        </div>
        <ul className="pagination-own list-inline">
          {this.state.prev ? (
            <li onClick={() => this.loadUserList(this.state.currentpage - 1, this.state.limit, '', this.state.checked)}>
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          ) : (
            <li className="disabled">
              {' '}
              <i className="fa fa-angle-double-left " />
            </li>
          )}
          {this.state.next ? (
            <li onClick={() => this.loadUserList(this.state.currentpage + 1, this.state.limit, '', this.state.checked)}>
              <i className="fa fa-angle-double-right" />{' '}
            </li>
          ) : (
            <li className="disabled">
              <i className="fa fa-angle-double-right" />
            </li>
          )}
        </ul>
        csvData
      </div>
    );
  }

  onCloseModal = () => {
    this.setState({
      isOpen: false,
      type: '',
      isPropertyId: false,
      propertyId: '',
      assignDate: new Date(),
      originalHpiTimePeriodType: '',
      hpiValue: ''
    });
  };

  goBack = () => {
    this.props.history.push('/mortgage-pool');
  };

  scrollDown = (period, data) => {
    if (data === undefined) {
      this.setState({
        clearText: true
      });
    }

    this.setState({
      propertiesData: [],
      isLoader: false,
      currentYear: period.year + 'Q' + period.quarter,
      currentPeriod: period
    });
    let minimumQuater = this.state.poolPeriodList[0].quarter;
    let minimumYear = this.state.poolPeriodList[0].year;
    let id = poolId;

    this.props.history.push('/pool-data/' + id + '/' + period.year + '/' + period.quarter);

    getPoolProperties(this.props.userData.token, period, minimumQuater, minimumYear, id).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');
      } else if (res) {
        this.setState({
          isLoader: true,
          propertiesData: res
        });
      } else {
        this.setState({
          isLoader: true
        });
      }
    });
  };

  handleChange = value => {
    this.setState({
      searchText: value,
      clearText: false
    });
    let filterList = [];

    if (value && value.length > 0) {
      filterList = this.props.poolProperties.filter(
        x =>
          x.propertyId.includes(value) ||
          x.borrower_name.toLowerCase().includes(value) ||
          x.address1.toLowerCase().includes(value)
      );

      this.setState({
        propertiesData: filterList
      });
    } else {
      this.setState({
        propertiesData: this.props.poolProperties
      });
    }
  };

  handleSubmit = value => {
    let filterList = [];

    if (value && value.length > 0) {
      filterList = this.props.poolProperties.filter(
        x =>
          x.propertyId.includes(value) ||
          x.borrower_name.toLowerCase().includes(value) ||
          x.address1.toLowerCase().includes(value)
      );

      this.setState({
        propertiesData: filterList,
        clearText: false
      });
    } else {
      this.setState({
        propertiesData: this.props.poolProperties,
        searchText: '',
        clearText: false
      });
    }
  };

  resetInput = () => {
    this.setState({
      propertiesData: this.props.poolProperties,
      searchText: ''
    });
  };

  openPropertyHistory = data => {
    this.props.history.push('/edit-property-data/' + data.propertyId + '/' + data.property_hashcode);
  };

  getcsvData = () => {
    let newarray = [];

    this.setState({
      isLoader: false
    });
    if (this.props.poolPropertiesCsvData && this.props.poolPropertiesCsvData.length > 0) {
      this.props.poolPropertiesCsvData.forEach(x => {
        x.propertyData.forEach((y, index) => {
          if (index !== x.propertyData.length - 1) {
            let old = {};
            old['year'] = x.year;
            old['quarter'] = x.quarter;
            old['property_id'] = y.propertyId;
            old['address1'] = y.address1;
            old['city'] = y.city;
            old['state'] = y.state;
            old['postalcode'] = y.postalcode;
            old['homeowner_name'] = y.borrower_name;
            old['local'] = y.local;
            old['local1'] = y.local1;
            old['type'] = y.type;
            old['message'] = y.message;
            old['weight'] = Number(y.weight).toFixed(2);
            old['swap_balance'] = Number(y.swapbalance).toFixed(2);
            old['Fee Income'] = 'US$ ' + Number(y.feeIncome).toFixed(2);
            old['Sum Of Fees'] = Number(y.sumOfFee).toFixed(2);
            old['Poolholders Equity'] = Number(x.propertyData[x.propertyData.length - 1].netSwapBalance).toFixed(2);

            old['Current Cash Position'] = Number(
              Number(y.sumOfFee) + Number(x.propertyData[x.propertyData.length - 1].netSwapBalance)
            ).toFixed(2);
            newarray.push(old);
          }
        });
      });

      this.setState({
        isLoader: true,
        newArray: newarray
      });

      this.setState({ newarray }, () => {
        this.csvLink.current.link.click();
      });
    } else {
      getCsvPoolData(
        this.props.userData.token,
        this.state.poolPeriodList[0].year,
        this.state.poolPeriodList[0].quarter,
        poolId
      ).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res.length > 0) {
          res.forEach(x => {
            x.propertyData.forEach((y, index) => {
              if (index !== x.propertyData.length - 1) {
                let old = {};
                old['year'] = x.year;
                old['quarter'] = x.quarter;
                old['property_id'] = y.propertyId;
                old['address1'] = y.address1;
                old['city'] = y.city;
                old['state'] = y.state;
                old['postalcode'] = y.postalcode;
                old['homeowner_name'] = y.borrower_name;
                old['local'] = y.local;
                old['local1'] = y.local1;
                old['type'] = y.type;
                old['message'] = y.message;
                old['weight'] = Number(y.weight).toFixed(2);
                old['swap_balance'] = Number(y.swapbalance).toFixed(2);
                old['Fee Income'] = 'US$ ' + Number(y.feeIncome).toFixed(2);
                old['Sum Of Fees'] = Number(y.sumOfFee).toFixed(2);
                old['Poolholders Equity'] = Number(x.propertyData[x.propertyData.length - 1].netSwapBalance).toFixed(2);

                old['Current Cash Position'] = Number(
                  Number(y.sumOfFee) + Number(x.propertyData[x.propertyData.length - 1].netSwapBalance)
                ).toFixed(2);
                newarray.push(old);
              }
            });
          });

          this.setState({
            isLoader: true,
            newArray: newarray
          });

          this.setState({ newarray }, () => {
            this.csvLink.current.link.click();
          });
        } else {
          this.setState({
            isLoader: true
          });
        }
      });
    }
  };

  handleDateChange = date => {
    let newDate = new Date(date);
    let month = (newDate.getMonth() + 1).toString();
    let day = newDate.getDate().toString();
    let year = newDate.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    hpiDate = `${year}-${month}-${day}`;

    this.setState({
      assignDate: newDate
    });
  };

  onInputChange = event => {
    const re = new RegExp(/^-?\d+\.?\d*$/);

    // if value is not blank, then test the regex
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({
        propertyId: event.target.value,
        isPropertyId: false
      });
    } else {
      this.setState({
        isPropertyId: true
      });
    }
  };

  submit = () => {
    if (this.state.propertyId !== '') {
      if (!hpiDate) {
        let newDate = new Date();
        let month = (newDate.getMonth() + 1).toString();
        let day = newDate.getDate().toString();
        let year = newDate.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        hpiDate = `${year}-${month}-${day}`;
      }

      getHpiData(this.props.userData.token, this.state.propertyId, hpiDate).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');
        } else if (res) {
          this.setState({
            isLoader: true,
            hpiValue: res.HPI,
            originalHpiTimePeriodType: res.originalHpiTimePeriodType
          });
        } else {
          this.setState({
            isLoader: true
          });
        }
      });
    } else {
      this.setState({
        isPropertyId: true
      });
    }
  };

  openNewModal = () => {
    this.setState({
      isOpen: true
    });
  };

  currentCashPosition = (sumOfFee, netSwap) => {
    return Number(sumOfFee + netSwap).toFixed(2);
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 pad-left-right-large">
            <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
              <NavigationBar isPools={true} />

              <div className="col-md-4 pull-right" style={{ marginTop: '10px' }}>
                {this.props.poolProperties.length > 0 ? (
                  <SearchMortgage
                    clearText={this.state.clearText}
                    handleSubmit={this.handleSubmit}
                    handleReset={this.resetInput}
                    handleOnchange={this.handleChange}
                  />
                ) : null}
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="col-xs-12 nopad bg-white pad-up pad-down img-rounded">
                      <h3 className="col-xs-8" style={{ marginTop: 0 }}>
                        Pool Performance
                      </h3>
                      <div className="col-xs-4">
                        <span
                          onClick={this.goBack}
                          className="back-arrow shadow-arrow"
                          style={{ marginBottom: '10px' }}
                        >
                          <img src="img/back-arrow.png" alt="back-arrow" />
                        </span>
                      </div>
                      {this.state.poolPeriodList.length === 0 ? (
                        <div className="text-center">No year Available</div>
                      ) : null}
                      <div
                        className="col-12 col-sm-3"
                        style={{
                          overflowY: 'auto',
                          maxHeight: 'calc(100vh - 254px)'
                        }}
                      >
                        <ul className="col-xs-12 nopad list-unstyled pool-properties-list">
                          {this.state.poolPeriodList && this.state.poolPeriodList.length > 0
                            ? this.state.poolPeriodList.map((year, index) => (
                                <li
                                  className={
                                    this.state.currentYear === year.year + 'Q' + year.quarter ? 'my-active' : null
                                  }
                                  title="Click to view Properties"
                                  key={index}
                                  onClick={() => this.scrollDown(year)}
                                >
                                  {year.year}Q{year.quarter}
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>

                      <div className="d-flex flex-wrap col-12 col-sm-9">
                        {this.state.propertiesData && this.state.poolPeriodList.length > 0 ? (
                          <div className="text-left nopad">
                            {' '}
                            <button className="btn btn-orange" onClick={() => this.openNewModal()}>
                              Calculate HPI
                            </button>
                          </div>
                        ) : null}

                        <h3 className="flex-1 text-center" style={{ marginTop: '0' }}>
                          {this.state.currentPeriod && this.state.currentPeriod.year && this.state.isLoader
                            ? this.state.currentPeriod.year + 'Q' + this.state.currentPeriod.quarter
                            : null}
                        </h3>

                        {this.state.propertiesData && this.state.poolPeriodList.length > 0 ? (
                          <div
                            // style={
                            //   this.state.propertiesData && this.state.propertiesData.length > 0
                            //     ? { float: 'right', marginLeft: '25%' }
                            //     : { float: 'right', marginLeft: '78%' }
                            // }
                            className="nopad min-btn-width-wrap text-right"
                          >
                            {' '}
                            <button
                              style={
                                this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }
                              }
                              type="button"
                              title="Export Pool History"
                              className="btn btn-orange"
                              onClick={() => this.getcsvData()}
                            >
                              {' '}
                              Export CSV
                            </button>
                            <CSVLink
                              data={this.state.newArray}
                              filename="data.csv"
                              className="hide"
                              ref={this.csvLink}
                              target="_blank"
                            >
                              {' '}
                              Export CSV
                            </CSVLink>
                          </div>
                        ) : null}
                      </div>
                      <div className="col-12 col-sm-9">
                        <div className="col-xs-12 nopad table-responsive" style={{ minHeight: '150px' }}>
                          <div style={{ marginTop: '5px' }}>
                            {' '}
                            <Loader myview={this.state.isLoader} />
                          </div>
                          {this.state.propertiesData && this.state.propertiesData.length > 0 ? (
                            <table className="table table-borderless" style={{ border: '1px solid #Ddd' }}>
                              <thead id="mortgageData" style={{}}>
                                <tr>
                                  <th className="text-center">Property Id</th>
                                  <th className="text-center">Address</th>
                                  <th className="text-center">City</th>
                                  <th className="text-center">State</th>
                                  <th className="text-center">Postal Code</th>
                                  <th className="text-center">Local HPI</th>
                                  <th className="text-center">Percentage Price</th>
                                  <th className="text-center">Swap Balance</th>
                                  <th className="text-center">Fee Income</th>
                                  <th className="text-center">Sum Of Fees</th>
                                  <th className="text-center">Poolholders Equity</th>
                                  <th className="text-center">Current Cash Position</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.propertiesData && this.state.propertiesData.length > 0
                                  ? this.state.propertiesData.map(
                                      (data, index) =>
                                        index !== this.state.propertiesData.length - 1 ? (
                                          <tr key={index + 'data'}>
                                            <td onClick={() => this.openPropertyHistory(data)} className="text-center">
                                              {' '}
                                              <u style={{ color: 'blue' }} className="cursor-own">
                                                {data.propertyId}
                                              </u>
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                              {data.address1}
                                            </td>
                                            <td className="text-center">{data.city}</td>
                                            <td className="text-center">{data.state}</td>
                                            <td className="text-center">{data.postalcode}</td>
                                            <td className="text-center">
                                              {data.local ? Number(data.local).toFixed(2) : null}
                                            </td>
                                            <td className="text-center">
                                              {' '}
                                              <u
                                                onClick={() => this.openModal(data)}
                                                style={{
                                                  cursor: 'pointer',
                                                  color: 'blue'
                                                }}
                                              >
                                                {data.weight ? Number(data.weight).toFixed(2) + '%' : null}
                                              </u>
                                            </td>
                                            <td className="text-center">
                                              {' '}
                                              {data.swapbalance ? Number(data.swapbalance).toFixed(2) : null}
                                            </td>
                                            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                              {data.feeIncome ? ' US$ ' + Number(data.feeIncome).toFixed(2) : null}
                                            </td>
                                            <td className="text-center">
                                              {data.sumOfFee ? Number(data.sumOfFee).toFixed(2) : null}
                                            </td>
                                            <td className="text-center">
                                              {this.state.propertiesData[this.state.propertiesData.length - 1]
                                                .netSwapBalance
                                                ? Number(
                                                    this.state.propertiesData[this.state.propertiesData.length - 1]
                                                      .netSwapBalance
                                                  ).toFixed(2)
                                                : null}
                                            </td>
                                            <td className="text-center">
                                              {this.currentCashPosition(
                                                Number(data.sumOfFee),
                                                Number(
                                                  this.state.propertiesData[this.state.propertiesData.length - 1]
                                                    .netSwapBalance
                                                )
                                              )}
                                            </td>
                                          </tr>
                                        ) : null
                                    )
                                  : null}
                              </tbody>
                            </table>
                          ) : this.props.poolProperties.length > 0 &&
                          this.state.poolPeriodList.length > 0 &&
                          this.state.isLoader ? (
                            <div className="col-xs-12 nopad text-center">No Search Data Available</div>
                          ) : this.state.poolPeriodList.length > 0 && this.state.isLoader ? (
                            <div className="col-xs-12 nopad text-center">No data available</div>
                          ) : null}
                        </div>
                        {this.state.propertiesData && this.state.propertiesData.length > 0 ? (
                          <div className="col-xs-12  pad-up-down text-right" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal open={this.state.isOpen} classNames={{ modal: 'custom-modal' }} onClose={this.onCloseModal} center>
                <h2 className="modal-header">HPI</h2>
                <div className="modal-body" style={{ minHeight: '375px' }}>
                  <div className="row form-group pad-down pad-half">
                    <label htmlFor="" className="col-xs-3 pad-half" style={{ paddingTop: '7px' }}>
                      Property Id:
                    </label>
                    <div className="col-xs-9 pad-half">
                      <input
                        name="pool-name"
                        placeholder="Property Id"
                        value={this.state.removalComment}
                        type="text"
                        className="form-control"
                        onChange={event => this.onInputChange(event)}
                      />
                      {this.state.isPropertyId ? <span style={{ color: 'red' }}>Please enter number only</span> : null}
                    </div>
                  </div>
                  <div className="row form-group pad-down pad-half">
                    <label htmlFor="" className="col-xs-3 pad-half" style={{ paddingTop: '5px', paddingBottom: '6px' }}>
                      Date:
                    </label>
                    <div className="col-xs-9 pad-half">
                      <DatePicker
                        className="custom-datepicker form-control"
                        dateFormat="MM/DD/YYYY"
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        selected={moment(this.state.assignDate)}
                        onChange={this.handleDateChange}
                        dropdownMode="select"
                        peekNextMonth
                      />
                    </div>
                  </div>
                  {this.state.hpiValue && this.state.hpiValue !== '' ? (
                    <div className="row form-group pad-down pad-half">
                      <label htmlFor="" className="col-xs-3 pad-half">
                        HPI:
                      </label>
                      <div className="col-xs-9 pad-half">{this.state.hpiValue}</div>
                    </div>
                  ) : null}
                  {this.state.originalHpiTimePeriodType && this.state.originalHpiTimePeriodType !== '' ? (
                    <div className="row form-group pad-down pad-half">
                      <label htmlFor="" className="col-xs-3 pad-half">
                        Time Period:
                      </label>
                      <div className="col-xs-9 pad-half">{this.state.originalHpiTimePeriodType}</div>
                    </div>
                  ) : null}
                  <div className="row" style={{ paddingTop: '160px' }}>
                    <div className="col-xs-3 col-xs-offset-6">
                      <button
                        disabled={this.state.isPropertyId}
                        onClick={() => this.submit()}
                        className="btn btn-block orange-bg btn-own"
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col-xs-3 text-right">
                      <button onClick={this.onCloseModal} className="btn btn-block orange-bg btn-own">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PoolPropertiesComponent.defaultProps = {
  poolPeriods: [],
  getPoolPeriod: undefined,
  getPoolProperties: undefined,
  poolProperties: [],
  getCsvPoolData: undefined,
  poolPropertiesCsvData: [],
  getHpiData: undefined
};

PoolPropertiesComponent.propTypes = {
  poolPeriods: PropTypes.arrayOf(Object),
  getPoolPeriod: PropTypes.func,
  getPoolProperties: PropTypes.func,
  poolProperties: PropTypes.arrayOf(Object),
  getCsvPoolData: PropTypes.func,
  poolPropertiesCsvData: PropTypes.arrayOf(Object),
  getHpiData: PropTypes.func
};

const mapStateToProps = state => {
  return {
    poolPeriods: state.admin.poolPeriods,
    poolProperties: state.admin.poolProperties,
    poolPropertiesCsvData: state.admin.poolPropertiesCsvData
  };
};

export default connect(
  mapStateToProps,
  { getPoolPeriod, getPoolProperties, getCsvPoolData, getHpiData }
)(withRouter(PoolPropertiesComponent));
