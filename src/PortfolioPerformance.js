import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPortfolioPerformance, getSwapToPortfolioIndex, getSwapValue } from './actions/admin/admin-action';
import NavigationBar from '../src/home/NavigationTab';
import Loder from './Loder/Loders';

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
class PortfolioPerformance extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoader: false
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

      getPortfolioPerformance(this.props.userData.token).then(res => {
        getSwapToPortfolioIndex(this.props.userData.token).then(index => {
          if (res && res.request && res && res.request.status === 401) {
            this.props.history.push('/login');
          } else if (res) {
          }

          if (index.request && index.request.status === 401) {
            this.props.history.push('/login');
          } else if (index) {
          }

          this.setState({
            isLoader: true
          });
        });
      });
    }
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

  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                <NavigationBar isPortfolio={true} />
              </div>
              {!this.state.isLoader ? (
                <div>
                  <Loder myview={this.state.isLoader} />
                </div>
              ) : null}
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down">
                <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                  <table className="table table-borderless">
                    <thead id="mortgageData" style={{}}>
                      <tr>
                        <th className="text-center">Period</th>
                        <th className="text-right">Atlanta</th>
                        <th className="text-right">Boston</th>
                        <th className="text-right">Charlotte</th>
                        <th className="text-right">Chicago</th>
                        <th className="text-right">Cleveland</th>
                        <th className="text-right">Dallas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.portfolioPerformanceData &&
                        this.props.portfolioPerformanceData.length > 0 &&
                        this.props.portfolioPerformanceData.map((data, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {data.period ? moment(data.period).format('MM/DD/YYYY') : data.period}
                            </td>
                            <td className="text-right">{data.atlanta}</td>
                            <td className="text-right">{data.boston}</td>
                            <td className="text-right">{data.charlotte}</td>
                            <td className="text-right">{data.chicago}</td>
                            <td className="text-right">{data.cleveland}</td>
                            <td className="text-right"> {data.dallas}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down" style={{ marginTop: '20px' }}>
                <h1 className="text-center">Swap to Portfolio Index Calculation Model</h1>
                <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                  <table className="table table-borderless">
                    <thead id="mortgageData" style={{}}>
                      <tr>
                        <th />
                        {this.props.valueArray !== undefined &&
                          this.props.valueArray.map(
                            (data, index1) =>
                              data.value !== 0 ? (
                                <th key={index1 + 'a'}>{data.metro}</th>
                              ) : (
                                <th key={index1 + 'a'} style={{ padding: 0, width: 0 }} />
                              )
                          )}
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Value</td>
                        {this.props.valueArray !== undefined &&
                          this.props.valueArray.map(
                            (data, index2) =>
                              data.value !== 0 ? (
                                <td key={index2 + 'b'}>${data.value}</td>
                              ) : (
                                <td key={index2 + 'b'} style={{ padding: 0, width: 0 }} />
                              )
                          )}
                        <td />
                      </tr>
                      <tr>
                        {this.props.avgArray !== undefined &&
                          this.props.avgArray.map(
                            (avg, index3) =>
                              index3 === 0 ? (
                                <td key={index3 + 'c'}>Period</td>
                              ) : index3 === this.props.avgArray.length - 2 ? (
                                <td key={index3 + 'c'}>Weight Average</td>
                              ) : (
                                <td key={index3 + 'c'} />
                              )
                          )}
                      </tr>
                      {this.props.avgArray !== undefined &&
                        this.props.avgArray.map((avg, index4) => (
                          <tr key={index4 + 'd'}>
                            <td> {avg.year ? moment(avg.year).format('MM/DD/YYYY') : avg.year}</td>
                            {avg.metro_one_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_one_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_two_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_two_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_three_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_three_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_four_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_four_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_five_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_five_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_six_housing_one_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_six_house_one))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_one_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_one_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_two_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_two_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_three_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_three_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_four_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_four_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_five_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_five_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.metro_six_housing_two_exists !== '0' ? (
                              <td>{this.getFloatValue(Number(avg.metro_six_house_two))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.weight_average !== '0' && avg.weight_average !== null ? (
                              <td>{this.getFloatValue(Number(avg.weight_average))}%</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-xs-12 pad-half white-bg curve-own pad-up-down" style={{ marginTop: '20px' }}>
                <h1 className="text-center">Swap Values</h1>
                <div className="col-xs-12 table-responsive" style={{ maxHeight: '60vh' }}>
                  <table className="table table-borderless">
                    <thead id="mortgageData" style={{}}>
                      <tr>
                        <th />
                        {this.props.valueArray !== undefined &&
                          this.props.valueArray.map(
                            (data, index1) =>
                              data.value !== 0 ? (
                                <th key={index1 + 'a'}>{data.metro}</th>
                              ) : (
                                <th key={index1 + 'a'} style={{ padding: 0, width: 0 }} />
                              )
                          )}
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {arr.map(
                          index3 =>
                            index3 === 15 ? (
                              <td key={index3 + 'a'}>0.06%</td>
                            ) : index3 === 16 ? (
                              <td key={index3 + 'a'}> Sum of fees </td>
                            ) : index3 === 17 ? (
                              <td key={index3 + 'a'}> Current cash position </td>
                            ) : (
                              <td key={index3 + 'a'} />
                            )
                        )}
                      </tr>
                      <tr>
                        {arr.map(
                          index3 =>
                            index3 === 1 ? (
                              <td key={index3 + 'c'}>Period</td>
                            ) : index3 === 14 ? (
                              <td key={index3 + 'c'}>Poolholders Equity</td>
                            ) : index3 === 15 ? (
                              <td key={index3 + 'c'}> Fee Income </td>
                            ) : (
                              <td key={index3 + 'c'} />
                            )
                        )}
                      </tr>
                      {this.props.avgArray !== undefined &&
                        this.props.avgArray.map((avg, index4) => (
                          <tr key={index4 + 'd'}>
                            <td> {avg.year ? moment(avg.year).format('MM/DD/YYYY') : avg.year}</td>
                            {avg.swapvalue_metro1_house1 !== 0 && avg.swapvalue_metro1_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro1_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro2_house1 !== 0 && avg.swapvalue_metro2_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro2_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro3_house1 !== 0 && avg.swapvalue_metro3_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro3_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro4_house1 !== 0 && avg.swapvalue_metro4_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro4_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro5_house1 !== 0 && avg.swapvalue_metro5_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro5_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro6_house1 !== 0 && avg.swapvalue_metro6_house1 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro6_house1)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro1_house2 !== 0 && avg.swapvalue_metro1_house2 !== undefined ? (
                              <td>{avg.swapvalue_metro1_house2}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro2_house2 !== 0 && avg.swapvalue_metro2_house2 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro2_house2)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro3_house2 !== 0 && avg.swapvalue_metro3_house2 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro3_house2)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro4_house2 !== 0 && avg.swapvalue_metro4_house2 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro4_house2)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro5_house2 !== 0 && avg.swapvalue_metro5_house2 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro5_house2)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.swapvalue_metro6_house2 !== 0 && avg.swapvalue_metro6_house2 !== undefined ? (
                              <td>{this.getFloatValue(avg.swapvalue_metro6_house2)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.net_swap_balance !== 0 && avg.net_swap_balance !== undefined ? (
                              <td>{Number(avg.net_swap_balance).toFixed(2)}</td>
                            ) : (
                              <td style={{ paddingLeft: 10, width: 0 }} />
                            )}
                            {avg.feeIncome !== 0 && avg.feeIncome !== undefined ? (
                              <td>US$ {this.getFloatValue(avg.feeIncome)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.sumOfFee !== 0 && avg.sumOfFee !== undefined ? (
                              <td>{this.getFloatValue(avg.sumOfFee)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                            {avg.current_cash_position !== 0 && avg.current_cash_position !== undefined ? (
                              <td>{this.getFloatValue(avg.current_cash_position)}</td>
                            ) : (
                              <td style={{ padding: 0, width: 0 }} />
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PortfolioPerformance.defaultProps = {
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

PortfolioPerformance.propTypes = {
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
  { getPortfolioPerformance, getSwapToPortfolioIndex, getSwapValue }
)(withRouter(PortfolioPerformance));
