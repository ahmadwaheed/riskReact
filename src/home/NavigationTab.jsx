import React from 'react';
import { Link } from 'react-router-dom';

class NavigationBar extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrop: false
    };
  }

  openDrop = () => {
    if (!this.state.isDrop) {
      this.setState({
        isDrop: true
      });
    } else {
      this.setState({
        isDrop: false
      });
    }
  };

  render() {
    return (
      <ul className="col-xs-12 nopad list-unstyled list-inline own-tab" style={{ zIndex: '99' }}>
        {this.props.isHome ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/home">Home</Link>
          </li>
        ) : (
          <li>
            <Link to="/home">Home</Link>
          </li>
        )}
        {this.props.isMap ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/map">Map</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/map">Map</Link>
          </li>
        )}
        {this.props.isSwap ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/portfolio-manager">Swap Funder</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/portfolio-manager">Swap Funder</Link>
          </li>
        )}
        <li
          onClick={this.openDrop}
          className={
            this.props.isZip || this.props.isMetro || this.props.isState || this.props.isMaster || this.props.isZip3
              ? 'active dropdown-own'
              : 'dropdown-own'
          }
          style={{ cursor: 'pointer' }}
        >
          {' '}
          Hpi Data
          {this.state.isDrop ? (
            <ul className="dropdown-container">
              {this.props.isMetro ? (
                <li onClick={this.openDrop} className="active">
                  {' '}
                  <Link to="/CbspaHpi">Metro</Link>
                </li>
              ) : (
                <li onClick={this.openDrop}>
                  {' '}
                  <Link to="/CbspaHpi">Metro</Link>
                </li>
              )}
              {this.props.isState ? (
                <li onClick={this.openDrop} className="active">
                  {' '}
                  <Link to="/StateHpi">State</Link>
                </li>
              ) : (
                <li onClick={this.openDrop}>
                  {' '}
                  <Link to="/StateHpi">State</Link>
                </li>
              )}
              {this.props.isZip ? (
                <li onClick={this.openDrop} className="active">
                  {' '}
                  <Link to="/ZipHpi">Zip</Link>
                </li>
              ) : (
                <li onClick={this.openDrop}>
                  {' '}
                  <Link to="/ZipHpi">Zip</Link>
                </li>
              )}
              {this.props.isMaster ? (
                <li onClick={this.openDrop} className="active">
                  {' '}
                  <Link to="/master">Master</Link>
                </li>
              ) : (
                <li onClick={this.openDrop}>
                  {' '}
                  <Link to="/master">Master</Link>
                </li>
              )}
              {this.props.isZip3 ? (
                <li onClick={this.openDrop} className="active">
                  {' '}
                  <Link to="/ZipHpi3">Zip3</Link>
                </li>
              ) : (
                <li onClick={this.openDrop}>
                  {' '}
                  <Link to="/ZipHpi3">Zip3</Link>
                </li>
              )}
            </ul>
          ) : null}
        </li>

        {this.props.isMorgageList ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/properties-list">Properties List</Link>
            {this.props.isAssociate ? (
              <ul className="col-xs-12 nopad list-unstyled list-inline own-sub-tab">
                <li className="active">
                  <Link to={'/property-association/' + this.props.id + '/' + this.props.hashcode}>Associate User</Link>
                </li>
              </ul>
            ) : null}
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/properties-list">Properties List</Link>
          </li>
        )}
        {this.props.isPools ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/mortgage-pool">Pools</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/mortgage-pool">Pools</Link>
          </li>
        )}
        {this.props.isPortfolio ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/portfolio_performance">Portfolio Performance</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/portfolio_performance">Portfolio Performance</Link>
          </li>
        )}
        {this.props.isUser ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/user-manager">User Manager</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/user-manager">User Manager</Link>
          </li>
        )}
        {this.props.isBusiness ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/business-manager">Business Manager</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/business-manager">Business Manager</Link>
          </li>
        )}
        {this.props.isLog ? (
          <li className="active" style={{ padding: '0px 0px' }}>
            {' '}
            <Link to="/logs">Logs</Link>
          </li>
        ) : (
          <li>
            {' '}
            <Link to="/logs">Logs</Link>
          </li>
        )}
      </ul>
    );
  }
}

export default NavigationBar;
