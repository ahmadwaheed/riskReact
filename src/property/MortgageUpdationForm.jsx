import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPoolHistoryData, saveSelectedMortgageData } from '../actions/admin/admin-action';
import { Scrollbars } from 'react-custom-scrollbars';
import NavigationTab from '../home/NavigationTab';
import MessageNotification from '../MessageNotification';
import PropertyAssociatedHomeowner from './PropertyAssociatedHomeowner';
import PropertyPoolHistory from './PropertyPoolHistory';
import PropertyUpdate from './PropertyUpdate';
import {
  updateMortgagePaymentData,
  deleteSelectedMortgagePaymentData,
  add_adjust_payment,
  updateMortgageList,
  getMortgageListWithPayments,
  get_adjust_payment,
  checkProperty
} from '../ConfigUri';
import { error, success } from '../actions/login/loginAction';
let hashCode = '';

class MortgageUpdationFormComponent extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      mortgagePayment: [],
      editMortgageIndex: undefined,
      isPaymentEdit: false,
      isAddPayment: false,
      addedMortgageIndex: undefined,
      leftCurrentBalance: [],
      isEdit: false,
      adjustPaymentBalance: [],
      amortizationsArray: [],
      poolHistoryStateData: [],
      companyList: [],
      associateList: [],
      isLoading: false
    };
    this.updatedMortgageData = {};
  }

  componentDidMount = () => {
    const dataHeader = JSON.parse(sessionStorage.getItem('user'));

    if (dataHeader === undefined || dataHeader === null) {
      this.props.history.push('/');
    } else {
      this.setState({
        userData: dataHeader
      });
      let id = this.props.match.params.id;
      let hashcode = this.props.match.params.hashcode;
      hashCode = hashcode;
      this.updateMortgage();
      if (id !== '') {
        this.setState({
          isLoading: false
        });
        if (id && id !== 'undefined') {
          getPoolHistoryData(this.props.userData.token, id).then(res => {
            if (res && res.request && res && res.request.status === 401) {
              this.props.history.push('/login');
            } else if (res) {
              this.setState({
                isLoading: true,
                poolHistoryStateData: res
              });
            } else {
              this.setState({
                isLoading: true
              });
            }
          });
        }

        this.setState({
          isLoading: false
        });
      }

      if (document.getElementById('mortgageDataElement')) {
        document.getElementById('mortgageDataElement').children[0].addEventListener('scroll', this.handleBodyClick);
      }
    }
  };

  componentWillUnmount = () => {
    document.body.removeEventListener('scroll', this.handleBodyClick);
  };

  handleBodyClick = () => {
    let scrollEle = document.getElementById('mortgageDataElement').children[0];

    var translate = 'translate(0,' + scrollEle.scrollTop + 'px)';
    document.getElementById('mortgageData').style.transform = translate;
  };

  updateMortgage = () => {
    let id = this.props.match.params.id;
    let poolId = this.props.match.params.poolId;

    if (id !== '') {
      const url = getMortgageListWithPayments + id;

      fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          auth_token: this.props.userData.token
        })
      })
        .then(Response => Response.json())
        .then(response => {
          const mortgage = response.mortgage;
          const paymentsData = response.history;
          this.props.saveSelectedMortgageData(mortgage, paymentsData, poolId);

          const balance = Number(mortgage.first_mortgage_loan_amount);
          const interest = Number(mortgage.loan_intrest_rate);
          const term = Number(mortgage.loan_term);
          let firstPaymentDate = mortgage.monthly_payment_date;
          firstPaymentDate = new Date(firstPaymentDate);
          firstPaymentDate.setDate(1);
          firstPaymentDate = new Date(firstPaymentDate);
          let getAmortArray = [];

          if (balance > 0) {
            getAmortArray = this.amortCalculation(balance, interest, term, firstPaymentDate);
            // const monthlyPayment = Number(getAmortArray[0].interest + getAmortArray[0].principal);
          }

          const data = JSON.parse(sessionStorage.getItem('user'));

          this.setState(
            {
              mortgageData: mortgage,
              mortgagePayment: paymentsData,
              userData: data,
              amortizationsArray: getAmortArray,
              isLoading: true
            },
            paymentsData.length > 0
              ? () => this.calculateCuurentBalance(balance, interest, term, getAmortArray, paymentsData)
              : null
          );
          this.getAdjustPaymentData(data);
        })
        .catch(err => {
          error(err.message);
          if (err.request && err.request.status === 401) {
            this.props.history.push('/login');
          }
        });
    } else {
      this.props.history.goBack();
    }
  };

  getAdjustPaymentData = data => {
    let id = this.props.match.params.id;

    fetch(get_adjust_payment + id, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: data.token
      })
    })
      .then(Response => Response.json())
      .then(findresponse => {
        if (findresponse.length > 0) {
          this.setState({
            adjustPaymentBalance: findresponse,
            newAdjustPaymentRowIndex: undefined
          });
        } else {
          this.setState({ importStatus: 'Imported Successfully' });
        }
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  amortCalculation = (balance, interestRate, terms, firstPaymentDate) => {
    interestRate = interestRate / 100.0;
    var amortizationsData = [];

    var monthlyRate = interestRate / 12;

    var payment = balance * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -terms)));

    for (var count = 0; count < terms; ++count) {
      var amortization = {
        date: undefined,
        month: undefined,
        balance: undefined,
        interest: undefined,
        principal: undefined
      };

      var interest = 0;
      var monthlyPrincipal = 0;
      var month = count + 1;
      interest = balance * monthlyRate;
      monthlyPrincipal = payment - interest;
      if (count === 0) {
        // balance = balance;
      } else {
        balance = balance - monthlyPrincipal;
      }

      if (count > 1) {
        firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
      }

      firstPaymentDate = new Date(firstPaymentDate);
      amortization.month = month;
      amortization.balance = balance;
      amortization.interest = interest;
      amortization.principal = monthlyPrincipal;
      amortization.date = firstPaymentDate;
      amortization.amount = Number(interest + monthlyPrincipal);
      amortizationsData.push(amortization);
    }

    const lastdate = amortizationsData[amortizationsData.length - 1].date;
    lastdate.setMonth(lastdate.getMonth() + 1);
    amortizationsData[amortizationsData.length - 1].date = new Date(lastdate);
    return amortizationsData;
  };

  renderSwapChange = (selectedMortgagePaymentsData, leftCurrentBalance) => {
    var swapArry = [
      { id: 1, value: 100 },
      { id: 2, value: 110 },
      { id: 3, value: 105 },
      { id: 4, value: 103 },
      { id: 5, value: -100 },
      { id: 6, value: 133 },
      { id: 7, value: -110 },
      { id: 8, value: 200 },
      { id: 9, value: -150 },
      { id: 10, value: 100 },
      { id: 11, value: 150 },
      { id: 12, value: 105 },
      { id: 13, value: 104 },
      { id: 14, value: -100 },
      { id: 15, value: 110 },
      { id: 16, value: -190 },
      { id: 17, value: 100 },
      { id: 18, value: 105 },
      { id: 19, value: 133 },
      { id: 20, value: 166 },
      { id: 21, value: -177 },
      { id: 22, value: 188 },
      { id: 23, value: -201 },
      { id: 24, value: -300 },
      { id: 25, value: 0 },
      { id: 26, value: 100 },
      { id: 27, value: 120 },
      { id: 28, value: 100 },
      { id: 29, value: 190 },
      { id: 30, value: -100 }
    ];

    if (swapArry.length > 0) {
      this.renderSwapBalance(selectedMortgagePaymentsData, swapArry, leftCurrentBalance);
    }

    this.setState({
      swapChange: swapArry
    });
  };

  renderSwapBalance = (selectedMortgagePaymentsData, swapArry, leftCurrentBalance) => {
    var newCount = 0;
    var swapBalance = [];
    var totalSum = 0;

    while (newCount < selectedMortgagePaymentsData.length + 1) {
      var res = swapArry[newCount];
      totalSum = totalSum + res.value;

      swapBalance.push({
        id: res.id,
        value: totalSum
      });
      newCount = newCount + 1;
    }

    this.renderCombineBalance(selectedMortgagePaymentsData, swapBalance, leftCurrentBalance);

    this.setState({
      swapBalance: swapBalance
    });
  };

  renderCombineBalance = (selectedMortgagePaymentsData, swapBalance, leftCurrentBalance) => {
    var newCount = 0;
    var combineBalance = [];
    var totalSum = 0;

    while (newCount < selectedMortgagePaymentsData.length + 1) {
      var swap = swapBalance[newCount];
      var current = leftCurrentBalance[newCount];
      totalSum = Number(Number(swap.value) + Number(current));

      combineBalance.push({
        value: totalSum
      });
      newCount = newCount + 1;
    }

    this.setState({
      combineBalance: combineBalance
    });
  };

  calculateCuurentBalance = (balance, interest, term, monthlyPayment, selectedMortgagePaymentsData, change) => {
    let leftBalance = [];
    var VnewIntPort = 0;
    var VnewPrinPort = 0;
    var VnewPrin = balance;
    var VnewInt = interest / 1200;
    var VpmtFormField = 0;

    var newCount = 0;

    if (this.state.amortizationsArray.length > 0) {
      if (change === 'change') {
        while (newCount < selectedMortgagePaymentsData.length) {
          if (newCount < selectedMortgagePaymentsData.length) {
            VpmtFormField =
              selectedMortgagePaymentsData.length > 0
                ? Number(selectedMortgagePaymentsData[Number(newCount)].fees)
                : Number(this.state.amortizationsArray[newCount].interest) +
                  Number(this.state.amortizationsArray[newCount].principal);
          } else {
            VpmtFormField =
              Number(this.state.amortizationsArray[newCount].interest) +
              Number(this.state.amortizationsArray[newCount].principal);
          }

          let date = monthlyPayment[newCount].date;
          let month = date.getMonth();
          let year = date.getUTCFullYear();
          let firstDate = new Date(year, month, 1);
          let lastDate = new Date(year, month + 1, 0);
          let paidAmount = 0;

          this.state.adjustPaymentBalance
            .filter(x => new Date(x.date) >= firstDate && new Date(x.date) <= lastDate)
            .forEach(ele => {
              paidAmount = paidAmount + Number(ele.adjust_balance);
            });

          VnewIntPort = VnewPrin * VnewInt;
          VnewPrinPort = Number(VpmtFormField + paidAmount) - Number(VnewIntPort);
          newCount = newCount + 1;
          VnewPrin = Number(VnewPrin) - Number(VnewPrinPort);
          leftBalance.push(VnewPrin);
        }
      } else {
        while (newCount < selectedMortgagePaymentsData.length + 1) {
          if (newCount < selectedMortgagePaymentsData.length) {
            VpmtFormField =
              selectedMortgagePaymentsData.length > 0
                ? Number(selectedMortgagePaymentsData[Number(newCount)].fees)
                : Number(this.state.amortizationsArray[newCount].interest) +
                  Number(this.state.amortizationsArray[newCount].principal);
          } else {
            VpmtFormField =
              Number(this.state.amortizationsArray[newCount].interest) +
              Number(this.state.amortizationsArray[newCount].principal);
          }

          let date = monthlyPayment[newCount].date;
          let month = date.getMonth();
          let year = date.getUTCFullYear();
          let firstDate = new Date(year, month, 1);
          let lastDate = new Date(year, month + 1, 0);
          let paidAmount = 0;

          this.state.adjustPaymentBalance
            .filter(x => new Date(x.date) >= firstDate && new Date(x.date) <= lastDate)
            .forEach(ele => {
              paidAmount = paidAmount + Number(ele.adjust_balance);
            });

          VnewIntPort = VnewPrin * VnewInt;
          VnewPrinPort = Number(VpmtFormField + paidAmount) - Number(VnewIntPort);
          newCount = newCount + 1;
          VnewPrin = Number(VnewPrin) - Number(VnewPrinPort);
          leftBalance.push(VnewPrin);
        }
      }

      this.renderSwapChange(selectedMortgagePaymentsData, leftBalance);

      this.setState({
        leftCurrentBalance: leftBalance
      });

      return Number(VnewPrin);
    } else {
      return null;
    }
  };

  handlePaymentChange = (event, index) => {
    const { amortizationsArray } = this.state;
    const { selectedMortgageData } = this.props;
    const balance = Number(selectedMortgageData.first_mortgage_loan_amount);
    const interest = Number(selectedMortgageData.loan_intrest_rate);
    const term = Number(selectedMortgageData.loan_term);
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const mortgagePayment = this.state.mortgagePayment.slice();

    if (value) {
      mortgagePayment[index][name] = value;
    } else {
      mortgagePayment[index][name] = 0;
    }

    var change = 'change';
    const currentBalance = this.calculateCuurentBalance(
      balance,
      interest,
      term,
      amortizationsArray,
      mortgagePayment,
      change
    );

    mortgagePayment[index]['balance'] = Number(this.state.leftCurrentBalance[index]).toFixed(2);

    mortgagePayment[index]['swap_balances'] = Number(this.state.swapBalance[index].value).toFixed(2);

    mortgagePayment[index]['swap_change'] = Number(this.state.swapChange[index].value).toFixed(2);

    mortgagePayment[index]['combine_balance'] = Number(this.state.combineBalance[index].value).toFixed(2);

    this.setState({
      mortgagePayment: mortgagePayment,
      currentBalance: currentBalance
    });
    if (event.target.value === null || event.target.value === undefined || event.target.value === '') {
      this.setState({
        checkInput: true
      });
    } else {
      this.setState({
        checkInput: false
      });
    }
  };

  submitMortgagePaymentData = (event, index) => {
    event.preventDefault();
    const mortgagePayment = this.state.mortgagePayment.slice();

    mortgagePayment[index]['balance'] = Number(this.state.leftCurrentBalance[index]).toFixed(2);

    mortgagePayment[index]['swap_balances'] = Number(this.state.swapBalance[index].value).toFixed(2);

    mortgagePayment[index]['swap_change'] = Number(this.state.swapChange[index].value).toFixed(2);

    mortgagePayment[index]['combine_balance'] = Number(this.state.combineBalance[index].value).toFixed(2);

    this.setState({
      mortgagePayment: mortgagePayment
    });
    const body = this.state.mortgagePayment[index];
    const url = updateMortgagePaymentData;

    fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(body)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        const data = this.state.mortgagePayment.slice();
        data[index] = findresponse.payments;

        this.setState({
          mortgagePayment: data,
          editMortgageIndex: undefined,
          addedMortgageIndex: undefined,
          isEdit: false
        });
        const { amortizationsArray } = this.state;
        const { selectedMortgageData } = this.props;
        const balance = Number(selectedMortgageData.first_mortgage_loan_amount);
        const interest = Number(selectedMortgageData.loan_intrest_rate);
        const term = Number(selectedMortgageData.loan_term);
        const mortgagePayment = this.state.mortgagePayment.slice();

        this.calculateCuurentBalance(balance, interest, term, amortizationsArray, mortgagePayment);
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  cancelEdit = index => {
    const newPaymentArray = JSON.parse(JSON.stringify(this.state.mortgagePayment));

    if (Number(this.state.editMortgageIndex) !== index) {
      newPaymentArray.splice(index, 1);
    }

    this.setState({
      editMortgageIndex: undefined,
      addedMortgageIndex: undefined,
      isAddPayment: true,
      isPaymentEdit: false,
      mortgagePayment: newPaymentArray
    });
  };

  addNewPayment = () => {
    const borrowerid = this.state.mortgageData.borrowerid;
    const newPaymentsData = {
      borrowerid: borrowerid,
      store_date: moment(new Date()).format('YYYY-MM-DD'),
      transaction_type: '',
      balance: 0,
      adjustment_amount: ''
    };

    const newPaymentArray = JSON.parse(JSON.stringify(this.state.paymentsData));
    newPaymentArray.push(newPaymentsData);

    this.setState({
      paymentsData: newPaymentArray
    });
  };

  deletePayment = (index, payment) => {
    if (payment.id) {
      const res = window.confirm('Do you want to delete this payment data?');

      if (res) {
        const body = { id: payment.id, borrowerid: payment.borrowerid };

        fetch(deleteSelectedMortgagePaymentData, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            auth_token: this.props.userData.token
          }),
          body: JSON.stringify(body)
        })
          .then(Response => Response.json())
          .then(findresponse => {
            const newPaymentArray = JSON.parse(JSON.stringify(this.state.paymentsData));
            newPaymentArray.splice(index, 1);

            this.setState({
              paymentsData: newPaymentArray
            });
          })
          .catch(err => {
            error(err.message);
            if (err.request && err.request.status === 401) {
              this.props.history.push('/login');
            }
          });
      }
    } else {
      const newPaymentArray = JSON.parse(JSON.stringify(this.state.paymentsData));
      newPaymentArray.splice(index, 1);

      this.setState({
        paymentsData: newPaymentArray
      });
    }
  };

  renderPaymentAmount = index => {
    let editValue;

    if (
      this.state.mortgagePayment[Number(index)] &&
      (this.state.editMortgageIndex === Number(index) || this.state.addedMortgageIndex === Number(index))
    ) {
      if (this.state.mortgagePayment[index]['fees']) {
        editValue = Number(this.state.mortgagePayment[index]['fees']);
      } else {
        if (!this.state.checkInput) {
          editValue = Number(
            this.state.amortizationsArray[0].interest + this.state.amortizationsArray[0].principal
          ).toFixed(2);
        }
      }

      return (
        <input
          type="number"
          name="fees"
          value={editValue}
          onChange={event => this.handlePaymentChange(event, Number(index))}
        />
      );
    } else if (!(this.state.editMortgageIndex === Number(index)) && !(this.state.addedMortgageIndex === Number(index)))
      return (
        <span>
          {this.state.mortgagePayment[Number(index)] ? this.state.mortgagePayment[Number(index)]['fees'] : ''}
        </span>
      );
  };

  renderButton = index => {
    const isSaveVisible =
      this.state.mortgagePayment[Number(index)] &&
      (this.state.editMortgageIndex === Number(index) || this.state.addedMortgageIndex === Number(index));
    const res =
      this.state.mortgagePayment[Number(index)] &&
      (this.state.editMortgageIndex === Number(index) - 1 || this.state.addedMortgageIndex === Number(index) - 1);

    if (this.state.mortgagePayment.length) {
      if (
        this.state.mortgagePayment[Number(index)] &&
        this.state.mortgagePayment[Number(index)]['fees'] &&
        !(this.state.editMortgageIndex === Number(index)) &&
        !(this.state.addedMortgageIndex === Number(index))
      )
        return (
          <button type="button" className="btn-controls" onClick={() => this.editMortgagePayment(Number(index))}>
            <i className="fa fa-pencil" />
          </button>
        );
      else if (isSaveVisible)
        return (
          <div>
            <button type="button" className="btn-controls" onClick={() => this.cancelEdit(Number(index))}>
              <i className="fa fa-times" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn-controls"
              onClick={event => this.submitMortgagePaymentData(event, Number(index))}
            >
              <i className="fa fa-check" />
            </button>
          </div>
        );
    }

    if (
      !res &&
      ((!this.state.mortgagePayment.length && Number(index) === 0) ||
        (this.state.mortgagePayment.length &&
          this.state.mortgagePayment.length === Number(index) &&
          !(this.state.addedMortgageIndex === Number(index)) &&
          !(this.state.editMortgageIndex === Number(index) && this.state.addedMortgageIndex === Number(index))))
    )
      return (
        <button type="button" className="btn-controls" onClick={() => this.addMortgagePayment(Number(index))}>
          <i className="fa fa-plus" />
        </button>
      );
    return null;
  };

  addMortgagePayment = index => {
    const propertyid = this.state.mortgageData.propertyid;
    const newPaymentsData = {
      propertyid: propertyid,
      payment_date: moment(this.state.amortizationsArray[index].date).format('YYYY-MM-DD'),
      principal_interest: this.state.amortizationsArray[index].interest,
      fees: Number(this.state.amortizationsArray[0].interest + this.state.amortizationsArray[0].principal).toFixed(2),
      balance: 0,
      swap_balances: 0,
      swap_change: 0,
      combine_balance: 0
    };
    const newPaymentArray = JSON.parse(JSON.stringify(this.state.mortgagePayment));
    newPaymentArray.push(newPaymentsData);
    const { amortizationsArray } = this.state;
    const { selectedMortgageData } = this.props;
    const balance = Number(selectedMortgageData.first_mortgage_loan_amount);
    const interest = Number(selectedMortgageData.loan_intrest_rate);
    const term = Number(selectedMortgageData.loan_term);
    const mortgagePayment = this.state.mortgagePayment.slice();

    this.setState(
      {
        mortgagePayment: newPaymentArray,
        isAddPayment: true,
        addedMortgageIndex: index,
        isPaymentEdit: false,
        editMortgageIndex: undefined
      },
      () => this.calculateCuurentBalance(balance, interest, term, amortizationsArray, mortgagePayment)
    );
  };

  editMortgagePayment = index => {
    this.setState({
      isAddPayment: false,
      addedMortgageIndex: undefined,
      isPaymentEdit: true,
      editMortgageIndex: index,
      isEdit: true
    });
  };

  handleChangeAdjustPayment = event => {
    const name = event.target.name;
    const value = event.target.value;
    const indexed = Number(event.target.id);
    const adjustPaymentBalance = this.state.adjustPaymentBalance.slice();

    if (value) {
      adjustPaymentBalance[indexed][name] = value;
    } else {
      adjustPaymentBalance[indexed][name] = 0;
    }

    this.setState({
      adjustPaymentBalance: adjustPaymentBalance
    });
  };

  renderDateElement = index => {
    const newIndex = this.state.newAdjustPaymentRowIndex;

    if (newIndex === index) {
      return (
        <input
          id={index}
          onChange={(event, index) => this.handleChangeAdjustPayment(event, index)}
          name="date"
          type="date"
          defaultValue={
            this.state.adjustPaymentBalance[index]['date']
              ? moment(this.state.adjustPaymentBalance[index]['date']).format('YYYY-MM-DD')
              : this.state.adjustPaymentBalance[index]['date']
          }
        />
      );
    } else {
      return (
        <span>
          {this.state.adjustPaymentBalance[index]['date']
            ? moment(this.state.adjustPaymentBalance[index]['date']).format('MM/DD/YYYY')
            : this.state.adjustPaymentBalance[index]['date']}
        </span>
      );
    }
  };

  renderCommentElement = index => {
    const newIndex = this.state.newAdjustPaymentRowIndex;

    if (newIndex === index) {
      return (
        <input
          id={index}
          name="comment"
          onChange={(event, index) => this.handleChangeAdjustPayment(event, index)}
          type="text"
          defaultValue={this.state.adjustPaymentBalance[index]['comment']}
        />
      );
    } else {
      return <span>{this.state.adjustPaymentBalance[index]['comment']}</span>;
    }
  };

  renderAdjustPaymentElement = index => {
    const newIndex = this.state.newAdjustPaymentRowIndex;

    if (newIndex === index) {
      return (
        <input
          id={index}
          name="adjust_balance"
          onChange={(event, index) => this.handleChangeAdjustPayment(event, index)}
          type="number"
          defaultValue={this.state.adjustPaymentBalance[index]['adjustPayment']}
        />
      );
    } else {
      return <span>{this.state.adjustPaymentBalance[index]['adjust_balance']}</span>;
    }
  };

  renderAdjustButton = index => {
    if (this.state.newAdjustPaymentRowIndex === index) {
      return (
        <div>
          {' '}
          <button type="button" className="btn-controls" onClick={() => this.cancelAjustPayment(Number(index))}>
            <i className="fa fa-times" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn-controls"
            onClick={event => this.saveAdjustPayment(event, Number(index))}
          >
            <i className="fa fa-check" />
          </button>
        </div>
      );
    }
  };

  renderAddButton = index => {
    const { newAdjustPaymentRowIndex, adjustPaymentBalance } = this.state;

    if (newAdjustPaymentRowIndex !== index && !newAdjustPaymentRowIndex && adjustPaymentBalance.length - 1 === index) {
      return (
        <button type="button" className="btn-controls" onClick={() => this.addAdjustPayment(Number(index))}>
          <i className="fa fa-plus" />
        </button>
      );
    }
  };

  addAdjustPayment = () => {
    const obj = {
      propertyid: this.props.selectedMortgageData.propertyid,
      date: new Date(),
      comment: '',
      adjust_balance: 0
    };
    const updatedArray = this.state.adjustPaymentBalance.slice();
    updatedArray.push(obj);

    this.setState({
      adjustPaymentBalance: updatedArray,
      newAdjustPaymentRowIndex: Number(updatedArray.length - 1)
    });
  };

  cancelAjustPayment = () => {
    const adjustPayment = this.state.adjustPaymentBalance.slice();
    adjustPayment.pop();

    this.setState({
      adjustPaymentBalance: adjustPayment,
      newAdjustPaymentRowIndex: undefined
    });
  };

  saveAdjustPayment = (event, index) => {
    event.preventDefault();
    const body = this.state.adjustPaymentBalance[index];

    const url = add_adjust_payment;

    fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        auth_token: this.props.userData.token
      }),
      body: JSON.stringify(body)
    })
      .then(Response => Response.json())
      .then(findresponse => {
        const data = this.state.adjustPaymentBalance.slice();
        data[index] = findresponse;

        this.setState({
          adjustPaymentBalance: data,
          newAdjustPaymentRowIndex: undefined
        });
        const { amortizationsArray } = this.state;
        const { selectedMortgageData } = this.props;
        const balance = Number(selectedMortgageData.first_mortgage_loan_amount);
        const interest = Number(selectedMortgageData.loan_intrest_rate);
        const term = Number(selectedMortgageData.loan_term);
        const mortgagePayment = this.state.mortgagePayment.slice();

        this.calculateCuurentBalance(balance, interest, term, amortizationsArray, mortgagePayment);
      })
      .catch(err => {
        error(err.message);
        if (err.request && err.request.status === 401) {
          this.props.history.push('/login');
        }
      });
  };

  associate = () => {
    let id = this.props.match.params.id;
    let hashcode = this.props.match.params.hashcode;

    if (hashCode && hashCode !== '') {
      this.props.history.push('/property-association/' + id + '/' + hashcode);
    }
  };

  render() {
    const { thead } = styles;

    return (
      <div className="col-xs-12">
        <MessageNotification />
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 pad-left-right-large">
              {hashCode && hashCode !== '' ? (
                <div className="col-xs-12 upper-filter-section pad-top-30 nopad">
                  <NavigationTab isMorgageList="true" />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <PropertyUpdate hashCode={hashCode} calculateCuurentBalance={this.calculateCuurentBalance} />

        <PropertyAssociatedHomeowner />

        <PropertyPoolHistory poolHistoryStateData={this.state.poolHistoryStateData} />

        {hashCode && hashCode !== '' ? (
          <div className="col-xs-12 margin-bottom nopad pad-up-down bg-white">
            <h4 className="col-xs-12 col-md-6 px-2 pad-down">Payment Schedule : </h4>
            <Scrollbars id="mortgageDataElement" className="scrollStyle" style={{ maxHeight: '60vh', height: '400px' }}>
              <table className="table table-borderless">
                <thead id="mortgageData" style={{ ...thead }}>
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Interest</th>
                    <th>Principal </th>
                    <th>Amount </th>
                    <th>Payment Amount </th>
                    <th>FMB</th>
                    <th>Swap Change </th>
                    <th>Swap Balance </th>
                    <th>Combine Balance </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.amortizationsArray.map((data, index) => (
                    <tr key={index}>
                      <td>{data.month}</td>
                      <td>{data.date ? moment(data.date).format('MM/DD/YYYY') : data.date}</td>
                      <td>{data.interest.toFixed(2)}</td>
                      <td>{data.principal.toFixed(2)}</td>
                      <td>{(data.interest + data.principal).toFixed(2)}</td>

                      <td>{this.renderPaymentAmount(index)}</td>
                      <td>
                        {index < this.state.leftCurrentBalance.length
                          ? this.state.leftCurrentBalance[index].toFixed(2)
                          : null}
                      </td>
                      <td>
                        {index < this.state.leftCurrentBalance.length
                          ? this.state.swapChange[index].value.toFixed(2)
                          : null}
                      </td>
                      <td>
                        {index < this.state.leftCurrentBalance.length
                          ? this.state.swapBalance[index].value.toFixed(2)
                          : null}
                      </td>
                      <td>
                        {index < this.state.leftCurrentBalance.length
                          ? this.state.combineBalance[index].value.toFixed(2)
                          : null}
                      </td>
                      <td>{this.renderButton(index)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scrollbars>
            {/* <div style={{ paddingTop: '27px', textAlign: 'center', fontSize: '17px' }}>Current Balance : {this.state.currentBalance}</div> */}
          </div>
        ) : null}

        {hashCode && hashCode !== '' ? (
          <div className="col-xs-12 nopad pad-up-down bg-white mb-3">
            <h4 className="col-xs-12 col-md-6 px-2 mt-0">Adjustment Payment: </h4>
            <div>
              {!this.state.adjustPaymentBalance.length ? (
                <button type="button" className="btn-controls" onClick={() => this.addAdjustPayment()}>
                  <i className="fa fa-plus" />
                </button>
              ) : null}
            </div>
            <div className="table-responsive col-xs-12">
              <table className="table table-borderless">
                <thead>
                  {this.state.adjustPaymentBalance.length > 0 ? (
                    <tr>
                      <th>Date</th>
                      <th>Comment</th>
                      <th>Adjust Balance</th>
                      <th />
                      <th />
                    </tr>
                  ) : null}
                </thead>
                <tbody>
                  {this.state.adjustPaymentBalance.map((data, index) => (
                    <tr key={index} style={{ height: '45px' }}>
                      <td>{this.renderDateElement(Number(index))}</td>
                      <td>{this.renderCommentElement(Number(index))}</td>
                      <td>{this.renderAdjustPaymentElement(Number(index))}</td>
                      <td>{this.renderAdjustButton(Number(index))}</td>
                      <td>{this.renderAddButton(Number(index))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        {/* <div className="col-xs-12 nopad" style={{ marginTop: '5px' }}>
              <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                <button type="submit" disabled={JSON.stringify(this.state.mortgageData) === JSON.stringify(this.props.selectedMortgageData)} className="btn btn-success btn-block">Save</button>
              </div>
              <div className="col-xs-6 col-sm-2 col-md-2 col-lg-1 pull-right pad-half">
                <button type="button" className="btn btn-orange btn-block" onClick={this.cancelMortgageUpdation}>Cancel</button>
              </div>
            </div> */}
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

MortgageUpdationFormComponent.defaultProps = {
  selectedMortgagePaymentsData: [],
  searchAdminText: '',
  selectedMortgageData: {},
  saveSelectedMortgageData: undefined,
  isLogin: false,
  userData: {},
  poolHistoryData: []
};

MortgageUpdationFormComponent.propTypes = {
  selectedMortgageData: PropTypes.object,
  selectedMortgagePaymentsData: PropTypes.arrayOf(Object),
  searchMortgage: PropTypes.string,
  searchAdminText: PropTypes.string,
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String),
  poolHistoryData: PropTypes.arrayOf(Object)
};

const mapStateToProps = state => {
  return {
    selectedMortgageData: state.admin.selectedMortgageData,
    selectedMortgagePaymentsData: state.admin.selectedMortgagePaymentsData,
    searchMortgage: state.admin.searchMortgage,
    searchAdminText: state.admin.searchAdminText,
    isLogin: state.login.isLogin,
    userData: state.login.userData,
    poolHistoryData: state.admin.poolHistoryData,
    poolId: state.admin.poolId
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    saveSelectedMortgageData: (mortgageData, paymentData) =>
    dispatch(saveSelectedMortgageData(mortgageData, paymentData)),
    error: data => dispatch(error(data)),
    success: data => dispatch(success(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MortgageUpdationFormComponent));
