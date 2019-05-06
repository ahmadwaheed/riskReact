import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { disableMessage } from './actions/admin/admin-action';
class MessageNotification extends React.Component {
  componentDidMount = () => {
    setInterval(() => {
      if (this.props.isError || this.props.isSuccess) {
        setTimeout(() => {
          this.props.disableMessage();
        }, 3000);
      }
    }, 2000);
  };

  render() {
    if (this.props.isSuccess && this.props.message !== '') {
      return (
        <div className="popup-success" style={{ paddingTop: '10px' }}>
          {this.props.message}
        </div>
      );
    } else if (this.props.isError && this.props.message !== '') {
      return (
        <div className="popup-failure" style={{ paddingTop: '10px' }}>
          {this.props.message}
        </div>
      );
    } else {
      return null;
    }
  }
}

MessageNotification.defaultProps = {
  isSuccess: false,
  isError: true,
  message: '',
  disableMessage: undefined
};

MessageNotification.protoTypes = {
  isError: PropTypes.bool,
  isSuccess: PropTypes.bool,
  message: PropTypes.string,
  disableMessage: PropTypes.func
};

const mapStateToProps = state => {
  return {
    message: state.admin.message,
    isSuccess: state.admin.isSuccess,
    isError: state.admin.isError
  };
};

export default connect(
  mapStateToProps,
  { disableMessage }
)(withRouter(MessageNotification));
