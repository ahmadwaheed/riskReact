import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';

class PoolUpdationFeeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoader: false
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

  updateFee = () => {
    this.props.updateFee();
  };

  onFeeClose = () => {
    this.props.onFeeClose();
  };

  onchangeMonthlyFee = event => {
    this.props.onchangeMonthlyFee(event);
  };

  onChangeAnnualyFee = event => {
    this.props.onChangeAnnualyFee(event);
  };

  render() {
    return (
      <Modal open={this.props.isFee} classNames={{ modal: 'custom-modal' }} onClose={this.onFeeClose} center>
        <h2 className="modal-header">Update Fee</h2>
        <div className="modal-body">
          <div className="row form-group pad-down pad-half">
            <label htmlFor="" className="col-xs-5 pad-half" style={{ paddingTop: '7px' }}>
              Monthly flat subscription fee :
            </label>
            <div className="col-xs-7 pad-half">
              <input
                name="monthly"
                placeholder="Subscription Monthly Fee"
                defaultValue={this.props.subscriptionMonthlyFee}
                type="text"
                className="form-control"
                onChange={event => this.onchangeMonthlyFee(event)}
              />
              {this.props.isMonthly ? <span style={{ color: 'red' }}>Please enter number only</span> : null}
            </div>
          </div>

          <div className="row form-group pad-down pad-half">
            <label htmlFor="" className="col-xs-5 pad-half" style={{ paddingTop: '7px' }}>
              Basis points fee :
            </label>
            <div className="col-xs-7 pad-half">
              <input
                name="annual"
                placeholder="Subscription Annual Basis Point Fee"
                defaultValue={this.props.subscriptionAnnualyFee}
                type="text"
                className="form-control"
                onChange={event => this.onChangeAnnualyFee(event)}
              />
              {this.props.isAnnualy ? <span style={{ color: 'red' }}>Please enter number only</span> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 col-xs-offset-6">
              <button onClick={() => this.updateFee()} className="btn btn-block orange-bg btn-own">
                Update
              </button>
            </div>
            <div className="col-xs-3 text-right">
              <button onClick={this.onFeeClose} className="btn btn-block orange-bg btn-own">
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

PoolUpdationFeeModal.defaultProps = {
  userData: {}
};

PoolUpdationFeeModal.propTypes = {
  userData: PropTypes.objectOf(String)
};

const mapStateToProps = state => {
  return {
    userData: state.login.userData
  };
};

export default connect(
  mapStateToProps,
  null
)(withRouter(PoolUpdationFeeModal));
