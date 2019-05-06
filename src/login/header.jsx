import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 login-logo white-bg">
            <img src="img/home-logonew.png" className="img/img-responsive center-block" alt="logo" />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
