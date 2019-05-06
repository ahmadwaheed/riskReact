import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as myapi from '../../ConfigUri'; // we imported the ConfigUri file for getting all url'../../ConfigUri'
import IspaymentAdvanse from './ispaymentAdvanse';
import { Scrollbars } from 'react-custom-scrollbars';
import { handleAdvanceSearchData, handleViewPayment, handleClosePayment } from '../../actions/map/MapAction';
import { error } from '../../actions/login/loginAction';
class Displaylllist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentData: props.payment,
      payment: props.payment,
      ispaymentAdvanse: false,
      language: '',
      currentpage: 1,
      limit: 10,
      offset: 0,
      next: props.next,
      prev: props.prev,
      totalValues: props.totalValues,
      totalPages: props.totalPages
    };
  }

  componentDidMount = () => {
    if (document.getElementById('borrowerTable')) {
      document.getElementById('borrowerTable').children[0].addEventListener('scroll', this.handleBodyClick);
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('borrowerTable').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('borrowerList').style.transform = translate;
  };
  //XXXXXXXXXXXXXXXX various Function XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  next(pageno, pageSize) {
    var data = {
      limit: this.props.limit,
      offset: (pageno - 1) * pageSize
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
          this.setState({
            currentpage: pageno
          });
          this.props.handleAdvanceSearchData(findresponse);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  }

  displayNext() {
    // if (this.props.next)
    //   return (
    //     <div className="flex-center">
    //       <div className="total-value" />
    //       <div>
    //         Pages :{this.state.currentpage}/{this.props.totalPages}
    //       </div>

    //       <ul className="pagination-own list-inline">
    //         <li>
    //           <i
    //             className="fa fa-angle-double-left disabled"
    //             onClick={() => this.next(this.state.currentpage - 1, this.state.limit)}
    //           />
    //         </li>
    //         <li>
    //           <i
    //             className="fa fa-angle-double-right"
    //             onClick={() => this.next(this.state.currentpage + 1, this.state.limit)}
    //           />
    //         </li>
    //       </ul>
    //     </div>
    //   );
    // else if (!this.props.next)
    //   return (
    //     <div className="flex-center">
    //       <div className="total-value" />
    //       <div>
    //         Pages :{this.state.currentpage}/{this.props.totalPages}
    //       </div>
    //       <ul className="pagination-own list-inline">
    //         <li>
    //           <i
    //             className="fa fa-angle-double-left disabled"
    //             onClick={() => this.next(this.state.currentPage - 1, this.state.limit)}
    //           />
    //         </li>
    //         <li>
    //           <i
    //             className="fa fa-angle-double-right"
    //             onClick={() => this.next(this.state.currentPage + 1, this.state.limit)}
    //           />
    //         </li>
    //       </ul>
    //     </div>
    //   );
    return (
      <div className="flex-center">
        <div className="total-value" />
        <div>
          Pages :{this.state.currentpage}/{this.props.totalPages}
        </div>

        <ul className="pagination-own list-inline">
          <li>
            {this.props.prev ? (
              <i
                className="fa fa-angle-double-left"
                onClick={() => this.next(this.state.currentpage - 1, this.state.limit)}
              />
            ) : (
              <i
                className="fa fa-angle-double-left "
                disabled
                onClick={() => this.next(this.state.currentpage - 1, this.state.limit)}
              />
            )}
          </li>
          <li>
            {this.props.next ? (
              <i
                className="fa fa-angle-double-right"
                onClick={() => this.next(this.state.currentpage + 1, this.state.limit)}
              />
            ) : (
              <i
                className="fa fa-angle-double-right"
                disabled
                onClick={() => this.next(this.state.currentpage + 1, this.state.limit)}
              />
            )}
          </li>
        </ul>
      </div>
    );
  }

  viewPaymentAdvanceSearch = data => {
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
          this.props.handleViewPayment(findresponse, paymentlist, true);
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  handleLanguage = langValue => {
    this.setState({ ispaymentAdvanse: langValue });
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  render() {
    const { thead } = styles;

    if (!this.props.ispaymentAdvanse) {
      return (
        <div>
          {/*//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/}

          <div className="col-xs-12 white-bg curve-own pad-up-down margin-top-large advance-search-table-wrapper">
            <div className="col-xs-12 nopad table-responsive white-bg details-table ">
              <Scrollbars className="scrollStyle" id="borrowerTable" style={{ maxHeight: '80vh' }}>
                <table className="table">
                  <thead id="borrowerList" style={{ ...thead }}>
                    <tr>
                      <th>Borrower Name</th>
                      <th className="text-right">Account Number</th>
                      <th className="text-right">Address</th>
                      <th className="text-right">City</th>
                      <th className="text-right">State</th>
                      <th className="text-right">Fico Score</th>
                      <th className="text-right">GSE Loan</th>
                      <th className="text-right">Loan Type</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.addressList.map((info, index) => (
                      <tr key={index}>
                        <td>{info.borrower_name}</td>
                        <td className="text-right">{info.propertyid}</td>
                        <td className="text-right">{info.address1}</td>
                        <td className="text-right">{info.city}</td>
                        <td className="text-right">{info.state}</td>
                        <td className="text-right">{info.fico_score}</td>
                        <td className="text-right">
                          $
                          {Number(info.gse_loan).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className="text-right">{info.loan_type}</td>
                        <td className="text-right">
                          <button className="btn btn-orange" onClick={() => this.viewPaymentAdvanceSearch(info)}>
                            View Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scrollbars>
            </div>
          </div>
          <div className="col-xs-12 flex-center pad-up-down csv-info">
            <CSVLink data={this.props.addressList} className="btn btn-orange">
              {' '}
              Export CSV
            </CSVLink>
            {this.props.next || this.props.prev ? <div>{this.displayNext()} </div> : null}
          </div>
        </div>
      );
    } else if (this.props.ispaymentAdvanse) {
      return (
        <div>
          <IspaymentAdvanse
            onSelectLanguage={this.handleLanguage}
            userData={this.props.userData}
            addressList={this.props.addressList}
            paymentData={this.props.payment}
            payment={this.props.payment}
            ispaymentAdvanse={this.props.ispaymentAdvanse}
            handleClosePayment={this.props.handleClosePayment}
          />
        </div>
      );
    }
  }
}

const styles = {
  thead: {
    backgroundColor: '#fff',
    boxShadow: '1px 0 0 1px #ddd'
  }
};

Displaylllist.defaultProps = {
  isLogin: false,
  userData: {}
};

Displaylllist.propTypes = {
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
    ispaymentAdvanse: state.map.ispaymentAdvanse,
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
    offset: state.map.offset,
    detailedData: state.map.detailedData,
    paymentData: state.map.payment,
    payment: state.map.payment
  };
};

const mapDispatcherToProps = dispatch => {
  return {
    handleAdvanceSearchData: (data, addressList) => dispatch(handleAdvanceSearchData(data, addressList)),
    handleViewPayment: (findresponse, paymentlist, ispaymentAdvanse) =>
      dispatch(handleViewPayment(findresponse, paymentlist, ispaymentAdvanse)),
    handleClosePayment: () => dispatch(handleClosePayment()),
    error: data => dispatch(error(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(Displaylllist);
