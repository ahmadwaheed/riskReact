import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/logout';
import { logout2 } from '../../actions/login/loginAction';
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: this.props.userData
    };
  }
  //XXXXXXXXXXXXXXXXXXXXXXXXXfunction XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    this.props.logout();
    this.props.history.push('/');
    this.props.logout2(false);
  };

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  render() {
    return (
      <div>
        <div className="own-header-section white-bg">
          <div className="container-fluid">
            <div className="row ">
              <div className="col-xs-12 flex-center">
                <div className="col-sm-6">
                  <Link to="/home">
                  <img src="img/home-logonew.png" className="img-responsive" alt="logo" />
                  </Link>
                </div>
                <div className="col-sm-6">
                  <div className="user-details-wrapper">
                    <div
                      style={{ backgroundImage: "url('" + this.props.userData.avatar_url + "')" }}
                      className="user-image"
                    />
                    <div className="user-details">
                      <div className="user-name">{this.props.userData.name}</div>
                      <div className="user-designation">{this.props.userData.role}</div>
                      <div className="user-company-name">{this.props.userData.company}</div>
                    </div>
                    <div className="logout-icon cursor-own" onClick={() => this.logout()}>
                      <img src="img/log-out-icon.png" alt="logout" title="Logout" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth_data: state.hpi.counter
  };
};

// what to do if i want to call the onIncrementCounter......just use this.props.onIncrementCounter
const mapDispatchToProps = dispatch => {
  return {
    logout: data => dispatch(logout(data)),
    logout2: value => dispatch(logout2(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Header));

// export default withRouter(Header);
