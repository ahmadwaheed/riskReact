import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPoolHistoryToExport } from '../actions/admin/mortgage_pool_container';
import NavigationBar from '../../src/home/NavigationTab';
import Loder from '../Loder/Loders';
let resultArayTwo = [];
let resultArayThree = [];
class PoolPerformance extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoader: false,
      netWeightData: [],
      period: [],
      propertyData: [],
      firtTable: [],
      cellData: [],
      subscriptionFee: ''
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));
    window.scrollTo(0, 0);
    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
      if (document.getElementById('mortgageListScroll')) {
        document.getElementById('mortgageListScroll').children[0].addEventListener('scroll', this.handleBodyClick);
      }

      let poolId = this.props.match.params.id;

      getPoolHistoryToExport(this.props.userData.token, poolId).then(res => {
        if (res && res.request && res && res.request.status === 401) {
          this.props.history.push('/login');

          this.setState({
            isLoader: true
          });
        } else if (res && res.propertyData && res.propertyData.length > 0) {
          this.prepareDataToExport(res);
          let TabeData = [];
          let netWeightDatas = [];

          res.netWeightData.forEach(e => {
            netWeightDatas.push({
              year: e.year,
              quarter: e.qtr,
              netWeight: e.netWeight
            });
          });

          netWeightDatas.forEach(ele => {
            let arry = [];

            res.propertyData.forEach((y, i) => {
              let val = y.hpiData.find(x => x.qtr == ele.quarter && x.year == ele.year);

              if (val) {
                arry.push(val.weight);
              } else {
                arry.push(0);
              }
            });
            ele['weightArray'] = arry;
          });

          res.period.forEach((x, i) => {
            var a = {};
            a.year = x.year;
            a.quarter = x.quarter;
            a.hpiData = [];
            a.basehpiData = [];

            res.propertyData.forEach(e => {
              a.basehpiData.push({
                local: e.basehpiData[i].local
              });
            });

            res.propertyData.forEach(e => {
              a.hpiData.push({
                postal: e.hpiData[i] ? e.hpiData[i].postalcode : null,
                swapbalance: e.hpiData[i] ? e.hpiData[i].swapbalance : null,
                feeIncome: e.hpiData[i] ? e.hpiData[i].feeIncome : null,
                sumOfFee: e.hpiData[i] ? e.hpiData[i].sumOfFee : null
              });
            });
            TabeData.push(a);
          });

          this.setState({
            netWeightData: netWeightDatas,
            period: res.period,
            propertyData: res.propertyData,
            isLoader: true,
            firtTable: TabeData,
            subscriptionFee: res.propertyData[0].pool_property.subscription_annual_basis_point_fee
          });
        } else {
          this.setState({
            isLoader: true
          });
        }
      });
    }
  };

  getFirtCsvData = (data, propertyData) => {
    const a = {};
    a['0'] = 'Period';
    const cols = propertyData.map((res, i) => this.renderHeaderForCsv(res, i));

    cols.forEach((col, i) => {
      a[i + 1] = col;
    });
    var colNames = Object.keys(a);
    colNames.shift();
    var resultaray = [];

    data.forEach(ele => {
      let newObj = {};
      newObj['0'] = ele.year + 'Q' + ele.quarter;

      colNames.forEach((c, ind) => {
        newObj[c] = ele.basehpiData[ind].local;
      });
      resultaray.push(newObj);
    });
    resultaray.unshift(a);
    resultaray.unshift({ '0': 'Hpi Values' });
    resultaray.push({});
    resultaray.push({});
    resultaray = resultaray.concat(resultArayTwo, resultArayThree);
    this.exportPoolHistory(resultaray);
  };

  getSecondCsvData = (data, propertyData) => {
    const a = {};
    a['0'] = 'Period';
    const cols = propertyData.map((res, i) => this.renderHeaderForCsv(res, i));
    const diverseValue = propertyData.map((res, i) => res.pool_property.diverse_notional_price);

    cols.forEach((col, i) => {
      a[i + 1] = col;
    });
    var colNames = Object.keys(a);
    colNames.shift();
    var resultaray = [];

    data.forEach(ele => {
      let newObj = {};
      newObj['0'] = ele.year + 'Q' + ele.quarter;

      colNames.forEach((c, ind) => {
        newObj[c] = Number(ele.weightArray[ind]).toFixed(2) + '%';
      });
      newObj.weight = Number(ele.netWeight).toFixed(2) + '%';
      resultaray.push(newObj);
    });

    a[0] = '';
    let aas = { '0': 'Value' };
    let pObj = { '0': 'Period' };

    diverseValue.forEach((ele, i) => {
      pObj[i + 1] = '';
      aas[i + 1] = 'US$ ' + ele;
    });
    pObj = Object.assign(pObj, { last: 'Weight Average' });
    resultaray.unshift(pObj);
    resultaray.unshift(aas);
    resultaray.unshift(a);
    resultaray.unshift({ '0': 'Weight Average' });
    resultaray.push({});
    resultaray.push({});
    resultArayTwo = resultaray;
  };

  getThirdCsvData = (data, propertyData) => {
    const a = {};
    a['0'] = 'Period';
    const cols = propertyData.map((res, i) => this.renderHeaderForCsv(res, i));

    cols.forEach((col, i) => {
      a[i + 1] = col;
    });
    var colNames = Object.keys(a);
    colNames.shift();
    var resultaray = [];
    let pObj = { '0': '' };
    let row3 = { '0': 'Period' };

    data.forEach((ele, index) => {
      let newObj = {};
      newObj['0'] = ele.year + 'Q' + ele.quarter;

      colNames.forEach((c, ind) => {
        newObj[c] = Number(ele.PropertyData[ind].swapbalance).toFixed(2);
        pObj[ind + 1] = '';
        row3[ind + 1] = '';
      });
      newObj['swapbalanceSum'] = Number(ele.swapbalanceSum).toFixed(2);
      newObj['feeIncome'] = Number(ele.feeIncome).toFixed(2);
      newObj['sumOfFee'] = Number(ele.sumOfFee).toFixed(2);
      newObj['SumOf'] = Number(ele.SumOf).toFixed(2);

      resultaray.push(newObj);
    });
    a[0] = '';
    row3 = Object.assign(row3, { last: 'Poolholders Equity', last1: 'Fee Income' });

    pObj = Object.assign(pObj, {
      last: '',
      last1: this.state.subscriptionFee + '%',
      last2: 'Sum of fees',
      last3: 'Current cash position'
    });
    resultaray.unshift(row3);
    resultaray.unshift(pObj);
    resultaray.unshift(a);
    resultaray.unshift({ '0': 'Swap Values' });
    resultaray.push({});
    resultaray.push({});
    resultArayThree = resultaray;
  };

  prepareDataToExport = data => {
    let DataTable = [];

    data.period.forEach(per => {
      var n = Object.assign({}, per);
      n.PropertyData = [];

      data.netWeightData.forEach(fee => {
        if (per.quarter == fee.qtr && per.year == fee.year) {
          n.sumOfFee = fee.sumOfFee;
          n.feeIncome = fee.feeIncome;
        }
      });

      data.propertyData.forEach(property => {
        var values = property.hpiData.find(x => x.year == n.year && x.qtr == n.quarter);

        if (values) {
          n.PropertyData.push({ swapbalance: values.swapbalance });
        } else {
          n.PropertyData.push({ swapbalance: 0 });
        }
      });
      n.swapbalanceSum = 0;

      n.PropertyData.forEach(x => {
        if (Number(x.swapbalance) !== isNaN) {
          n.swapbalanceSum = n.swapbalanceSum + Number(x.swapbalance);
        }
      });
      n.swapbalanceSum = Number(n.swapbalanceSum).toFixed(2);
      n.SumOf = Number(n.sumOfFee) + Number(n.swapbalanceSum);
      DataTable.push(n);
    });

    this.setState({
      cellData: DataTable,
      isLoading: true
    });
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageListScroll').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('mortgageList').style.transform = translate;
  };

  goBack = () => {
    this.props.history.goBack();
  };

  getFloatValue = n => {
    var negative = false;

    if (n < 0) {
      negative = true;
      n = n * -1;
    }

    var multiplicator = Math.pow(10, 2);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);
    }

    return n;
  };

  renderHeader = (data, index) => {
    let res;

    if (data.pool_property.postalcode.length > 3) {
      res = data.pool_property.postalcode.substring(0, 3);
    } else {
      res = data.pool_property.postalcode;
    }

    return (
      <th key={index + 'z'} className="text-center">
        {res}
      </th>
    );
  };

  renderHeaderForCsv = (data, index) => {
    let res;

    if (data.pool_property.postalcode.length > 3) {
      res = data.pool_property.postalcode.substring(0, 3);
    } else {
      res = data.pool_property.postalcode;
    }

    return res;
  };

  exportPoolHistory = data => {
    var items = data;
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    let csv = items.map(row =>
      Object.keys(row)
        .map(fieldName => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv = csv.join('\r\n');

    //Download the file as CSV
    var downloadLink = document.createElement('a');
    var blob = new Blob(['\ufeff', csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'DataDump.csv'; //Name the file here
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  downLoadCsv = () => {
    if (this.state.propertyData.length > 0) {
      this.getThirdCsvData(this.state.cellData, this.state.propertyData);
      this.getSecondCsvData(this.state.netWeightData, this.state.propertyData);
      this.getFirtCsvData(this.state.firtTable, this.state.propertyData);
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isPools={true} />
              </div>
              {!this.state.isLoader ? (
                <div>
                  <Loder myview={this.state.isLoader} />
                </div>
              ) : null}
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="container-fluid pad-up-down">
                  <div className="col-xs-6 text-left">
                    {this.state.propertyData.length > 0 ? (
                      <button onClick={() => this.downLoadCsv()} className="btn orange-bg btn-own">
                        Export Csv
                      </button>
                    ) : null}
                  </div>

                  <div className="col-xs-6 text-right">
                    <span onClick={this.goBack} className="back-arrow shadow-arrow" style={{ marginBottom: '0' }}>
                      <img src="img/back-arrow.png" alt="back-arrow" />
                    </span>
                  </div>
                </div>

                {this.state.propertyData.length > 0 && this.state.propertyData.length < 300 ? (
                  <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                    {this.state.propertyData.length > 0 ? (
                      <table className="table table-borderless">
                        <thead id="mortgageData" style={{}}>
                          <tr>
                            <th className="text-center">Period</th>
                            {this.state.propertyData.length > 0
                              ? this.state.propertyData.map((res, i) => this.renderHeader(res, i))
                              : null}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.firtTable &&
                            this.state.firtTable.length > 0 &&
                            this.state.firtTable.map((period, index) => (
                              <tr key={index + 'p'}>
                                <td className="text-center">{period.year + 'Q' + period.quarter}</td>
                                {period.basehpiData.map(
                                  (hpi, ind) =>
                                    hpi.local ? (
                                      <td key={ind + 'h'} className="text-center">
                                        {hpi.local}
                                      </td>
                                    ) : (
                                      <td key={ind + 'h'} className="text-center" />
                                    )
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : null}
                  </div>
                ) : this.state.propertyData.length > 0 ? (
                  <div className="text-center">Please download csv for view details</div>
                ) : (
                  <div className="text-center">No data available.</div>
                )}
              </div>

              {this.state.propertyData.length > 0 && this.state.propertyData.length < 300 ? (
                <div className="col-xs-12 pad-half white-bg curve-own pad-up-down" style={{ marginTop: '20px' }}>
                  <h1 className="text-center">Weight Average</h1>
                  <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                    <table className="table table-borderless">
                      <thead id="mortgageData" style={{}}>
                        <tr>
                          <th className="text-center" />
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map((data, index10) => this.renderHeader(data, index10))}
                          <th className="text-center" />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">Value</td>
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map(
                              (data, index2) =>
                                data.pool_property.diverse_notional_price ? (
                                  <td className="text-center" key={index2 + 'b'}>
                                    ${data.pool_property.diverse_notional_price}
                                  </td>
                                ) : (
                                  <td className="text-center" key={index2 + 'b'} style={{ padding: 0, width: 0 }} />
                                )
                            )}
                          <td />
                        </tr>
                        <tr>
                          <td className="text-center">Period</td>
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map((avg, index3) => (
                              <td className="text-center" key={index3 + 'c'} />
                            ))}
                          <td className="text-center">Weight Average</td>
                        </tr>
                        {this.state.netWeightData.length > 0 &&
                          this.state.netWeightData.map((period, index4) => (
                            <tr key={index4 + 'd'}>
                              <td className="text-center"> {period.year + 'Q' + period.quarter}</td>
                              {period.weightArray.map(
                                (weigh, index20) =>
                                  weigh ? (
                                    <td key={index20 + 'w'} className="text-center">
                                      {Number(weigh).toFixed(2)}%
                                    </td>
                                  ) : (
                                    <td key={index20 + 'w'} className="text-center" />
                                  )
                              )}
                              {period.netWeight ? (
                                <td className="text-center">{Number(period.netWeight).toFixed(2)}%</td>
                              ) : (
                                <td className="text-center" />
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              {this.state.propertyData.length > 0 && this.state.propertyData.length < 300 ? (
                <div className="col-xs-12 pad-half white-bg curve-own pad-up-down" style={{ marginTop: '20px' }}>
                  <h1 className="text-center">Swap Values</h1>
                  <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                    <table className="table table-borderless">
                      <thead id="mortgageData" style={{}}>
                        <tr>
                          <th />
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map((data, index1) => this.renderHeader(data, index1))}
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map((data, index8) => (
                              <td className="text-center" key={index8 + 'ai'} />
                            ))}
                          <td className="text-center" />
                          <td className="text-center" />
                          <td className="text-center">
                            {this.state.subscriptionFee ? this.state.subscriptionFee + '%' : null}
                          </td>
                          <td className="text-center"> Sum of fees </td>
                          <td className="text-center"> Current cash position </td>
                        </tr>
                        <tr>
                          <td className="text-center">Period</td>
                          {this.state.propertyData.length > 0 &&
                            this.state.propertyData.map((data, index9) => (
                              <td className="text-center" key={index9 + 's'} />
                            ))}
                          <td className="text-center">Poolholders Equity</td>
                          <td className="text-center"> Fee Income </td>
                        </tr>
                        {this.state.cellData.length > 0 &&
                          this.state.cellData.map((period, index5) => (
                            <tr key={index5 + 's'}>
                              {period.year ? (
                                <td className="text-center"> {period.year + 'Q' + period.quarter}</td>
                              ) : (
                                <td className="text-center"> </td>
                              )}
                              {period.PropertyData.map(
                                (res, index14) =>
                                  res.swapbalance ? (
                                    <td key={index14 + 's'} className="text-center">
                                      {' '}
                                      {Number(res.swapbalance).toFixed(2)}
                                    </td>
                                  ) : (
                                    <td key={index14 + 's'} className="text-center" />
                                  )
                              )}

                              {period.swapbalanceSum ? (
                                <td className="text-center"> {period.swapbalanceSum}</td>
                              ) : (
                                <td className="text-center" />
                              )}
                              {period.feeIncome ? (
                                <td className="text-center"> {Number(period.feeIncome).toFixed(2)}</td>
                              ) : (
                                <td className="text-center" />
                              )}
                              {period.sumOfFee ? (
                                <td className="text-center"> {Number(period.sumOfFee).toFixed(2)}</td>
                              ) : (
                                <td className="text-center" />
                              )}
                              {period.SumOf ? (
                                <td className="text-center"> {Number(period.SumOf).toFixed(2)}</td>
                              ) : (
                                <td className="text-center" />
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

PoolPerformance.defaultProps = {
  portfolioPerformance: [],
  getPortfolioPerformance: undefined,
  userData: {},
  swapToPortfolioIndex: {},
  getSwapToPortfolioIndex: undefined,
  swapValues: [],
  getSwapValue: undefined,
  portfolioPerformanceData: [],
  valueArray: [],
  avgArray: []
};

PoolPerformance.propTypes = {
  portfolioPerformance: PropTypes.arrayOf(Object),
  getPortfolioPerformance: PropTypes.func,
  getSwapToPortfolioIndex: PropTypes.func,
  userData: PropTypes.objectOf(String),
  swapToPortfolioIndex: PropTypes.objectOf(Array),
  swapValues: PropTypes.arrayOf(Object),
  getSwapValue: PropTypes.func,
  portfolioPerformanceData: PropTypes.arrayOf(Object),
  valueArray: PropTypes.arrayOf(Object),
  avgArray: PropTypes.arrayOf(Object)
};

const mapStateToProps = state => {
  return {
    portfolioPerformance: state.admin.portfolioPerformance,
    userData: state.login.userData,
    swapToPortfolioIndex: state.admin.swapToPortfolioIndex,
    swapValues: state.admin.swapValues,
    portfolioPerformanceData: state.admin.portfolioPerformanceData,
    valueArray: state.admin.valueArray,
    avgArray: state.admin.avgArray
  };
};

export default connect(
  mapStateToProps,
  { getPoolHistoryToExport }
)(withRouter(PoolPerformance));
