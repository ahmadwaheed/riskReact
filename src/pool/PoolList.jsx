import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  getLogsData,
  getPoolHistoryToExport,
  noPoolHistoryExportError
} from '../actions/admin/mortgage_pool_container';
import { addProperty } from '../actions/borrower/borrower-action';
import { CSVLink } from 'react-csv';
import { createRef } from 'create-react-ref';
import Loder from '../Loder/Loders';
class PoolList extends React.Component {
  constructor(props) {
    super(props);
    this.csvLink = createRef();

    this.state = {
      isLoader: false,
      poolList: [],
      header: [],
      cellData: [],
      isLoading: true
    };
  }

  componentDidMount = () => {
    const data = JSON.parse(sessionStorage.getItem('user'));

    if (data === undefined || data === null) {
      this.props.history.push('/');
    } else {
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

  viewPoolProperties = pool => {
    this.props.viewPoolProperties(pool);
  };

  addMortgageInPool = pool => {
    this.props.addMortgageInPool(pool);
  };

  viewPoolDetail = pool => {
    this.props.viewPoolDetail(pool);
  };

  editPoolData = pool => {
    this.props.editPoolData(pool);
  };

  openFeeModal = pool => {
    this.props.openFeeModal(pool);
  };

  openDeletePoolModal = pool => {
    this.props.openDeletePoolModal(pool);
  };

  openEditPoolModal = pool => {
    this.props.openEditPoolModal(pool);
  };

  openReport = pool => {
    this.props.openReport(pool);
  };

  exportPoolHistory = pool => {
    this.props.exportPoolHistory(pool);
  };

  exportPoolHistory = pool => {
    this.setState({
      isLoading: false
    });

    getPoolHistoryToExport(this.props.userData.token, pool.poolid).then(res => {
      if (res && res.request && res && res.request.status === 401) {
        this.props.history.push('/login');

        this.setState({
          isLoading: true
        });
      } else if (res && res.propertyData.length > 0) {
        this.prepareDataToExport(res);
      } else if (res.propertyData.length === 0) {
        this.setState({
          isLoading: true
        });
        noPoolHistoryExportError();
      }
    });
  };

  prepareDataToExport = data => {
    let periods = data.period;
    let propertyDatas = data.propertyData;
    let csvData = [];
    let csvHeader = [{ label: 'Period', key: 'cell.period' }];

    propertyDatas.forEach((element, index) => {
      let poolProp = element.pool_property.mortgage_id;
      csvHeader.push({ label: poolProp, key: 'cell.PId-' + poolProp });
    });

    csvHeader.push({ label: 'PoolholderEquity', key: 'cell.poolHolderEquity' });
    csvHeader.push({ label: 'FeeIncome', key: 'cell.feeIncome' });
    csvHeader.push({ label: 'Sum of fees', key: 'cell.sumOfFees' });
    csvHeader.push({ label: 'Current Cash Position', key: 'cell.cashPosition' });

    periods.forEach(period => {
      let cell = {
        period: period.quarter + '/' + period.year
      };
      let PoolEquity = 0;

      propertyDatas.forEach((propertyData, propertyIndex) => {
        for (let i = 0; i < propertyData.hpiData.length; i++) {
          if (period.quarter === propertyData.hpiData[i].qtr && period.year === propertyData.hpiData[i].year) {
            cell['PId-' + propertyData.pool_property.mortgage_id] = Number(propertyData.hpiData[i].swapbalance).toFixed(
              2
            );
            break;
          } else {
            cell['PId-' + propertyData.pool_property.mortgage_id] = '';
          }
        }
      });

      propertyDatas.forEach((propData, propertyIndex) => {
        for (let i = 0; i < propData.hpiData.length; i++) {
          if (period.quarter === propData.hpiData[i].qtr && period.year === propData.hpiData[i].year) {
            PoolEquity = Number(propData.hpiData[i].swapbalance) + PoolEquity;
            cell['poolHolderEquity'] = PoolEquity.toFixed(2);
            cell['feeIncome'] = 'US$ ' + propData.hpiData[i].feeIncome;
            cell['sumOfFees'] = propData.hpiData[i].sumOfFee;
            cell['cashPosition'] = (Number(propData.hpiData[i].sumOfFee) + PoolEquity).toFixed(2);
          }
        }
      });

      csvData.push(cell);
    });

    this.setState({
      header: csvHeader,
      cellData: csvData,
      isLoading: true
    });
    console.log('csvdata', csvData);

    this.setState({ csvData, csvHeader }, () => {
      this.csvLink.current.link.click();
    });
  };

  gotPoolPerformance = pool => {
    this.props.history.push('/pool-performance/' + pool.poolid);
  };

  render() {
    return (
      <div className="col-xs-12 table-responsive">
        {!this.state.isLoading ? (
          <div className="fullscreen-loader">
            <Loder myview={this.state.isLoading} />
          </div>
        ) : null}
        <table className="table table-borderless">
          <thead id="mortgageData" style={{}}>
            <tr>
              <th>S.No</th>
              <th>Pool Name</th>
              <th className="text-center">Created</th>
              {/* <th className="text-right">1st Mtg Bal</th> */}
              <th className="text-justify">Description</th>
              <th className="text-center">Monthly flat subscription fee</th>
              <th className="text-center">Basis points fee</th>
              <th className="text-right">Total No. Properties</th>
              <th style={{ minWidth: '350px' }} />
            </tr>
          </thead>
          <tbody>
            {this.props.poolList.length > 0 &&
              this.props.poolList.map((pool, index) => (
                <tr className={this.props.isClass ? 'bg-danger' : null} key={index + 'poolid'}>
                  <td>{index + 1}</td>
                  <td>{pool.pool_name}</td>
                  <td className="text-center">
                    {pool.created_date ? moment(pool.created_date).format('MM/DD/YYYY') : pool.created_date}
                  </td>
                  {/* <td className="text-right">{pool.balance}</td> */}
                  <td className="text-justify" style={{ maxWidth: '350px' }}>
                    {pool.pool_description}
                  </td>
                  <td className="text-center">{pool.subscription_monthly_fee}</td>
                  <td className="text-center">{pool.subscription_annual_basis_point_fee}</td>
                  <td className="text-right">{pool.pool_count}</td>
                  <td className="text-right">
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="View Properties"
                        className="btn-controls"
                        onClick={() => this.viewPoolProperties(pool)}
                      >
                        <i className="fa fa fa-file-text" aria-hidden="true" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Add Property"
                        className="btn-controls"
                        onClick={() => this.addMortgageInPool(pool)}
                      >
                        <i className="fa fa-plus" aria-hidden="true" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="View Detail"
                        className="btn-controls"
                        onClick={() => this.viewPoolDetail(pool)}
                      >
                        <i className="fa fa-eye" aria-hidden="true" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Remove Property"
                        className="btn-controls"
                        onClick={() => this.editPoolData(pool)}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Update Fee"
                        className="btn-controls"
                        onClick={() => this.openFeeModal(pool)}
                      >
                        <i className="fa fa-pencil" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                      type="button"
                      title={this.props.checked ? 'UnArchive' : 'Archive'}
                      className="btn-controls"
                      onClick={() => this.openDeletePoolModal(pool)}
                    >
                      <i className="fa fa-times" aria-hidden="true" />
                    </button>
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Edit Pool"
                        className="btn-controls"
                        onClick={() => this.openEditPoolModal(pool)}
                      >
                        <i className="fa fa-edit" aria-hidden="true" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Report"
                        className="btn-controls"
                        onClick={() => this.openReport(pool)}
                      >
                        <i className="fa fa-file" aria-hidden="true" />
                      </button>
                    )}
                    {this.props.checked ? null : (
                      <button
                        style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                        type="button"
                        title="Pool Performance"
                        className="btn-controls"
                        onClick={() => this.gotPoolPerformance(pool)}
                      >
                        <i className="fa fa-arrow-right" aria-hidden="true" />
                      </button>
                    )}
                    {/* {this.props.checked ? null : (
                      <span>
                        <button
                          style={this.props.isClass ? { backgroundColor: '#78094e' } : { backgroundColor: '#ff8505' }}
                          type="button"
                          title="Export Pool History"
                          className="btn-controls"
                          onClick={() => this.exportPoolHistory(pool)}
                        >
                          <i className="fa fa-arrow-down" aria-hidden="true" />
                        </button>
                        <CSVLink
                          data={this.state.cellData}
                          header={this.state.header}
                          filename="data.csv"
                          className="hide "
                          ref={this.csvLink}
                          target="_blank"
                        >
                          <i className="fa fa-arrow-down" aria-hidden="true" />
                        </CSVLink>
                      </span>
                    )} */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

PoolList.defaultProps = {
  getLogsData: undefined,
  userData: {},
  addProperty: undefined
};

PoolList.propTypes = {
  getLogsData: PropTypes.func,
  userData: PropTypes.objectOf(String),
  addProperty: PropTypes.func
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  { getLogsData, addProperty }
)(withRouter(PoolList));
