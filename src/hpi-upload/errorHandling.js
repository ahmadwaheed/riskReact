import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorHandling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAlert: true
    };
  }

  timer = () => {
    setTimeout(() => {
      this.props.handleErrorComp();
    }, 3000);
  };

  render() {
    const { color, message } = this.props;
    var aa = 'alert ' + color;

    if (this.state.isAlert) {
      return (
        <div className={aa} onClick={this.timer()}>
          <div>{message}</div>
        </div>
      );
    }

    return null;
  }
}

ErrorHandling.defaultProps = {
  color: '',
  message: '',
  isAlertb: false,
  handleErrorComp: undefined
};

ErrorHandling.propTypes = {
  color: PropTypes.String,
  message: PropTypes.String,
  isAlertb: PropTypes.bool,
  handleErrorComp: PropTypes.bool
};
