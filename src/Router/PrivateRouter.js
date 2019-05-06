import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect, withRouter } from 'react-router-dom';

class PrivateRouter extends React.Component {
  render() {
    const { isLogin, component: Component, path } = this.props;

    return (
      <Route
        path={path}
        render={() =>
          isLogin ? (
            <Component {...this.props} />
          ) : (
            <Redirect
              to={{
                pathname: '/login'
              }}
            />
          )
        }
      />
    );
  }
}

PrivateRouter.defaultProps = {
  isLogin: false,
  userData: {}
};

PrivateRouter.propTypes = {
  isLogin: PropTypes.bool,
  userData: PropTypes.objectOf(String)
};
const mapStateToProps = state => {
  return {
    isLogin: state.login.isLogin,
    userData: state.login.userData
  };
};

export default connect(mapStateToProps)(withRouter(PrivateRouter));
